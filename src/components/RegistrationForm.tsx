"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

type CategoryOption = { id: string; name: string };

type DossierRow = {
  title: string;
  hours: string;
};

type ActivityRow = {
  categoryId: string;
  hours: string;
};

function parseHours(value: string) {
  return Number(value.replace(",", ".")) || 0;
}

function formatHours(value: number) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function toDossierRows(
  dossiers: Array<{ title: string; hours: number }>,
): DossierRow[] {
  return dossiers.map((dossier) => ({
    title: dossier.title,
    hours: formatHours(dossier.hours),
  }));
}

function toActivityRows(
  activities: Array<{ categoryId: string; hours: number }>,
): ActivityRow[] {
  return activities.map((activity) => ({
    categoryId: activity.categoryId,
    hours: formatHours(activity.hours),
  }));
}

export function RegistrationForm({
  employee,
  categories,
  defaultDate,
}: {
  employee: { id: string; name: string };
  categories: CategoryOption[];
  defaultDate: string;
}) {
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [dossiers, setDossiers] = useState<DossierRow[]>([]);
  const [comment, setComment] = useState("");
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [hasExistingRegistration, setHasExistingRegistration] = useState(false);
  const [loadingRegistration, setLoadingRegistration] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedDateLabel = useMemo(() => {
    return format(parseISO(selectedDate), "d MMMM yyyy", { locale: nl });
  }, [selectedDate]);

  const isToday = selectedDate === defaultDate;

  const loadRegistration = useCallback(async (date: string) => {
    setLoadingRegistration(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch(`/api/registrations?date=${date}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Registratie ophalen mislukt");
      }

      if (data.registration) {
        setComment(data.registration.comment ?? "");
        setDossiers(toDossierRows(data.registration.dossiers));
        setActivities(toActivityRows(data.registration.activities));
        setHasExistingRegistration(true);
      } else {
        setComment("");
        setDossiers([{ title: "", hours: "" }]);
        setActivities([]);
        setHasExistingRegistration(false);
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Registratie ophalen mislukt");
      setComment("");
      setDossiers([]);
      setActivities([]);
      setHasExistingRegistration(false);
    } finally {
      setLoadingRegistration(false);
    }
  }, []);

  useEffect(() => {
    loadRegistration(selectedDate);
  }, [selectedDate, loadRegistration]);

  function addDossierRow() {
    setDossiers((rows) => [...rows, { title: "", hours: "" }]);
  }

  function updateDossier(index: number, patch: Partial<DossierRow>) {
    setDossiers((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)));
  }

  function removeDossier(index: number) {
    setDossiers((rows) => rows.filter((_, rowIndex) => rowIndex !== index));
  }

  function addActivityRow() {
    setActivities((rows) => [...rows, { categoryId: categories[0]?.id ?? "", hours: "1" }]);
  }

  function updateActivity(index: number, patch: Partial<ActivityRow>) {
    setActivities((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)));
  }

  function removeActivity(index: number) {
    setActivities((rows) => rows.filter((_, rowIndex) => rowIndex !== index));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const parsedDossiers = dossiers
      .filter((dossier) => dossier.title.trim() && parseHours(dossier.hours) > 0)
      .map((dossier) => ({
        title: dossier.title.trim(),
        hours: parseHours(dossier.hours),
      }));

    const parsedActivities = activities
      .filter((activity) => activity.categoryId && parseHours(activity.hours) > 0)
      .map((activity) => ({
        categoryId: activity.categoryId,
        hours: parseHours(activity.hours),
      }));

    if (parsedDossiers.length === 0 && parsedActivities.length === 0) {
      setStatus("error");
      setMessage("Vul minimaal één dossier of andere werkzaamheid in.");
      return;
    }

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          dossiers: parsedDossiers,
          comment,
          activities: parsedActivities,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Opslaan mislukt");
      }

      setStatus("success");
      setMessage(data.message);
      setHasExistingRegistration(true);
      await loadRegistration(selectedDate);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  }

  const totalDossierHours = dossiers.reduce((sum, dossier) => sum + parseHours(dossier.hours), 0);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="ind-info-box text-sm">
        Ingelogd als <strong>{employee.name}</strong>
      </div>

      <section className="space-y-3 border border-[var(--border)] bg-white p-4 md:p-5">
        <div>
          <label className="label" htmlFor="registration-date">
            Datum
          </label>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Kies een datum om een eerdere registratie te bekijken of aan te passen.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            id="registration-date"
            className="input max-w-xs"
            type="date"
            value={selectedDate}
            max={defaultDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            disabled={loadingRegistration || status === "loading"}
          />
          <div className="ind-info-box text-sm">
            {isToday ? "Vandaag" : "Geselecteerd"} — <strong>{selectedDateLabel}</strong>
          </div>
        </div>
        {!loadingRegistration && (
          <p className="text-sm text-[var(--muted)]">
            {hasExistingRegistration
              ? "Er is al een registratie voor deze datum. U kunt deze hieronder bekijken en aanpassen."
              : "Nog geen registratie voor deze datum. Vul hieronder uw gegevens in."}
          </p>
        )}
      </section>

      {loadingRegistration ? (
        <div className="ind-info-box text-sm">Registratie laden...</div>
      ) : (
        <>
          <section className="space-y-4 border border-[var(--border)] bg-[var(--ind-purple-light)] p-4 md:p-5">
            <div>
              <h2 className="ind-section-heading">Dossierafhandeling</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Registreer per dossier een titel en het aantal uren dat u eraan heeft besteed.
              </p>
            </div>

            <div className="ind-help-box">
              <p className="font-semibold text-[var(--primary)]">Zo vult u dossiers in</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--muted)]">
                <li>
                  Klik op <strong>+ Dossier toevoegen</strong> om een invoerregel toe te voegen.
                </li>
                <li>
                  Vul bij <strong>Dossiertitel</strong> een herkenbare naam in, bijvoorbeeld &quot;Naturalisatieaanvraag de
                  Vries&quot;.
                </li>
                <li>
                  Vul bij <strong>Uren besteed</strong> het aantal uren in. Gebruik een komma of punt voor halve uren,
                  bijvoorbeeld <strong>4,5</strong> of <strong>4.5</strong> voor vier en een half uur.
                </li>
                <li>Herhaal dit voor elk dossier dat u die dag hebt afgehandeld.</li>
              </ol>
            </div>

            {dossiers.length === 0 ? (
              <div className="ind-empty-state">
                <p className="text-sm text-[var(--muted)]">Nog geen dossierregel toegevoegd.</p>
                <button type="button" className="btn btn-secondary mt-3" onClick={addDossierRow}>
                  + Dossier toevoegen
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="hidden gap-3 px-4 md:grid md:grid-cols-[1fr_180px_auto]">
                  <span className="label mb-0">Dossiertitel</span>
                  <span className="label mb-0">Uren besteed</span>
                  <span className="sr-only">Actie</span>
                </div>
                {dossiers.map((dossier, index) => (
                  <div
                    key={index}
                    className="grid gap-3 border border-[var(--border)] bg-white p-4 md:grid-cols-[1fr_180px_auto]"
                  >
                    <div>
                      <label className="label" htmlFor={`dossier-title-${index}`}>
                        Dossiertitel
                      </label>
                      <input
                        id={`dossier-title-${index}`}
                        className="input"
                        value={dossier.title}
                        onChange={(event) => updateDossier(index, { title: event.target.value })}
                        placeholder="Bijv. Naturalisatieaanvraag de Vries"
                      />
                      <p className="mt-1 text-xs text-[var(--muted)]">Geef het dossier een herkenbare naam.</p>
                    </div>
                    <div>
                      <label className="label" htmlFor={`dossier-hours-${index}`}>
                        Uren besteed
                      </label>
                      <input
                        id={`dossier-hours-${index}`}
                        className="input"
                        type="text"
                        inputMode="decimal"
                        value={dossier.hours}
                        onChange={(event) => updateDossier(index, { hours: event.target.value })}
                        placeholder="Bijv. 4,5"
                      />
                      <p className="mt-1 text-xs text-[var(--muted)]">Halve uren: 4,5 of 4.5</p>
                    </div>
                    <div className="flex items-start md:pt-7">
                      <button type="button" className="btn btn-secondary w-full md:w-auto" onClick={() => removeDossier(index)}>
                        Verwijder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <button type="button" className="btn btn-secondary" onClick={addDossierRow}>
                + Dossier toevoegen
              </button>
              {dossiers.length > 0 && (
                <p className="text-sm text-[var(--muted)]">
                  Totaal:{" "}
                  <strong>{dossiers.filter((d) => d.title.trim() && parseHours(d.hours) > 0).length}</strong> dossier
                  {dossiers.filter((d) => d.title.trim() && parseHours(d.hours) > 0).length === 1 ? "" : "s"},{" "}
                  <strong>{totalDossierHours.toLocaleString("nl-NL")}</strong> uur
                </p>
              )}
            </div>
          </section>

          <section className="space-y-4 border border-[var(--border)] bg-[var(--ind-purple-light)] p-4 md:p-5">
            <div>
              <h2 className="ind-section-heading">Overige werkzaamheden</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Voeg per activiteit toe hoeveel uren u heeft besteed, bijvoorbeeld overleg, opleiding of
                administratief werk. Ook hier kunt u halve uren invoeren, bijvoorbeeld 1,5.
              </p>
            </div>

            {activities.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Nog geen andere werkzaamheden toegevoegd.</p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="grid gap-3 border border-[var(--border)] bg-white p-4 md:grid-cols-[1fr_180px_auto]"
                  >
                    <div>
                      <label className="label" htmlFor={`activity-category-${index}`}>
                        Activiteit
                      </label>
                      <select
                        id={`activity-category-${index}`}
                        className="input"
                        value={activity.categoryId}
                        onChange={(event) => updateActivity(index, { categoryId: event.target.value })}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor={`activity-hours-${index}`}>
                        Uren besteed
                      </label>
                      <input
                        id={`activity-hours-${index}`}
                        className="input"
                        type="text"
                        inputMode="decimal"
                        value={activity.hours}
                        onChange={(event) => updateActivity(index, { hours: event.target.value })}
                        placeholder="Bijv. 1,5"
                      />
                    </div>
                    <div className="flex items-start md:pt-7">
                      <button type="button" className="btn btn-secondary w-full md:w-auto" onClick={() => removeActivity(index)}>
                        Verwijder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button type="button" className="btn btn-secondary" onClick={addActivityRow}>
              + Werkzaamheid toevoegen
            </button>
          </section>

          <div>
            <label className="label" htmlFor="comment">
              Opmerking
            </label>
            <textarea
              id="comment"
              className="input min-h-24"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Optionelijk"
            />
          </div>
        </>
      )}

      {status === "success" && <div className="ind-success-box">{message}</div>}
      {status === "error" && <div className="ind-error-box">{message}</div>}

      <section className="ind-form-submit">
        <h2 className="ind-section-heading">Opslaan</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Klik op de knop hieronder om uw registratie voor <strong>{selectedDateLabel}</strong> op te slaan. U kunt
          later terugkomen via de datumkiezer bovenaan om eerdere dagen te bekijken of aan te passen.
        </p>
        <button
          type="submit"
          className="btn btn-primary mt-4 w-full text-lg"
          disabled={loadingRegistration || status === "loading"}
        >
          {status === "loading" ? "Bezig met opslaan..." : "Registratie opslaan"}
        </button>
      </section>
    </form>
  );
}

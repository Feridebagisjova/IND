"use client";

import { useState } from "react";

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

export function RegistrationForm({
  employee,
  categories,
  today,
}: {
  employee: { id: string; name: string };
  categories: CategoryOption[];
  today: string;
}) {
  const [dossiers, setDossiers] = useState<DossierRow[]>([]);
  const [comment, setComment] = useState("");
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function addDossierRow() {
    setDossiers((rows) => [...rows, { title: "", hours: "1" }]);
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
      setComment("");
      setDossiers([]);
      setActivities([]);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Opslaan mislukt");
    }
  }

  if (status === "success") {
    return (
      <div className="ind-success-box">
        <p className="text-lg font-semibold">Registratie opgeslagen</p>
        <p className="mt-2">{message}</p>
        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
        >
          Nieuwe registratie
        </button>
      </div>
    );
  }

  const totalDossierHours = dossiers.reduce((sum, dossier) => sum + parseHours(dossier.hours), 0);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="ind-info-box text-sm">
        Ingelogd als <strong>{employee.name}</strong>
      </div>

      <section className="space-y-4 border border-[var(--border)] bg-[var(--ind-purple-light)] p-4 md:p-5">
        <div>
          <h2 className="ind-section-heading">Dossierafhandeling</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Voeg per dossier een titel en het aantal bestede uren toe.
          </p>
        </div>

        {dossiers.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nog geen dossiers toegevoegd.</p>
        ) : (
          <div className="space-y-3">
            {dossiers.map((dossier, index) => (
              <div
                key={index}
                className="grid gap-3 border border-[var(--border)] bg-white p-4 md:grid-cols-[1fr_140px_auto]"
              >
                <div>
                  <label className="label md:sr-only" htmlFor={`dossier-title-${index}`}>
                    Dossiertitel
                  </label>
                  <input
                    id={`dossier-title-${index}`}
                    className="input"
                    value={dossier.title}
                    onChange={(event) => updateDossier(index, { title: event.target.value })}
                    placeholder="Bijv. Naturalisatieaanvraag de Vries"
                    required
                  />
                </div>
                <div>
                  <label className="label md:sr-only" htmlFor={`dossier-hours-${index}`}>
                    Uren
                  </label>
                  <input
                    id={`dossier-hours-${index}`}
                    className="input"
                    type="number"
                    min="0"
                    step="0.5"
                    value={dossier.hours}
                    onChange={(event) => updateDossier(index, { hours: event.target.value })}
                    placeholder="Uren"
                    required
                  />
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => removeDossier(index)}>
                  Verwijder
                </button>
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
              Totaal: <strong>{dossiers.length}</strong> dossier{dossiers.length === 1 ? "" : "s"},{" "}
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
            administratief werk.
          </p>
        </div>

        {activities.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nog geen andere werkzaamheden toegevoegd.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="grid gap-3 border border-[var(--border)] bg-white p-4 md:grid-cols-[1fr_140px_auto]"
              >
                <div>
                  <label className="label md:sr-only" htmlFor={`activity-category-${index}`}>
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
                  <label className="label md:sr-only" htmlFor={`activity-hours-${index}`}>
                    Uren
                  </label>
                  <input
                    id={`activity-hours-${index}`}
                    className="input"
                    type="number"
                    min="0"
                    step="0.5"
                    value={activity.hours}
                    onChange={(event) => updateActivity(index, { hours: event.target.value })}
                    placeholder="Uren"
                  />
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => removeActivity(index)}>
                  Verwijder
                </button>
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
          placeholder="Optioneel"
        />
      </div>

      {status === "error" && <div className="ind-error-box">{message}</div>}

      <button type="submit" className="btn btn-primary w-full text-lg" disabled={status === "loading"}>
        {status === "loading" ? "Opslaan..." : "Registratie opslaan"}
      </button>
      <p className="text-center text-sm text-[var(--muted)]">Datum: {new Date(today).toLocaleDateString("nl-NL")}</p>
    </form>
  );
}

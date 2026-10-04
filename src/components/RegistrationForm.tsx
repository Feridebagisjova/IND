"use client";

import { useEffect, useMemo, useState } from "react";

type EmployeeOption = { id: string; name: string };
type CategoryOption = { id: string; name: string };

type ActivityRow = {
  categoryId: string;
  hours: string;
};

const STORAGE_KEY = "ind_employee_id";

export function RegistrationForm({
  employees,
  categories,
  today,
}: {
  employees: EmployeeOption[];
  categories: CategoryOption[];
  today: string;
}) {
  const [employeeId, setEmployeeId] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [productionUnits, setProductionUnits] = useState(0);
  const [comment, setComment] = useState("");
  const [showActivities, setShowActivities] = useState(false);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === employeeId),
    [employeeId, employees],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && employees.some((employee) => employee.id === saved)) {
      setEmployeeId(saved);
    }
  }, [employees]);

  function addActivityRow() {
    setActivities((rows) => [...rows, { categoryId: categories[0]?.id ?? "", hours: "1" }]);
    setShowActivities(true);
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

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          pinCode,
          productionUnits,
          comment,
          activities: showActivities
            ? activities
                .filter((activity) => activity.categoryId && Number(activity.hours) > 0)
                .map((activity) => ({
                  categoryId: activity.categoryId,
                  hours: Number(activity.hours.replace(",", ".")),
                }))
            : [],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Opslaan mislukt");
      }

      window.localStorage.setItem(STORAGE_KEY, employeeId);
      setStatus("success");
      setMessage(data.message);
      setPinCode("");
      setComment("");
      setProductionUnits(0);
      setActivities([]);
      setShowActivities(false);
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

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="employee">
            Medewerker
          </label>
          <select
            id="employee"
            className="input"
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            required
          >
            <option value="">Selecteer medewerker</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pin">
            Persoonlijke 4-cijfercode
          </label>
          <input
            id="pin"
            className="input"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={pinCode}
            onChange={(event) => setPinCode(event.target.value)}
            placeholder="••••"
            required
          />
        </div>
      </div>

      {selectedEmployee && (
        <div className="ind-info-box text-sm">
          Geselecteerd: <strong>{selectedEmployee.name}</strong>
        </div>
      )}

      <div>
        <label className="label">Hoeveel dossiers heb je vandaag afgehandeld?</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="btn btn-secondary h-12 w-12 rounded-full text-xl"
            onClick={() => setProductionUnits((value) => Math.max(0, value - 1))}
          >
            -
          </button>
          <div className="min-w-16 text-center text-3xl font-semibold">{productionUnits}</div>
          <button
            type="button"
            className="btn btn-secondary h-12 w-12 rounded-full text-xl"
            onClick={() => setProductionUnits((value) => value + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div>
        <p className="label">Heb je vandaag tijd besteed aan andere werkzaamheden?</p>
        {!showActivities ? (
          <button type="button" className="btn btn-secondary" onClick={addActivityRow}>
            + Andere werkzaamheden toevoegen
          </button>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="grid gap-3 border border-[var(--border)] p-4 md:grid-cols-[1fr_120px_auto]">
                <select
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
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.5"
                  value={activity.hours}
                  onChange={(event) => updateActivity(index, { hours: event.target.value })}
                  placeholder="Uren"
                />
                <button type="button" className="btn btn-secondary" onClick={() => removeActivity(index)}>
                  Verwijder
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addActivityRow}>
              + Nog een werkzaamheid
            </button>
          </div>
        )}
      </div>

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

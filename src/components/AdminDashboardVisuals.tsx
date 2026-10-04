"use client";

import { useState } from "react";
import { formatDeviation, formatNumber } from "@/lib/metrics";
import { RealizationBadge } from "./AdminUi";

export type DashboardRow = {
  id: string;
  name: string;
  team: string;
  dossierNorm: number;
  totalProduction: number;
  dossierRealization: number;
  dossierDeviation: number;
  dossierRealizationColor: "green" | "orange" | "red";
  trend: string;
  dossierEntries: Array<{ date: string; title: string; hours: number }>;
  activityEntries: Array<{ date: string; name: string; hours: number }>;
};

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
  });
}

export function AdminDashboardCharts({ rows }: { rows: DashboardRow[] }) {
  const maxValue = Math.max(
    100,
    ...rows.map((row) => row.dossierRealization),
    ...rows.map((row) => Math.max(row.dossierNorm, row.totalProduction)),
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <section className="card p-5">
        <h3 className="text-lg font-semibold text-[var(--primary)]">Realisatie per medewerker</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Percentage t.o.v. de dossiernorm in deze periode.</p>
        <div className="admin-chart mt-5 space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="admin-chart-row">
              <div className="admin-chart-label">
                <span className="font-medium">{row.name}</span>
                <span className="text-sm text-[var(--muted)]">{Math.round(row.dossierRealization)}%</span>
              </div>
              <div className="admin-chart-track">
                <div
                  className={`admin-chart-bar admin-chart-bar-${row.dossierRealizationColor}`}
                  style={{ width: `${Math.min(100, (row.dossierRealization / maxValue) * 100)}%` }}
                />
                <div className="admin-chart-norm-line" style={{ left: `${(100 / maxValue) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">Stippellijn = 100% (norm)</p>
      </section>

      <section className="card p-5">
        <h3 className="text-lg font-semibold text-[var(--primary)]">Behaald vs norm</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Aantal dossiers per medewerker in deze periode.</p>
        <div className="admin-chart mt-5 space-y-5">
          {rows.map((row) => {
            const normWidth = maxValue > 0 ? (row.dossierNorm / maxValue) * 100 : 0;
            const achievedWidth = maxValue > 0 ? (row.totalProduction / maxValue) * 100 : 0;

            return (
              <div key={row.id} className="admin-chart-row">
                <div className="admin-chart-label">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-sm text-[var(--muted)]">
                    {formatNumber(row.totalProduction, 0)} / {formatNumber(row.dossierNorm, 1)}
                  </span>
                </div>
                <div className="admin-chart-track admin-chart-track-double">
                  <div className="admin-chart-bar admin-chart-bar-norm" style={{ width: `${normWidth}%` }} />
                  <div
                    className={`admin-chart-bar admin-chart-bar-achieved admin-chart-bar-${row.dossierRealizationColor}`}
                    style={{ width: `${achievedWidth}%` }}
                  />
                </div>
                <div className="admin-chart-legend">
                  <span>
                    <i className="admin-chart-dot admin-chart-dot-norm" /> Norm
                  </span>
                  <span>
                    <i className="admin-chart-dot admin-chart-dot-achieved" /> Behaald
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function AdminEmployeeTable({ rows }: { rows: DashboardRow[] }) {
  return (
    <div className="card table-wrap">
      <table className="admin-expandable-table">
        <thead>
          <tr>
            <th aria-hidden="true" className="w-10" />
            <th>Medewerker</th>
            <th>Team</th>
            <th>Norm dossiers</th>
            <th>Behaald</th>
            <th>Realisatie</th>
            <th>Afwijking t.o.v. norm</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <AdminEmployeeRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminEmployeeRow({ row }: { row: DashboardRow }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={`admin-expandable-row ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setExpanded((value) => !value);
          }
        }}
        tabIndex={0}
        aria-expanded={expanded}
      >
        <td className="admin-expand-icon">{expanded ? "▾" : "▸"}</td>
        <td className="font-medium text-[var(--primary)]">{row.name}</td>
        <td>{row.team}</td>
        <td>{formatNumber(row.dossierNorm, 1)}</td>
        <td>{formatNumber(row.totalProduction, 0)}</td>
        <td>
          <RealizationBadge value={row.dossierRealization} color={row.dossierRealizationColor} />
        </td>
        <td>
          <span className={`badge badge-${row.dossierRealizationColor}`}>
            {formatDeviation(row.dossierDeviation)}
          </span>
        </td>
        <td>{row.trend}</td>
      </tr>
      {expanded && (
        <tr className="admin-expandable-detail">
          <td colSpan={8}>
            <div className="admin-expandable-panel">
              <div className="grid gap-6 lg:grid-cols-2">
                <section>
                  <h4 className="admin-expandable-heading">Dossiers</h4>
                  {row.dossierEntries.length === 0 ? (
                    <p className="text-sm text-[var(--muted)]">Geen dossiers geregistreerd in deze periode.</p>
                  ) : (
                    <ul className="admin-detail-list">
                      {row.dossierEntries.map((entry, index) => (
                        <li key={`${entry.date}-${entry.title}-${index}`}>
                          <span className="admin-detail-date">{formatShortDate(entry.date)}</span>
                          <span className="admin-detail-title">{entry.title}</span>
                          <span className="admin-detail-hours">{formatNumber(entry.hours, 1)} uur</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h4 className="admin-expandable-heading">Overige werkzaamheden</h4>
                  {row.activityEntries.length === 0 ? (
                    <p className="text-sm text-[var(--muted)]">Geen andere werkzaamheden geregistreerd.</p>
                  ) : (
                    <ul className="admin-detail-list">
                      {row.activityEntries.map((entry, index) => (
                        <li key={`${entry.date}-${entry.name}-${index}`}>
                          <span className="admin-detail-date">{formatShortDate(entry.date)}</span>
                          <span className="admin-detail-title">{entry.name}</span>
                          <span className="admin-detail-hours">{formatNumber(entry.hours, 1)} uur</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <p className="mt-4 text-sm text-[var(--muted)]">
                Klik opnieuw op de regel om te sluiten, of open het{" "}
                <a href={`/admin/employees/${row.id}`} className="ind-text-link" onClick={(event) => event.stopPropagation()}>
                  volledige medewerkerprofiel
                </a>
                .
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

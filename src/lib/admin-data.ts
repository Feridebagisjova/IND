import { prisma } from "@/lib/prisma";
import {
  aggregateMetrics,
  calculateMetrics,
  getPeriodRange,
  getRealizationColor,
  startOfDay,
  toDateKey,
} from "@/lib/metrics";

export type Period = "today" | "week" | "month" | "year";

export async function getSettings() {
  return prisma.appSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {},
  });
}

export async function getDashboardData(params: {
  period?: Period;
  employeeId?: string;
  teamId?: string;
}) {
  const period = params.period ?? "month";
  const { start, end } = getPeriodRange(period);
  const settings = await getSettings();

  const employees = await prisma.employee.findMany({
    where: {
      active: true,
      ...(params.employeeId ? { id: params.employeeId } : {}),
      ...(params.teamId ? { teamId: params.teamId } : {}),
    },
    include: {
      team: true,
      normProfile: true,
      registrations: {
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
        include: {
          dossiers: true,
          activities: {
            include: { category: true },
          },
        },
        orderBy: { date: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const rows = employees.map((employee) => {
    const metrics = aggregateMetrics(
      employee.registrations,
      employee.hoursPerDay,
      employee.normProfile,
    );

    const previousPeriodStart = new Date(start);
    const previousPeriodEnd = new Date(end);
    const spanDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - spanDays);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - spanDays);

    return {
      id: employee.id,
      name: employee.name,
      team: employee.team?.name ?? "—",
      hoursPerDay: employee.hoursPerDay,
      ...metrics,
      realizationColor: getRealizationColor(
        metrics.realization,
        settings.thresholdGreen,
        settings.thresholdOrange,
      ),
      trend: metrics.realization >= 100 ? "↑" : metrics.realization >= 90 ? "→" : "↓",
    };
  });

  const totals = rows.reduce(
    (acc, row) => {
      acc.totalProduction += row.totalProduction;
      acc.totalCorrectedNorm += row.totalCorrectedNorm;
      acc.totalAvailableHours += row.totalAvailableHours;
      return acc;
    },
    { totalProduction: 0, totalCorrectedNorm: 0, totalAvailableHours: 0 },
  );

  const realization =
    totals.totalCorrectedNorm > 0
      ? (totals.totalProduction / totals.totalCorrectedNorm) * 100
      : 0;

  return {
    period,
    start,
    end,
    settings,
    rows,
    totals: {
      ...totals,
      realization,
    },
  };
}

export async function getEmployeeDetail(employeeId: string, period: Period = "month") {
  const { start, end } = getPeriodRange(period);
  const settings = await getSettings();

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      team: true,
      normProfile: true,
      registrations: {
        where: { date: { gte: start, lte: end } },
        include: {
          dossiers: true,
          activities: {
            include: { category: true },
          },
        },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!employee) return null;

  const summary = aggregateMetrics(
    employee.registrations,
    employee.hoursPerDay,
    employee.normProfile,
  );

  const activityTotals = new Map<string, number>();
  for (const registration of employee.registrations) {
    for (const activity of registration.activities) {
      activityTotals.set(
        activity.category.name,
        (activityTotals.get(activity.category.name) ?? 0) + activity.hours,
      );
    }
  }

  const dailyRows = employee.registrations.map((registration) => {
    const metrics = calculateMetrics({
      hoursPerDay: employee.hoursPerDay,
      normProfile: employee.normProfile,
      productionUnits: registration.productionUnits,
      activities: registration.activities.map((activity) => ({
        hours: activity.hours,
        reducesProductiveTime: activity.category.reducesProductiveTime,
      })),
    });

    return {
      date: registration.date,
      production: registration.productionUnits,
      productionHours: registration.productionHours,
      correctedNorm: metrics.correctedNorm,
      realization: metrics.realization,
      dossiers: registration.dossiers,
      activities: registration.activities,
      comment: registration.comment,
    };
  });

  return {
    employee,
    summary: {
      ...summary,
      realizationColor: getRealizationColor(
        summary.realization,
        settings.thresholdGreen,
        settings.thresholdOrange,
      ),
    },
    activityTotals: [...activityTotals.entries()].map(([name, hours]) => ({ name, hours })),
    dailyRows,
  };
}

export async function getCompletenessData(period: Period = "week") {
  const { start, end } = getPeriodRange(period);
  const employees = await prisma.employee.findMany({
    where: { active: true },
    include: {
      registrations: {
        where: { date: { gte: start, lte: end } },
        select: { date: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const days: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day >= 1 && day <= 5) {
      days.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const rows = employees.map((employee) => {
    const registeredDates = new Set(employee.registrations.map((registration) => toDateKey(registration.date)));
    const dayStatuses = days.map((day) => registeredDates.has(toDateKey(day)));
    const completed = dayStatuses.filter(Boolean).length;
    return {
      id: employee.id,
      name: employee.name,
      dayStatuses,
      completed,
      total: dayStatuses.length,
    };
  });

  const totalSlots = rows.reduce((sum, row) => sum + row.total, 0);
  const completedSlots = rows.reduce((sum, row) => sum + row.completed, 0);
  const completeness = totalSlots > 0 ? (completedSlots / totalSlots) * 100 : 0;

  return { days, rows, completeness };
}

export async function getFilterOptions() {
  const [employees, teams] = await Promise.all([
    prisma.employee.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  return { employees, teams };
}

export function getTodayKey() {
  return toDateKey(startOfDay(new Date()));
}

import type { ActivityCategory, NormProfile, Registration, RegistrationActivity } from "@prisma/client";

export type RegistrationWithActivities = Registration & {
  activities: (RegistrationActivity & { category: ActivityCategory })[];
};

export type EmployeeMetricsInput = {
  hoursPerDay: number;
  normProfile: Pick<NormProfile, "hoursPerDay" | "targetUnits">;
  productionUnits: number;
  activities: Array<{ hours: number; reducesProductiveTime: boolean }>;
};

export function getProductivityRate(normProfile: Pick<NormProfile, "hoursPerDay" | "targetUnits">) {
  if (normProfile.hoursPerDay <= 0) return 0;
  return normProfile.targetUnits / normProfile.hoursPerDay;
}

export function calculateMetrics(input: EmployeeMetricsInput) {
  const nonProductiveHours = input.activities
    .filter((activity) => activity.reducesProductiveTime)
    .reduce((sum, activity) => sum + activity.hours, 0);

  const availableHours = Math.max(0, input.hoursPerDay - nonProductiveHours);
  const rate = getProductivityRate(input.normProfile);
  const baseNorm = input.normProfile.targetUnits;
  const correctedNorm = availableHours * rate;
  const realization =
    correctedNorm > 0 ? (input.productionUnits / correctedNorm) * 100 : input.productionUnits > 0 ? 100 : 0;

  return {
    baseNorm,
    correctedNorm,
    productionUnits: input.productionUnits,
    nonProductiveHours,
    availableHours,
    realization,
    rate,
  };
}

export function getRealizationColor(
  realization: number,
  green = 100,
  orange = 90,
): "green" | "orange" | "red" {
  if (realization >= green) return "green";
  if (realization >= orange) return "orange";
  return "red";
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatNumber(value: number, digits = 1) {
  return value.toLocaleString("nl-NL", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

export function getPeriodRange(period: "today" | "week" | "month" | "year", reference = new Date()) {
  const start = startOfDay(reference);
  const end = endOfDay(reference);

  if (period === "today") {
    return { start, end };
  }

  if (period === "week") {
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (period === "month") {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  start.setMonth(0, 1);
  end.setMonth(11, 31);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function aggregateMetrics(
  registrations: RegistrationWithActivities[],
  hoursPerDay: number,
  normProfile: Pick<NormProfile, "hoursPerDay" | "targetUnits">,
) {
  let totalProduction = 0;
  let totalNonProductiveHours = 0;
  let totalCorrectedNorm = 0;
  let totalAvailableHours = 0;

  for (const registration of registrations) {
    const metrics = calculateMetrics({
      hoursPerDay,
      normProfile,
      productionUnits: registration.productionUnits,
      activities: registration.activities.map((activity) => ({
        hours: activity.hours,
        reducesProductiveTime: activity.category.reducesProductiveTime,
      })),
    });

    totalProduction += metrics.productionUnits;
    totalNonProductiveHours += metrics.nonProductiveHours;
    totalCorrectedNorm += metrics.correctedNorm;
    totalAvailableHours += metrics.availableHours;
  }

  const realization = totalCorrectedNorm > 0 ? (totalProduction / totalCorrectedNorm) * 100 : 0;

  return {
    totalProduction,
    totalNonProductiveHours,
    totalCorrectedNorm,
    totalAvailableHours,
    realization,
    baseNorm: normProfile.targetUnits * registrations.length,
  };
}

export function getWeekdayLabels() {
  return ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

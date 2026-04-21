import { interiorCases, weddingCases } from "@/data/mock-data";

export type CompareInput = {
  category: "wedding" | "interior";
  region?: string;
  budget?: number;
  guests?: number;
  areaPy?: number;
};

const avg = (values: number[]) =>
  values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

const range = (values: number[]) => ({
  min: values.length ? Math.min(...values) : 0,
  max: values.length ? Math.max(...values) : 0
});

export function compareCosts(input: CompareInput) {
  if (input.category === "wedding") {
    const filtered = weddingCases.filter((item) => {
      if (input.region && item.region !== input.region) return false;
      if (input.guests && Math.abs(item.guests - input.guests) > 40) return false;
      return true;
    });

    const totals = filtered.map((item) => item.totalCost);
    return {
      category: "wedding" as const,
      count: filtered.length,
      averageTotal: avg(totals),
      totalRange: range(totals),
      averageByItem: {
        mealCost: avg(filtered.map((item) => item.mealCost)),
        hallCost: avg(filtered.map((item) => item.hallCost)),
        sdmCost: avg(filtered.map((item) => item.sdmCost)),
        optionCost: avg(filtered.map((item) => item.optionCost))
      },
      cases: filtered
    };
  }

  const filtered = interiorCases.filter((item) => {
    if (input.region && item.region !== input.region) return false;
    if (input.areaPy && Math.abs(item.areaPy - input.areaPy) > 8) return false;
    return true;
  });

  const totals = filtered.map((item) => item.totalCost);
  return {
    category: "interior" as const,
    count: filtered.length,
    averageTotal: avg(totals),
    totalRange: range(totals),
    averageByItem: {
      unitCostPy: avg(filtered.map((item) => item.unitCostPy)),
      optionCost: avg(filtered.map((item) => item.optionCost))
    },
    cases: filtered
  };
}

export function compareWeddingCosts(input: Omit<CompareInput, "category">) {
  return compareCosts({ ...input, category: "wedding" });
}

export function compareInteriorCosts(input: Omit<CompareInput, "category">) {
  return compareCosts({ ...input, category: "interior" });
}

export function estimateGap(targetBudget: number, averageTotal: number) {
  return targetBudget - averageTotal;
}

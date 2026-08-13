export type ModelCostReceipt = {
  costUsd: number;
  vendor: string;
};

export function readModelCostReceipt(headers: Headers): ModelCostReceipt {
  const cost = headers.get("x-infrai-cost-usd");
  const vendor = headers.get("x-infrai-vendor");

  if (cost === null || vendor === null) {
    throw new Error("The model response is missing cost receipt headers");
  }

  const costUsd = Number(cost);
  if (!Number.isFinite(costUsd) || costUsd < 0) {
    throw new Error("The model response contains an invalid cost value");
  }

  return { costUsd, vendor };
}

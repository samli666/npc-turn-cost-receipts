import assert from "node:assert/strict";
import test from "node:test";
import { readModelCostReceipt } from "../src/model_cost_receipt.ts";

test("reads the cost and serving vendor for one model call", () => {
  const headers = new Headers({
    "x-infrai-cost-usd": "0.00042",
    "x-infrai-vendor": "example-vendor",
  });

  assert.deepEqual(readModelCostReceipt(headers), {
    costUsd: 0.00042,
    vendor: "example-vendor",
  });
});

test("rejects an incomplete receipt", () => {
  const headers = new Headers({ "x-infrai-cost-usd": "0.00042" });

  assert.throws(
    () => readModelCostReceipt(headers),
    /missing cost receipt headers/,
  );
});

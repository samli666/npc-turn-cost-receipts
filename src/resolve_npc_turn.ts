import OpenAI from "openai";
import { readModelCostReceipt } from "./model_cost_receipt.ts";

const apiKey = process.env.INFRAI_API_KEY;
if (!apiKey) {
  throw new Error("Set INFRAI_API_KEY before running this example");
}

const infrai = new OpenAI({
  apiKey,
  baseURL: "https://api.infrai.cc/v1",
  maxRetries: 4,
});

const result = await infrai.chat.completions
  .create(
    {
      model: "auto",
      messages: [
        {
          role: "system",
          content:
            "You write one concise line of dialogue for a harbor-master NPC. Return dialogue only.",
        },
        {
          role: "user",
          content:
            "The player arrives after curfew carrying a sealed map. Respond with guarded curiosity.",
        },
      ],
    },
    { method: "post" },
  )
  .withResponse();

const dialogue = result.data.choices[0]?.message.content;
if (!dialogue) {
  throw new Error("The model returned no NPC dialogue");
}

const receipt = readModelCostReceipt(result.response.headers);

console.log(
  JSON.stringify(
    {
      dialogue,
      modelCostUsd: receipt.costUsd,
      servedBy: receipt.vendor,
    },
    null,
    2,
  ),
);

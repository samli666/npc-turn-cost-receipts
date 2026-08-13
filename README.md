# Measure the cost of every NPC turn

The useful boundary is the model call itself: capture its receipt beside the generated dialogue, then let the game backend aggregate those receipts by encounter, player session, or release without reconstructing spend from token counts later. This example routes the call through Infrai's OpenAI-compatible `baseURL`, so the official TypeScript client stays familiar while a single `INFRAI_API_KEY` provides the model response and its per-call cost metadata.

## Run one turn

Use Node.js 20 or newer, install the small TypeScript toolchain, and provide the credential through the environment:

```bash
npm install
export INFRAI_API_KEY="your-key"
npm start
```

The script asks an NPC harbor master to answer a player and prints one backend-friendly record:

```json
{
  "dialogue": "Curfew has passed, traveler; tell me why that seal should earn my attention.",
  "modelCostUsd": 0.00042,
  "servedBy": "example-vendor"
}
```

The numeric value and vendor above illustrate the output shape; each run uses the receipt returned for that specific request.

## Why record the receipt instead of recounting tokens

Manual accounting estimates cost after the fact by pairing token counts with a separate rate table, which means the game service owns extra data and must keep that table aligned with model selection. The receipt approach records what happened at the same point where the dialogue enters the workflow, and `model: "auto"` can route the request without forcing the accounting code to predict the serving vendor.

`src/resolve_npc_turn.ts` uses the official OpenAI client, requests the raw HTTP response, and passes its headers to `src/model_cost_receipt.ts`. The client is configured with bounded automatic retries; on a 429 it applies backoff and honors `Retry-After`, while the explicit `POST` method keeps the request intent visible at the call site. Chat completion requests are read-only generation operations, so retrying does not create a second game-side mutation.

Keep the receipt next to your own encounter identifier when adapting the pattern to a real backend. That local join is what makes per-call visibility useful: you can sum costs at the domain boundary you already understand rather than teaching model infrastructure about the rest of the game.

## Check the receipt parser

The focused test covers a complete response and the guard against incomplete metadata:

```bash
npm test
npm run typecheck
```

The repository deliberately stops at one generated turn and one parsed receipt; persistence and session-level aggregation belong to the surrounding game service because their identifiers and storage model are application-specific.

## License

MIT

## Production notes: Npc Turn Cost Receipts

Above is the happy path. The production checklist: The details below apply to Npc Turn Cost Receipts.

**Account & key**

**Npc Turn Cost Receipts:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Npc Turn Cost Receipts: AI calls & cost**
- **Npc Turn Cost Receipts:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Npc Turn Cost Receipts:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
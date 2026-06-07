# Context Score

> A single 0–100 number per domain that answers one question: **how ready is
> this domain to give you a good answer?** Roll the per-domain scores up and you
> get **Life Readiness** — how ready your whole vault is.

Context Score is computed by the engine, not the UI. Every shell (CLI cockpit,
desktop, channels) reads the same number via
[`prevail score <domain> --json`](../fd-apps-prevail-cli/docs/ENGINE-JSON-API.md).
The wire shape is [`ContextScore`](../fd-apps-prevail-cli/docs/schemas/ContextScore.json).

## Why it exists

A domain is only as good as the context it carries. An empty `wealth/` folder
will give you generic answers; a dense, fresh, well-structured one gives you
answers grounded in your actual life. The Context Score makes that gap visible
and tells you exactly what to fix.

## The breakdown

The score is a weighted blend of six factors. Each is reported in
`ContextScore.breakdown` so a shell can show the sub-scores, not just the total.

| Factor | What it measures |
|---|---|
| **coverage** | Are the core files present? (`state.md`, `QUICKSTART.md`, `PROMPTS.md`, `config.md`) |
| **density** | Is there enough substance — real content, not stub headings? |
| **freshness** | How recently was the domain touched? Stale context decays. |
| **structure** | Are the document folders (`00_current/`, `01_prior/`, `02_briefs/`) and skills organized? |
| **activity** | Is there recent log / journal / thread activity? |
| **config_completeness** | Is the `manifest.json` filled in — identity, goals, routing? |

`breakdown.<factor>` carries the per-factor `score` and `weight` so the total is
reproducible and explainable.

## What's missing

`ContextScore.missing` is an array of
[`MissingItem`](../fd-apps-prevail-cli/docs/schemas/MissingItem.json) — concrete,
actionable gaps ("no `state.md`", "manifest has no goals", "nothing in
`00_current/`"). This is what powers the "fix this next" nudges in every shell.

## The optional audit

By default the score is **deterministic and free** — pure file inspection, no
LLM call. Add `--audit` and the engine also asks a model to write a short
narrative `assessment` of the domain's readiness, populating `assessment` and
`audit_source`. Without `--audit`, both are `null`.

The audit respects the global guardrails: `--budget <tokens>` caps the spend and
`--local-only` forces a local engine (or no audit at all). See
[Privacy / local-only](#) in the docs site.

## History

Every computed score is appended to `<domain>/_log/score.jsonl` — one JSONL line
per point, append-only. `prevail score history <domain> --json` returns the
series oldest → newest so a shell can draw a trend line. This is the JSONL leg of
Prevail's [storage rule](./ARCHITECTURE.md#the-storage-rule): time-series →
JSONL.

```jsonc
[ { "ts": 1748000000000, "score": 71 },
  { "ts": 1749220200000, "score": 78 } ]
```

## Life Readiness

`prevail score --all --json` scores every (non-archived) domain and adds a
`lifeReadiness` roll-up — a single 0–100 number across your whole vault, plus the
array of per-domain `ContextScore`s behind it.

```jsonc
{ "lifeReadiness": 81,
  "domains": [ ContextScore, ContextScore ] }
```

## How shells use it

- **Cockpit / desktop** — a badge per domain in the sidebar; the overall
  Life Readiness in the header; the `missing` list as a checklist.
- **Onboarding** — newly-scaffolded domains start with a low score and a full
  `missing` list, which becomes the new user's to-do path.
- **Heartbeat** — a scheduled routine can re-score a domain and alert you if it
  drops below a threshold (stale context).

All of them call the same `--json` command. The number is computed once, in the
engine.

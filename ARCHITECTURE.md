# Architecture

> **One engine, many shells.** All logic lives in a single headless engine. Every
> surface — the terminal cockpit, the desktop app, the channels/Telegram gateway
> — is a thin shell that talks to that engine over one frozen JSON contract.

## The shape

```
        ┌──────────── shells (thin) ────────────┐
        │  cockpit (TUI)   desktop   channels    │
        │       │            │          │        │
        └───────┴────────────┴──────────┴────────┘
                         │
              prevail … --json  (one frozen contract)
                         ▼
        ┌──────────────── engine ────────────────┐
        │  domains · manifest · score · onboard   │
        │  chat · vault backup/archive · heartbeat│
        └──────────────────┬──────────────────────┘
                           ▼
        ┌──────────────── the vault ──────────────┐
        │   plain files you own — md / json /      │
        │   jsonl / sqlite                         │
        └──────────────────────────────────────────┘
```

## One engine

There is exactly one place where logic lives: the engine. It reads and mutates
the vault, computes the [Context Score](./CONTEXT-SCORE.md), runs onboarding,
streams chat turns, backs up and archives domains, and installs heartbeat
routines. It owns the vault; the shells never touch vault files directly.

## Many shells

A shell renders state and forwards intent. It does **not** parse markdown,
compute scores, or write to the vault on its own. It calls the engine and draws
the result. That's why the same Context Score, the same domain list, and the
same chat stream appear identically in the TUI, the desktop app, and over
Telegram — there is only one implementation.

This keeps shells thin and swappable: a new surface only has to speak the JSON
contract.

## The contract

The boundary between engine and shells is the **Engine JSON API** — every
command accepts `--json` and emits a single JSON value (or NDJSON for streams) on
stdout. The contract is frozen and documented, with JSON Schemas and fixtures so
a UI can be built before the engine command even exists.

- Contract: [`fd-apps-prevail-cli/docs/ENGINE-JSON-API.md`](../fd-apps-prevail-cli/docs/ENGINE-JSON-API.md)
- Schemas: [`fd-apps-prevail-cli/docs/schemas/`](../fd-apps-prevail-cli/docs/schemas/)
- Fixtures: [`fd-apps-prevail-cli/docs/fixtures/`](../fd-apps-prevail-cli/docs/fixtures/)

Global flags apply to every command: `--vault <path>`, `--json`,
`--local-only`, `--budget <tokens>`.

## The storage rule

Prevail stores each kind of data in the format that fits it — and the choice is
not ad-hoc. There is one rule:

| Data kind | Format | Where | Why |
|---|---|---|---|
| **Human content** (your life, decisions, skills) | **Markdown** | `<domain>/state.md`, `skills/*.md`, `_journal/` | You own it, you edit it, you grep it, you diff it. |
| **Structured config / records** | **JSON** | `<domain>/manifest.json`, `~/.prevail/config.json` | Machine-merged, schema-validated, deep-mergeable. |
| **Append-only time series** | **JSONL** | `_log/score.jsonl`, `_threads/<id>.jsonl` | One event per line, append-only, collision-resistant across machines. |
| **Machine-local cache / index** | **SQLite** | `~/.prevail/sessions/` (FTS5 search) | Fast queries, full-text search — never your source of truth, never synced. |

In one line: **human truth is Markdown, config is JSON, history is JSONL,
caches/indexes are SQLite.** The first three live in the vault and sync; SQLite
is machine-local and never syncs.

## The two halves

The engine keeps a hard line between **your data** and **machine-local state**:

- **Vault** — wherever you chose (e.g. `~/life-vault/`). Markdown + JSON + JSONL.
  Sync this.
- **Machine-local** — `~/.prevail/`. Secrets (Telegram/OAuth tokens at `0600`),
  the SQLite session DB, caches. **Never sync this.**

This split is what makes the storage rule safe: everything that's portable and
yours is plain text in the vault; everything that's secret or derived stays
local.

## Privacy / local-only

The engine is local-first. The only network calls are the AI CLIs you already
have installed, invoked with a scrubbed environment. Any single invocation can be
forced fully offline with `--local-only`, which forbids network/cloud engines
and tools and overrides config. Combined with `--budget`, the engine never spends
tokens — or reaches the network — without you asking.

See the docs site for the full privacy and security model, and
[`fd-apps-prevail-cli/docs/threat-model.md`](../fd-apps-prevail-cli/docs/threat-model.md).

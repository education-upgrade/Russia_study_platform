# Pathway Status Audit

This document records the actual development state of pathways. It is more precise than the original `ready` / `planned` registry flag and should be read alongside `lib/pathwayReadiness.ts`.

## Status definitions

- **Ready**: complete modular pathway, all standard activities present, preview tested and merged.
- **Needs audit**: a route exists or was previously marked ready, but it has not yet passed the current eight-activity modular standard.
- **In development**: active work exists on a branch or pull request but is not yet merged.
- **Planned**: curriculum metadata exists, but the pathway has not been built to the current standard.

## Ready pathways

| Course week | Pathway | Evidence |
|---:|---|---|
| 1 | Russia in 1855 | Complete modular pathway audited and tested through PR #12. |
| 2 | Crimean War | Complete modular pathway; lesson, timeline, flashcards, quiz, judgement, AO3, PEEL and confidence tested. |
| 4 | Why serfdom had to end | Complete modular pathway with all standard activities tested. |
| 5 | Emancipation of the serfs | Complete modular pathway merged through PR #10. |

## Needs-audit pathways

| Pathway | Reason |
|---|---|
| Alexander II's wider reforms | Modular route exists, but the main route and complete fallback activity set require checking. |
| Alexander II reform overview | Older custom implementation; should be treated as a recap/bridging pathway until standardised. |
| 1905 Revolution | Existing pilot pathway; requires modern modular and content QA audit. |

## Planned Unit 1 pathways

- Power, ideology and control
- Reform to preserve autocracy?
- Essay skills focus: Alexander II

## Standard activity sequence

A complete full-study pathway should use this order:

1. `lesson_content`
2. `timeline`
3. `flashcards`
4. `quiz`
5. `judgement_ranking`
6. `ao3_interpretation`
7. `peel_response`
8. `confidence_exit_ticket`

The teacher assignment form and modular activity registry already use this sequence. Older custom pathways may still use the earlier five-activity sequence and should be standardised when audited.

## Next audit order

1. Alexander II's wider reforms
2. Alexander II reform overview
3. 1905 Revolution

After each audit, update `lib/pathwayReadiness.ts`. Only move a pathway to `ready` after all routes load, fallback content is complete, assignment flow works and at least one saved response is visible in teacher progress.

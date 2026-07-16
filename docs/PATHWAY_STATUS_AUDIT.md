# Pathway Status Audit

This document records the actual development state of pathways. It is more precise than the original `ready` / `planned` registry flag and should be read alongside `lib/pathwayReadiness.ts`.

## Status definitions

- **Ready**: complete modular pathway, all standard activities present, preview tested and merged.
- **Ready — recap**: a working optional consolidation pathway retained for revision or bridging. It is not part of the core teaching sequence and does not need to duplicate every activity from the full-study pathways.
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
| 6 | Alexander II's wider reforms | Complete modular pathway audited and tested through PR #13. |
| 23 | 1905 Revolution | Complete modular pathway audited and tested through PR #17. |

## Ready recap pathways

| Pathway | Purpose | Decision |
|---|---|---|
| Alexander II reform overview | Synoptic consolidation of Crimean War defeat, serfdom, backwardness, unrest and reform from above. | Retain the route and saved-response compatibility, but do not treat it as another core lesson or expand it into duplicate content. |

## Needs-audit pathways

There are currently no remaining previously built pathways awaiting audit.

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

The teacher assignment form and modular activity registry already use this sequence. Recap pathways may use a smaller evidence sequence when that avoids unnecessary duplication.

## Next development priority

All previously built pathways have now been reviewed. The next priority is to complete the remaining planned Unit 1 pathways before beginning wider architecture hardening or scaling into later units.

Only move a full-study pathway to `ready` after all routes load, fallback content is complete, assignment flow works and at least one saved response is visible in teacher progress.

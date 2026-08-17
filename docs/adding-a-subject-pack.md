# Adding a subject pack

New subjects should be added through configuration and curriculum content, not by cloning teacher or student workflows.

## Core invariants
A new subject reuses authentication, classes, assignments, dashboards, progress/resume, Complete-Incomplete-Not attempted, confidence, scores, attempts, evidence, Student History, Tracking, Interventions, Insights, resources and exports.

If a new subject requires edits to those workflows, decide whether the missing capability belongs in shared core or the subject pack before proceeding.

## Minimum pack
Create `subjects/<subject-id>/` with:
- `identity.ts`: course identity and branding
- `courseUnits.ts`: units and pathway slugs
- `pathways.ts`: assignment pathways
- `activityPresets.ts`: activity choices, timings, study modes and default instructions
- `index.ts`: assembled `SubjectPack`

Then register it in `subjects/index.ts`.

## Validation contract
`assertValidSubjectPack` checks that pathway slugs and activity IDs are unique, every unit references a real pathway, every study mode has an activity, and presets only use activities exposed by that pack. Configuration mistakes therefore fail at the subject boundary rather than producing a broken Set Work screen.

## Metrics contract
Subject packs may change curriculum, labels, activities and study-mode composition. They do not redefine the core measurement model: assignment/activity status, completion percentage, confidence, score/max score, attempt count and timestamps remain platform-owned.

## Russia transition
Russia is the first pack. Identity, units and assignment presets are already subject-owned. The large legacy pathway registry remains temporarily behind `subjects/history-russia/pathways.ts` so curriculum can be relocated incrementally without changing the public pack contract.

## Portability test
Before enabling genuine multi-subject classes, build a small second pack with two or three pathways. It passes only if it can use Set Work and the existing student/teacher metrics without modifying dashboards, Tracking, Interventions, evidence or progress-saving code.

# Subject portability audit

## Purpose

The shared platform must be able to run a non-History subject pack without changing teacher/student workflow code. Psychology (`aqa-psychology-7182`) is the first live proof deployment.

## Functional checks now passed

- Active deployment identity comes from `NEXT_PUBLIC_ACTIVE_SUBJECT_ID`.
- Landing page and login branding use the active subject identity.
- Teacher Set Work reads pathways, activity labels and presets from the active subject pack.
- Guided-study assignment creation resolves the requested pathway through the shared subject runtime.
- Unknown subject pathways fail explicitly instead of silently falling back to a Russia lesson.
- Student Home and My Work resolve assignment routes through the subject-aware runtime.
- Modular pathway pages resolve subject-specific pathway metadata and activity labels.
- Browser, server and shared Supabase clients support `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, with the legacy anon key retained as a fallback.
- Psychology Conformity can be assigned, launched and opened as a modular student pathway using the same assignment/progress workflow as Russia.

## Changes made in PR #103

1. Centralise exact pathway resolution in `lib/activeSubjectRuntime.ts`.
2. Remove the dangerous implicit fallback where an unknown pathway could be converted into an unrelated legacy Russia pathway.
3. Make the guided-study API use the shared subject runtime instead of directly combining the active pack with the Russia registry.
4. Make pathway activity labels resolve from the owning subject pack, so virtual/fallback activities do not inherit History-specific display labels.

## Intentional legacy dependencies still present

These do not currently prevent Psychology or another separate subject deployment, but should be removed before a true single-deployment, multi-subject architecture is considered complete.

- Some modular pathway components import CSS from the original `/student/lesson/1905` implementation. This is visual reuse, not route resolution, but the styles should eventually move to a neutral shared module.
- `unit6RegistryActivation` remains as a compatibility side effect for older Russia pathways that have not yet been fully represented in the subject pack. New subjects must not depend on it.
- `lib/pathwayRegistry.ts` remains the legacy History registry. The shared runtime may use an exact entry from it only as a backwards-compatible Russia fallback; new subject pathways belong in `subjects/<subject>/pathways.ts`.
- The global activity renderer registry contains activity types originally created for History (for example AO3 interpretation). Subject packs control which of those activity types they expose to teachers. Future subject-specific renderer types can be added to the shared registry without putting curriculum content there.

## Rule for adding the next subject

A new subject should normally require only:

1. `subjects/<subject>/identity.ts`
2. `subjects/<subject>/courseUnits.ts`
3. `subjects/<subject>/pathways.ts`
4. subject activity options/presets
5. pathway content and route entry points
6. registration in `subjects/index.ts`
7. `NEXT_PUBLIC_ACTIVE_SUBJECT_ID` in the deployment

If adding a subject requires editing Student Home, My Work, Set Work, assignment publishing, authentication or progress tracking, treat that as a portability regression and fix the shared layer instead.

## Next architecture phase

The current deployment chooses one active subject at build/runtime configuration level. The next major phase is multi-subject classes in one app: class/course records should carry subject identity, and student/teacher screens should resolve the relevant subject pack from the class or assignment rather than from one deployment-wide active subject.

# Recall verification checklist

- [x] Database migration is additive only.
- [x] Existing progress-table row counts checked before and after migration.
- [x] Recall tables have RLS and anonymous access revoked.
- [x] One response per question per session is enforced by a unique constraint.
- [x] Session/stat totals are rebuilt from saved responses for retry safety.
- [x] MCQ correct positions are cycled across A/B/C/D at presentation time.
- [x] Short-answer marking includes explicit alternatives plus conservative typo tolerance.
- [x] Mobile student navigation accommodates the new Recall destination.
- [ ] Production build / preview deployment passes.
- [ ] Authenticated student end-to-end browser flow verified on preview.
- [ ] Existing assignment save flow smoke-tested on preview.

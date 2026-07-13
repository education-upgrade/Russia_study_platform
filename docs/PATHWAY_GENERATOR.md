# Pathway Generator

Use the generator to create a safe, consistent scaffold for a new modular pathway.

## Command

```bash
npm run generate:pathway -- \
  --slug=emancipation-serfs \
  --title="Emancipation of the Serfs" \
  --lesson-title="How far did emancipation improve the lives of Russian peasants?" \
  --subtitle="Terms, gains, limitations, redemption payments and the mir" \
  --year=Y12 \
  --week=5 \
  --unit=1 \
  --unit-title="Russia in 1855 and the need for reform"
```

## Files created

The generator creates:

- `lib/pathway<PascalCase>Content.ts`
- `app/student/lesson/<slug>/page.tsx`
- `app/student/lesson/<slug>/[activity]/page.tsx`

It also prints a planned pathway-registry entry for manual review and insertion.

## Safety rules

- Existing files are never overwritten.
- Slugs must use lowercase kebab-case.
- Generated pathways contain placeholders and remain `planned`.
- Registry changes remain manual because course week, unit, breadth lenses and written focus require academic judgement.
- Replace all placeholders and complete the quality checklist in `docs/CONTENT_AUTHORING_GUIDE.md` before marking a pathway `ready`.

## Standard generated activities

- lesson content
- timeline
- flashcards
- quiz
- judgement ranking
- AO3 interpretation
- PEEL response
- confidence exit ticket

The generator creates structure only. It does not invent finished historical content or seed Supabase automatically.

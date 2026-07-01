# Stabilisation audit

Branch: `stabilise-current-main`

Purpose: stabilise the current app before adding more lessons, routes or class-management features.

## Known good deployment

The last confirmed successful Vercel deployment was commit:

`30e62534b201d8526db0ec09b89e2199170f219a`

Vercel build notes from that deployment:

- Next.js detected as `16.2.5`
- Build completed successfully
- Static and dynamic app routes generated correctly
- Teacher and student routes were present

Safe rollback branches already created:

- `stable-vercel-working-30e6253`
- `restore-production-to-30e6253`

## Current architecture

The strongest long-term structure is the modular pathway system:

```text
app/student/lesson/[specific-lesson]/page.tsx
  -> components/pathway/ModularPathwayPage.tsx
  -> components/pathway/ResolvedModularPathwayPage.tsx
  -> lib/pathwayRegistry.ts
  -> Supabase lesson/activity rows + fallback content
```

Activity pages follow the same reusable pattern:

```text
app/student/lesson/[specific-lesson]/[activity]/page.tsx
  -> components/pathway/ModularActivityPage.tsx
  -> components/pathway/ResolvedModularActivityPage.tsx
  -> components/GenericActivityRenderer.tsx
```

`GenericActivityRenderer` is currently the cleanest reusable engine. It supports:

- flashcards
- quiz
- timeline
- card sort
- judgement ranking
- AO3 interpretation
- PEEL response
- confidence exit ticket
- coming soon fallback

## Immediate risks

### 1. Dependency instability

`package.json` previously used `latest` for runtime and dev dependencies. This meant Vercel could install different versions on different days without a code change.

Action taken on this branch:

- pinned `next` to the version used in the last successful Vercel build
- pinned React/React DOM to patched `19.2.1`
- pinned TypeScript and type packages
- pinned Supabase client to a fixed 2.x version

Next follow-up:

- generate and commit `package-lock.json` from a successful local install/build

### 2. Demo student identity

The app still uses the hard-coded demo student id:

```ts
22222222-2222-2222-2222-222222222222
```

This is acceptable for prototype testing but not for real class use.

Next follow-up:

- isolate this into one config file
- later replace it with Supabase Auth/session user identity

### 3. Supabase table assumptions

The new class-joining feature expects these tables/constraints to exist:

- `classes`
- `class_memberships`
- active class status
- unique conflict target: `class_id,student_id`

If Supabase has not been migrated, `/api/classes/join` will fail.

Next follow-up:

- confirm the SQL migration has been run before exposing `/join-class` in production navigation
- keep class joining treated as experimental until DB is verified

### 4. Mixed old/new routing

The platform is moving towards a reusable pathway engine, but individual lesson folders are still manually created.

Current pattern is workable for the prototype, but the long-term goal should be:

```text
/student/lesson/[lessonSlug]
/student/lesson/[lessonSlug]/[activity]
```

rather than manually maintaining many separate lesson route folders.

Next follow-up:

- do not add more one-off routes until the generic dynamic route is confirmed safe

### 5. Teacher dashboard complexity

`TeacherEvidenceDashboard.tsx` has become compressed and harder to maintain. It still follows the right data flow, but it needs formatting and separation into smaller components before further teacher features are added.

Next follow-up:

- refactor without changing behaviour
- keep one commit for formatting/refactor only

## Safe development order from here

1. Confirm this branch builds on Vercel.
2. If build passes, open a PR into `main`.
3. Add a package lockfile from a successful install.
4. Add a single `lib/demoIdentity.ts` file and replace repeated demo ID constants.
5. Document/verify Supabase migration state.
6. Only then add new lesson content.
7. Move towards generic dynamic lesson routes after the current manual wrappers are stable.

## Do not do yet

- Do not force-reset `main`.
- Do not add new content routes.
- Do not add authentication.
- Do not expand class management.
- Do not refactor the activity renderer until the stabilisation branch builds.

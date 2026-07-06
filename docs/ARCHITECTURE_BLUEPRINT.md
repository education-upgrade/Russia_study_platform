# Russia Study Platform: Architecture & Development Blueprint

This document is the working blueprint for the Russia Study Platform. It should be updated whenever the app structure, database model, or development priorities change.

## 1. Product purpose

The platform supports guided independent study for AQA A-Level History, Component 1H: Tsarist and Communist Russia, 1855–1964.

The core classroom problem it solves is:

> How can students complete structured, exam-focused independent study while teachers can see progress, confidence and intervention needs quickly?

The platform is not simply a revision website. It is intended to become a guided-study and intervention system.

## 2. Current product model

The product currently has three main user-facing areas:

```text
/student
/student/lesson/...
/teacher/set-study
/teacher/progress
```

### Student side

Students complete pathway activities such as:

- lesson notes
- timeline tasks
- flashcards
- quizzes
- judgement ranking
- AO3 interpretation
- PEEL response
- confidence exit ticket

Student responses are saved to Supabase and then used by the teacher dashboard.

### Teacher side

Teachers can:

- choose a Russia topic/pathway
- choose a class
- choose a route type
- choose required activities
- set a deadline and instructions
- view guided-study assignment history
- view progress/intervention evidence

### Current prototype identity model

The app currently uses demo identities:

```text
Demo teacher: 11111111-1111-1111-1111-111111111111
Demo student: 22222222-2222-2222-2222-222222222222
Demo Y12 class: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
Demo Y13 class: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
```

These are acceptable for the prototype. They must be replaced with Supabase Auth before real-world class use.

## 3. Current technical stack

```text
Next.js App Router
React
TypeScript
Supabase
Vercel
GitHub
```

Important stability rule:

- dependencies should be pinned
- a package lockfile should be committed after a successful install/build
- avoid using `latest` for runtime dependencies

## 4. Current folder structure

```text
app/                  Next.js app routes and route handlers
components/           Reusable UI, activity and teacher components
components/pathway/   Modular pathway and activity resolution layer
content/              Structured lesson/pathway content
lib/                  Shared registry, resolver, evidence and analytics logic
supabase/             SQL setup/migration files
docs/                 Project architecture and stabilisation documentation
```

## 5. Key architecture: pathway engine

The long-term app should be pathway-driven.

The current successful pattern is:

```text
app/student/lesson/[specific-lesson]/page.tsx
  -> components/pathway/ModularPathwayPage.tsx
  -> components/pathway/ResolvedModularPathwayPage.tsx
  -> lib/pathwayRegistry.ts
  -> lib/pathwayResolver.ts
  -> Supabase activities + fallback content
```

Activity pages follow:

```text
app/student/lesson/[specific-lesson]/[activity]/page.tsx
  -> components/pathway/ModularActivityPage.tsx
  -> components/pathway/ResolvedModularActivityPage.tsx
  -> components/GenericActivityRenderer.tsx
```

This should remain the main architectural direction.

## 6. Pathway registry

`lib/pathwayRegistry.ts` is the main map of the curriculum pathway system.

Each pathway currently includes:

```ts
pathwaySlug
title
lessonTitle
subtitle
yearGroup
courseWeek
unitNumber
unitTitle
mainFocus
writtenFocus
writtenFocusType
breadthLenses
status
routeBase
```

This is useful because it joins together:

- curriculum sequencing
- route generation
- teacher assignment options
- student pathway display
- future analytics and revision planning

### Rule for adding new pathways

New content should begin by adding or updating the pathway registry entry, not by creating disconnected pages.

## 7. Activity type registry

`lib/activityTypeRegistry.ts` defines the allowed activity types and their route slugs.

Current supported activity types:

```text
lesson_content
flashcards
quiz
confidence_exit_ticket
peel_response
exam_planning
ao3_interpretation
model_answer_analysis
card_sort
timeline
source_analysis
judgement_ranking
```

Some activity types render fully; others currently use `comingSoon`.

### Rule for adding new activity types

Do not add a new activity type directly inside a page. Add it first to:

```text
lib/activityTypeRegistry.ts
```

Then add renderer support through:

```text
components/GenericActivityRenderer.tsx
lib/activityRendererContracts.ts
```

## 8. Generic activity renderer

`components/GenericActivityRenderer.tsx` is currently the reusable activity engine.

It maps activity type to component:

```text
flashcards             -> FlashcardActivity
quiz                   -> QuizActivity
timeline               -> TimelineActivity
card_sort              -> CardSortActivity
judgement_ranking      -> JudgementRankingActivity
ao3_interpretation     -> AO3InterpretationActivity
peel_response          -> PeelResponseActivity
confidence_exit_ticket -> ConfidenceExitTicketActivity
other                  -> ComingSoonActivityRenderer
```

This file should be protected from rushed feature changes. It is the core reusable engine.

## 9. Supabase model

The app currently expects these important tables:

```text
lessons
activities
student_responses
guided_study_assignments
app_profiles
teacher_classes
class_memberships
course_units
study_pathways
```

The relevant SQL setup files are:

```text
supabase/guided-study-assignments.sql
supabase/multi-class-platform.sql
```

Recommended order:

```text
1. base lesson/activity/student-response seed files
2. supabase/guided-study-assignments.sql
3. supabase/multi-class-platform.sql
```

## 10. Environment variables

Vercel must have:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

If Supabase is paused or these variables are missing/incorrect, the app may show:

```text
TypeError: fetch failed
```

This is an infrastructure issue, not necessarily an app architecture issue.

## 11. Current stabilisation branch

The current stabilisation branch is:

```text
stabilise-current-main
```

It exists to tidy and stabilise the current app, not to roll back or add major features.

Current stabilisation changes include:

- dependency pinning
- `docs/STABILISATION_AUDIT.md`
- centralised demo identity constants in `lib/demoIdentity.ts`
- reduced repeated demo student IDs

## 12. Safe development workflow

Use this workflow from now on:

```text
1. Create a small branch from main
2. Make one type of change only
3. Check local build if possible
4. Push branch
5. Let Vercel preview build
6. Test key route manually
7. Merge only after preview passes
```

Avoid combining these in the same branch:

- schema changes
- UI redesign
- route refactor
- new content
- new activity type
- authentication changes

## 13. Testing checklist for every PR

Minimum manual checks:

```text
/                         loads
/student                  loads
/teacher/set-study        loads
/teacher/progress         loads
/student/lesson/1855      loads
/student/lesson/1855/quiz loads
```

Functional checks:

```text
Teacher can set guided study
Student can open assigned pathway
Student can complete at least one activity
Teacher progress reflects saved evidence
No pink Supabase warnings when Supabase is active
```

## 14. Immediate next development priorities

### Priority 1: finish stabilisation

- confirm PR #3 Vercel preview build passes
- generate and commit `package-lock.json`
- keep Supabase unpaused
- document exact SQL setup order

### Priority 2: clean demo identity

- keep all demo IDs in `lib/demoIdentity.ts`
- replace any remaining duplicated demo constants
- do not introduce authentication yet

### Priority 3: stabilise teacher dashboard

- refactor `TeacherEvidenceDashboard.tsx` into smaller components
- avoid changing behaviour during this refactor
- keep this as a separate PR

### Priority 4: improve pathway/content completeness

- complete ready Y12 Unit 1 pathways first
- ensure every ready pathway has usable fallback content
- avoid marking a pathway as `ready` unless activities actually work

### Priority 5: move towards generic routes

Current manual route wrappers are acceptable for the prototype. Long term, move towards:

```text
/student/lesson/[lessonSlug]
/student/lesson/[lessonSlug]/[activity]
```

Do this only after the current manual pathway wrappers are stable.

## 15. Development priorities for the History course

Recommended content build order:

```text
Y12 Unit 1: Trying to preserve autocracy, 1855–1894
Y12 Unit 2: The collapse of autocracy, 1894–1917
Y13 Unit 3: Communist dictatorship, 1917–1941
Y13 Unit 4: Stalinist dictatorship and reaction, 1941–1964
Synoptic revision pathways
Exam technique pathways
```

Each pathway should eventually include:

```text
lesson_content
flashcards
quiz
one application task
peel_response or exam-planning task
confidence_exit_ticket
```

For AQA Russia, application tasks should prioritise:

- causation judgement
- change and continuity
- extent/significance ranking
- AO3 interpretation evaluation
- essay planning
- evidence selection

## 16. What not to do yet

Do not yet:

- force-reset `main`
- rebuild from scratch
- add authentication
- add payment/subscription logic
- add AI feedback
- add multiple subjects
- create many new routes at once
- rewrite the pathway renderer
- expand class management before the database is stable

## 17. Long-term production-readiness plan

Before use with real students, the platform will need:

```text
Supabase Auth
teacher/student roles
secure RLS policies
real class membership
student dashboard based on logged-in user
teacher dashboard based on logged-in teacher
safe handling of written responses
export/reporting tools
backup and recovery plan
```

## 18. Decision log

### Decision: do not roll back to old Vercel deployment

Reason:

The visible error was caused by Supabase being paused. Once Supabase was resumed, the app worked. Therefore the issue was infrastructure, not a failed architecture.

### Decision: keep modular pathway architecture

Reason:

The modular pathway/activity renderer structure is the most scalable part of the app and should remain the foundation.

### Decision: stabilise before adding content

Reason:

The app is now large enough that uncontrolled feature additions create regression risk. Stabilisation makes future expansion safer.

## 19. Current north star

The platform should become:

> A reliable, pathway-driven independent study system that helps A-Level History students build knowledge, practise exam skills, and gives teachers clear evidence for intervention.

Every future feature should support that goal.

# Step 3: Technical Build Specification

## Purpose

This document translates the locked feature map into the first technical build plan for the Russia Study Platform.

The first MVP must prove the core loop:

```text
Teacher assigns the 1905 pathway
        ↓
Student completes lesson, quiz, flashcards, PEEL response and confidence exit ticket
        ↓
App saves completion, scores, written response and confidence
        ↓
Teacher sees progress and intervention flags
```

## Repository role

- `Russia_revision`: current prototype and content source.
- `Russia_study_platform`: modular long-term platform build.

## Stack

- Next.js App Router
- TypeScript
- Supabase database/auth
- Vercel deployment
- OpenAI feedback later, not in MVP

## MVP routes

```text
/
/student/dashboard
/teacher/dashboard
```

Future routes:

```text
/student/assignments
/student/lesson/[id]
/student/progress
/teacher/classes
/teacher/assign
/teacher/students/[id]
/teacher/lessons
```

## Core app folders

```text
app/                 App Router pages
components/          Reusable UI and activity components
content/             Structured content data for pilot unit
lib/                 Shared helpers and Supabase client
planning/            Build and product planning docs
supabase/            Schema and database setup files
```

## MVP content

The pilot content is stored in:

```text
content/1905-pilot.ts
```

It contains:

- AQA Russia course metadata
- 1905 Revolution unit metadata
- lesson title and enquiry
- key knowledge
- quiz questions
- flashcards
- PEEL task
- confidence exit ticket

## MVP database

The database schema draft is stored in:

```text
supabase/schema.sql
```

It defines:

- users
- courses
- classes
- class_memberships
- units
- lessons
- activities
- assignments
- assignment_activities
- student_responses

## Build order

1. Verify Next.js skeleton builds.
2. Connect to Vercel.
3. Create Supabase project and run schema.
4. Add Supabase environment variables.
5. Add authentication and role redirects.
6. Build student activity components.
7. Build teacher assignment and progress views.
8. Test using demo teacher/student accounts.

## Reliability requirements

- Student written responses must autosave.
- Dashboard progress must match actual completion.
- Students must only see their own work.
- Teachers must only see their own class data.
- The prototype must work on phone and desktop.

## Current status

Initial skeleton added:

- README
- package configuration
- TypeScript config
- global styling
- landing page
- student dashboard prototype
- teacher dashboard prototype
- 1905 pilot structured content
- Supabase client placeholder
- database schema draft

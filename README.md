# Russia Study Platform

A modular teacher/student study platform for **AQA A-Level History: Tsarist and Communist Russia, 1855-1964**.

This repository is the long-term platform build. The existing `Russia_revision` repository remains the prototype and content source.

## Product direction

One shared platform with two role-based interfaces:

- **Student interface**: lessons, guided study, revision, exam practice and progress.
- **Teacher interface**: classes, lesson assignment, guided study, progress monitoring and intervention.

The first MVP is centred on a **1905 Revolution pilot pathway**.

## MVP loop

```text
Teacher assigns the 1905 pathway
        ↓
Student completes lesson, quiz, flashcards, PEEL response and confidence exit ticket
        ↓
App saves completion, scores, written response and confidence
        ↓
Teacher sees progress and intervention flags
```

## Recommended stack

- Next.js App Router
- TypeScript
- Supabase database/auth
- Vercel deployment
- OpenAI diagnostic feedback later, not in MVP

## First milestone

Build the reliable MVP loop for the 1905 Revolution pathway before adding further topics, AI, games, reports or advanced analytics.

## Repository structure

```text
app/                 Next.js app routes
components/          Reusable UI/activity components
content/             Structured course, unit, lesson and activity data
lib/                 Shared helpers and Supabase placeholder
planning/            Product and technical planning documents
supabase/            Database schema draft
```

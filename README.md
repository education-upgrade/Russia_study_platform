# Russia Study Platform

A guided study and adaptive revision platform for **AQA A-Level History: Tsarist and Communist Russia, 1855–1964**.

The project is designed to become a full student learning ecosystem combining:

- guided independent study
- retrieval practice
- exam technique development
- adaptive support and challenge
- teacher intervention and analytics
- structured pathway-based revision

The existing `Russia_revision` repository remains the original prototype and content source. This repository is the long-term scalable platform build.

---

# Vision

The platform aims to replicate the structure, scaffolding and intervention of an excellent sixth-form classroom within a digital guided-study environment.

Students should be able to:

- revise independently with structure
- complete sequenced study pathways
- improve AO1 and AO3 skills over time
- receive scaffolded or stretch support automatically
- identify weak topics and misconceptions
- practise exam writing in manageable stages
- build confidence through retrieval and feedback

Teachers should be able to:

- assign guided pathways
- monitor completion and confidence
- identify misconceptions quickly
- track quiz and written performance
- intervene with students needing support
- view patterns across classes and topics
- eventually generate personalised revision plans

---

# Core Product Direction

## Student Interface

The student experience is centred around structured learning pathways.

Each pathway contains guided activities such as:

- flashcards
- quizzes
- timelines
- card sorts
- judgement ranking tasks
- AO3 interpretation activities
- PEEL paragraph scaffolds
- confidence exit tickets
- retrieval practice
- exam-planning tasks

The student experience is designed around:

- low-friction independent study
- mobile-first accessibility
- adaptive scaffolding
- visible progress
- secure knowledge building
- exam-skill development

---

## Teacher Interface

The teacher dashboard is intended to become a lightweight intervention and monitoring system.

Planned capabilities include:

- class management
- pathway assignment
- completion tracking
- quiz analytics
- confidence analysis
- weak-topic identification
- intervention flags
- adaptive support insights
- student response review
- revision-week and exam-week assignment modes

Longer-term ambitions include:

- AI-assisted feedback
- automated misconception detection
- personalised revision sequencing
- adaptive homework generation
- revision recommendations based on performance history

---

# Current Development Status

## Completed curriculum coverage

The teacher guided-study picker now includes the completed pathway builds for:

- **Unit 3:** The condition of Russia before 1894
- **Unit 4:** Nicholas II and the road to 1905
- **Unit 5:** War, collapse and revolution in 1917

Unit 5 includes Russia before 1914, Russia and the First World War, the February Revolution, and the period from February to October 1917.

## Existing Features

### Activity System

A modular activity renderer currently supports:

- Flashcard activities
- Quiz activities
- Timeline activities
- Card sort activities
- Judgement ranking activities
- AO3 interpretation activities
- PEEL response activities
- Confidence exit ticket activities

### Adaptive Support

The renderer system includes adaptive support metadata allowing activities to be:

- scaffolded
- secure
- stretch

Support panels can include:

- support strategies
- success targets
- difficulty labels

### Student Progress

The platform currently saves:

- quiz scores
- completion state
- written responses
- confidence data
- incorrect question tracking

using Supabase-backed APIs.

---

# MVP Strategy

The initial pilot pathway is focused on the **1905 Revolution**.

The goal of the MVP is to prove the full guided-study loop:

```text
Teacher assigns pathway
        ↓
Student completes guided activities
        ↓
Platform saves responses and progress
        ↓
Teacher identifies misconceptions and intervention needs
        ↓
Student revisits weak knowledge and exam skills
```

The platform is intentionally prioritising:

- reliability
- scalable architecture
- reusable activity systems
- strong typing and validation
- adaptive support structures

before expanding into broader AI functionality.

---

# Technical Stack

## Frontend

- Next.js App Router
- TypeScript
- Modular component-based activity system
- Mobile-first responsive design

## Backend

- Supabase database
- Supabase auth (planned expansion)
- API-based response saving

## Deployment

- GitHub
- Vercel

---

# Architectural Direction

The long-term architecture is moving toward:

- shared domain types
- reusable activity contracts
- typed activity schemas
- runtime validation
- scalable renderer systems
- pathway-driven content structures
- reusable adaptive-support models

The activity renderer is intended to become a reusable engine capable of supporting multiple humanities subjects in the future.

---

# Repository Structure

```text
app/                 Next.js app routes
components/          Reusable UI and activity components
content/             Structured pathway and lesson content
lib/                 Shared types, contracts and helpers
planning/            Product and technical planning
supabase/            Database schema and backend planning
```

---

# Long-Term Goal

The long-term ambition is to build a high-quality adaptive guided-study platform that meaningfully improves independent revision, exam confidence and intervention capacity for A-Level humanities students.

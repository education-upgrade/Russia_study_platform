# Guided Study subject-pack architecture

The platform is split conceptually into a shared Guided Study core and replaceable subject packs.

## Core platform

The following remain subject-neutral and should not need modification when a new subject is added:

- authentication and roles
- schools, classes and memberships
- assignment publication and recipients
- activity completion and progress percentages
- student dashboard / My work / My classes UX
- teacher classes, assignments, tracking and interventions
- evidence, confidence, attempts and scores
- teacher notes and student history
- resources and embedded video
- CSV exports and rule-based teacher insights

## Subject pack

A subject pack owns:

- identity and branding
- subject/course/exam-board metadata
- curriculum units
- pathways and lesson metadata
- the activities offered to teachers
- guided-study mode presets
- subject-facing activity labels/descriptions
- default assignment instructions
- curriculum content (moved fully in the next extraction phase)

`subjects/activeSubject.ts` is currently fixed to the Russia pack so the existing pilot behaves exactly as before. In a future multi-subject deployment the class/course will select the relevant pack.

## Current first pack

`subjects/history-russia/` represents AQA A-Level History: Tsarist and Communist Russia 1855–1964.

PR #93 establishes the boundary while retaining the existing large pathway registry through a transitional adapter. A follow-up content-consolidation PR can move the Russia pathway definitions and curriculum content physically into the pack without altering any consumer API.

## Architectural rule

Adding a new subject should not require changes to teacher/student dashboards, tracking, history, interventions, evidence or progress-saving code. New subjects should be implemented by registering a subject pack and supplying compatible activity/content definitions.

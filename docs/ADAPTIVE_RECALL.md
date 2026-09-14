# Adaptive Recall

## Purpose

The Recall area adds low-stakes adaptive knowledge retrieval without changing the guided-study response engine.

## Data isolation

Recall uses three dedicated tables only:

- `recall_sessions`
- `recall_responses`
- `student_recall_question_stats`

It does **not** write to `student_responses`, `student_activity_progress`, `assignment_progress` or `assignment_recipients`.

The migration `20260914130000_create_adaptive_recall_quiz.sql` is additive: it creates new tables, indexes, grants and row-level-security policies. It contains no destructive changes to existing study-progress tables.

## Save behaviour

Each submitted answer is inserted immediately into `recall_responses`. Session totals are then rebuilt from saved response rows rather than incremented optimistically in the browser. If a request is repeated, the unique `(session_id, question_id)` constraint prevents a duplicate attempt in the same session and the API recovers the already-saved result.

An interrupted session remains `in_progress`. The Recall page asks for the most recent in-progress session and resumes from the first unanswered question.

## Adaptive selection

Question priority rises when a question is:

- unseen;
- answered incorrectly most recently;
- low accuracy over previous attempts;
- not retrieved recently.

Priority falls as consecutive correct answers increase. Recommended whole-course sessions also apply a soft topic cap so one period does not dominate the ten-question set.

Weak-area mode includes only previously attempted questions that are still insecure. A question is considered secure in the progress display after three consecutive correct answers.

## Answer quality controls

Multiple-choice options are reordered for each session so the correct position cycles across A/B/C/D rather than clustering in one position. The server grades the selected answer text, so reordering does not alter correctness.

Short-answer marking normalises case, punctuation and hyphens. For answers of at least five characters, one edit or one adjacent-letter transposition is accepted. Explicit alternative forms can also be listed per question.

## Security

All Recall tables have RLS enabled. Authenticated students can access only rows where `student_id = auth.uid()`. Anonymous access is revoked. A Recall response may only be inserted for a question that belongs to one of the authenticated student's own sessions.

The question bank and answer key are server-imported by the Recall API. The client receives only prompt/type/options until an answer has been saved, at which point the API returns the correct answer and feedback.

## Verification requirement

Before deployment, verify:

1. existing study-progress row counts are unchanged by the migration;
2. an answer survives reload immediately after submission;
3. an unfinished session resumes without replaying answered questions;
4. a completed session changes future adaptive weighting;
5. one student cannot select or update another student's Recall rows;
6. existing assignments and lesson-specific quizzes continue to save normally.

# Adaptive Recall implementation summary

This branch adds an isolated student Recall area modelled on the GCSE knowledge-recall workflow.

## Added

- `/student/recall` student experience
- adaptive recommended, weak-area, whole-course and topic modes
- ten-question whole-course sessions
- immediate answer persistence and resumable unfinished sessions
- conservative typo-tolerant short-answer marking
- balanced MCQ answer positions at presentation time
- per-question mastery/streak tracking
- topic and overall accuracy/progress summaries
- dedicated Recall database tables with ownership RLS
- automated recall-bank integrity check in the production build

## Deliberately unchanged

- guided-study `student_responses`
- `student_activity_progress`
- assignment progress / recipients
- existing lesson-specific quiz components and save routes

The Recall migration creates only new tables/indexes/policies. It does not alter or migrate existing progress records.

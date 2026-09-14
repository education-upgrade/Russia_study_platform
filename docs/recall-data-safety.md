# Recall data-safety evidence

Immediately before applying the Recall migration, the live Russia study database contained:

- `student_responses`: 50 rows
- `student_activity_progress`: 94 rows
- `assignment_progress`: 18 rows
- `assignment_recipients`: 46 rows

Immediately after the migration, the same tables contained exactly the same counts. The new tables contained zero rows:

- `recall_sessions`: 0
- `recall_responses`: 0
- `student_recall_question_stats`: 0

This confirms the migration did not move, delete or rewrite existing student progress at the point it was applied.

# Authenticated assignment builder

This step connects the existing guided-study builder to the secure classroom assignment database.

## What changed

- demo teacher, student and class IDs are no longer used;
- the builder loads only active teaching classes linked to the authenticated teacher;
- class student totals come from active class memberships;
- creating work calls `create_class_assignment` using the current authenticated session;
- assignments are published immediately and recipient rows are created for current active class members;
- assignment history reads from `classroom_assignments` and `assignment_recipients`.

## Test after deployment

1. Sign in with the teacher account.
2. Open `/teacher/set-study`.
3. Confirm the real class appears.
4. Choose a topic and activities.
5. Publish the assignment.
6. Confirm it appears in assignment history as `Published`.

A class with no joined students can still receive an assignment, but its recipient count will be zero until students have joined. Recipient snapshots are taken when the assignment is published.

## Database changes

None. This step uses the migrations introduced in Architecture Step 4A.

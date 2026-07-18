# Classroom assignment database setup

This architecture step replaces demo assignment identities with a secure database model connected to real teaching classes and authenticated users.

## Apply the migrations

After merging the pull request, run these files in order in the Supabase SQL Editor:

1. `supabase/migrations/20260718220000_create_classroom_assignments.sql`
2. `supabase/migrations/20260718220100_grant_assignment_policy_helpers.sql`

Run each file once.

## What is created

- `classroom_assignments`: one assignment linked to a real `teaching_classes` row and the authenticated teacher who created it.
- `assignment_recipients`: a snapshot of the active students who receive a published assignment.
- `create_class_assignment(...)`: securely creates either a draft or published assignment.
- `set_class_assignment_status(...)`: publishes, archives or returns an assignment to draft status.

## Access rules

- Teachers and admins can only create assignments for active classes they teach.
- Teachers can read assignments for their own classes.
- Students can only read published assignments where they have an active recipient row.
- Publishing snapshots the current active class membership into `assignment_recipients`.
- Draft and archived assignments are hidden from students.

## Verify the database

```sql
select tablename
from pg_tables
where schemaname = 'public'
  and tablename in ('classroom_assignments', 'assignment_recipients')
order by tablename;
```

```sql
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name in (
    'create_class_assignment',
    'set_class_assignment_status',
    'is_assignment_teacher',
    'is_assignment_recipient'
  )
order by routine_name;
```

## Scope boundary

This step creates the assignment engine and security model only. The following PR will update the existing teacher assignment builder to use authenticated teacher IDs, real `teaching_classes`, and these new database functions. The existing demo assignment workflow is not removed in this migration so the live platform remains usable while the replacement UI is built and tested.

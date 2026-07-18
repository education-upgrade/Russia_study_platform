# Schools, classes and memberships setup

## Apply the migration

After merging the PR, open the Supabase SQL Editor and run:

`supabase/migrations/20260718203000_create_schools_classes_memberships.sql`

Run the complete file once.

The migration creates:

- `schools`
- `classes`
- `class_teachers`
- `class_memberships`
- secure class creation and joining functions
- Row Level Security policies

## Teacher test

1. Sign in with the teacher account.
2. Open `/teacher/classes`.
3. Enter a school name, class name and optional academic year.
4. Create the class.
5. Confirm a six-character join code appears.

## Student test

Use a separate student account. Public sign-up creates student accounts automatically.

1. Sign in as the student.
2. Open `/student/join`.
3. Enter the class code.
4. Confirm the class appears in the student's class list.

A teacher can preview student lessons, but the join function deliberately accepts only accounts whose role is `student`.

## Security model

- Teachers see only classes to which they are linked.
- Students see only classes they have joined.
- Class codes are checked through a database function; students cannot list every available code.
- Students cannot create classes or add themselves without a valid active code.
- Teachers can read the membership list for their own classes.
- Admin support is retained for future school administration.

## Deliberate scope boundary

This step creates genuine class membership. Existing guided-study assignments are not yet rewritten to use class IDs; that is the next architecture step.

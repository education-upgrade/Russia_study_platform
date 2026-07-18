# Profiles and roles setup

This step adds application profiles linked one-to-one with Supabase Auth users.

## Apply the migration

After merging this PR:

1. Open the Supabase project.
2. Open **SQL Editor**.
3. Open `supabase/migrations/20260718190000_create_profiles_and_roles.sql` from this repository.
4. Paste the complete file into a new query and run it once.

The migration will:

- create `student`, `teacher` and `admin` roles;
- create the `profiles` table;
- enable Row Level Security;
- allow an authenticated user to read only their own profile;
- automatically create a student profile for every future sign-up;
- backfill profiles for users who already exist.

## Promote the first teacher account

Public sign-up always creates a **student** profile. This prevents a visitor from granting themselves teacher or administrator access.

To promote an existing account, replace the email below and run it in the Supabase SQL Editor:

```sql
update public.profiles as profiles
set role = 'teacher',
    updated_at = timezone('utc', now())
from auth.users as users
where profiles.id = users.id
  and lower(users.email) = lower('your-email@example.com');
```

Use `admin` instead of `teacher` only for a trusted platform administrator.

## Verify the result

```sql
select
  users.email,
  profiles.full_name,
  profiles.role,
  profiles.status
from public.profiles as profiles
join auth.users as users on users.id = profiles.id
order by profiles.created_at;
```

Then sign out and sign back in. The `/account` page should display the assigned role and account status.

## Security boundary

This migration does not yet enforce teacher/student route access. It establishes trusted profile data first. Role-based redirects and route permissions are the next architecture step.

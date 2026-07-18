# Supabase authentication setup

## Environment variables

Set these in local development and the hosting provider:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The values are available from the Supabase project API settings.

## Supabase Auth settings

1. Enable Email authentication in Supabase Authentication > Providers.
2. Set the Site URL to the deployed application URL.
3. Add local and deployed callback URLs ending in `/auth/callback` to the redirect allow list.
4. Decide whether email confirmation should be required before accounts can sign in.

## Protected routes

When Supabase is configured, these route groups require an authenticated session:

- `/student`
- `/teacher`
- `/account`

Unauthenticated visitors are redirected to `/login` and returned to their original page after successful sign-in.

## Current scope

This phase establishes identity and session handling only. Teacher/student roles, profile records, class membership and row-level security policies belong to the next architecture phase.

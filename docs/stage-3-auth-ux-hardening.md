# Stage 3: teacher and authentication UX hardening

This release closes the remaining workflow and authentication snags identified in the structural audit.

## Assignment builder

- Generic **Set work** starts with no class selected and no topic selected.
- Entering Set work from a class still carries that class through intentionally.
- Configure and Review cannot be opened until the required earlier choices are made.
- Deadlines are interpreted and displayed in `Europe/London`, including BST/GMT changes.

## Signup and redirects

- Student signup detects whether Supabase returned a live session. If email confirmation is disabled, the student proceeds immediately rather than being told to check email.
- Staff signup reports the same confirmation state correctly.
- Post-login and auth-callback destinations are restricted to local app paths.
- The staff-signup callback is constructed server-side rather than trusted from browser input.

## Staff signup security

- Invite-code comparison uses constant-time comparison.
- Attempts are rate-limited by hashed email/IP and IP keys in a server-only Supabase table/function.
- The rate-limit function is executable only by the service role.

## Session resilience

- Known stale Supabase refresh/session cookies are cleared when Supabase reports a stale-session error, avoiding repeated redirect/error loops.
- Other authentication errors do not trigger blanket cookie deletion.

## Build safeguards

The production security check now fails the build if these guarantees are accidentally removed.

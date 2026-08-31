'use client';

export default function SignOutButton({ className }: { className?: string }) {
  return (
    <form action="/auth/signout" method="post">
      <button className={className} type="submit">Sign out</button>
    </form>
  );
}

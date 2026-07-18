export default function AccountSuspendedPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="hero">
        <p className="eyebrow">Account unavailable</p>
        <h1>Your account is currently suspended</h1>
        <p>Please contact the platform administrator before trying to access lessons or teacher tools.</p>
        <form action="/auth/signout" method="post">
          <button className="button" type="submit">Sign out</button>
        </form>
      </section>
    </main>
  );
}

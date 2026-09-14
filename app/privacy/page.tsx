import Link from 'next/link';

const sectionStyle = {
  padding: '18px 20px',
  border: '1px solid var(--border)',
  borderRadius: 18,
  background: '#fff',
} as const;

export default function PrivacyPage() {
  return (
    <main className="page-shell" style={{ maxWidth: 920, margin: '0 auto', padding: '32px 18px 56px' }}>
      <section className="hero" style={{ marginBottom: 20 }}>
        <p className="eyebrow">Privacy & data protection</p>
        <h1>How the Russia Study Platform uses your information</h1>
        <p>
          This platform is being used as a controlled educational pilot with two A-Level History classes. It saves only the information needed to provide guided study, save work and help pupils and teachers monitor learning.
        </p>
      </section>

      <div style={{ display: 'grid', gap: 14 }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>What we save</h2>
          <p>
            We may save your name, email address, account role, class membership, assigned work, written responses, scores, attempts, confidence ratings, progress, completion information and timestamps showing when work was started, saved or completed.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Why we save it</h2>
          <p>
            The information is used to run your account, deliver assignments, autosave and return your work, show progress, allow your teacher to review learning and feedback, and keep the platform secure and reliable.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Who can see it</h2>
          <p>
            Pupils can access their own work and progress. Authorised teachers can access information needed for the classes and assignments they teach. Approved technical providers may process information only where needed to host, authenticate, secure and operate the platform.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>What this platform is not for</h2>
          <p>
            We do not use pupil information for advertising, marketing or selling data. Do not enter safeguarding information, medical information, SEND diagnoses or other highly sensitive personal information into this platform. Use the school&apos;s approved systems for those matters.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>How long information is kept</h2>
          <p>
            During the controlled pilot, identifiable learning data should be kept only for as long as the school needs it for the pilot and normal educational use. The proposed pilot position is deletion or anonymisation within three months of the end of the pilot or relevant academic year unless continued use is formally approved by the school.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0 }}>Your rights</h2>
          <p>
            You can ask what information is held about you, ask for inaccurate information to be corrected, and raise a concern about how your information is being used. Requests should go through the school&apos;s normal data-protection route or Data Protection Officer.
          </p>
        </section>

        <section style={{ ...sectionStyle, background: 'var(--blue-grey)' }}>
          <h2 style={{ marginTop: 0 }}>Student-friendly summary</h2>
          <p>
            Your work is not public. Other pupils should not be able to see your personal work or progress. Your teacher can see the information needed to teach and support your class. We do not use your work for adverts or sell your information.
          </p>
        </section>
      </div>

      <div className="button-row" style={{ marginTop: 22 }}>
        <Link className="button secondary" href="/login">Back to sign in</Link>
        <Link className="button ghost" href="/account">Account</Link>
      </div>

      <p style={{ marginTop: 28, color: 'var(--muted)', fontSize: '.82rem', lineHeight: 1.6 }}>
        Version 1.0 • September 2026 • Controlled pilot privacy information. The school/academy trust remains responsible for confirming its formal privacy notice, lawful basis, retention period and DPO contact details.
      </p>
    </main>
  );
}

const DEMO_EMAIL =
  "mailto:team@sherlock.dev?subject=Sherlock%20demo%20request";

export default function DemoContactCard() {
  return (
    <section className="contact-card" aria-labelledby="demo-contact-title">
      <span className="kicker">Request a demo</span>
      <h2 id="demo-contact-title">Tell us what you want Sherlock to investigate</h2>
      <p>
        Email your GitHub organization or repository, your stack, and the kind
        of issue you want to test. We&apos;ll follow up to arrange the demo and
        installation details.
      </p>
      <a href={DEMO_EMAIL} className="btn btn-primary btn-lg">
        Email team@sherlock.dev
      </a>
      <p className="contact-card-note">
        Security reviews, DPAs, enterprise deployments, and self-hosting
        questions are welcome.
      </p>
    </section>
  );
}

"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ConsumerHealthDataPage() {
  return (
    <div className="static-page d-flex flex-column min-height-100vh">
      <Header />
      <main className="content container py-5" style={{ flex: 1 }}>
        <h2 className="mb-4" style={{ fontWeight: 700 }}>Consumer Health Data Notice</h2>
        <p className="lead text-muted mb-4">Last Updated: May 2026</p>

        <section className="mb-4">
          <h5>Categories of Consumer Health Data We Collect</h5>
          <p className="text-muted">
            The health data we collect depends on your interactions with our site and support communities. This may include:
          </p>
          <ul>
            <li>Information about your conditions, symptoms, and treatments that you share in community chatrooms and stories.</li>
            <li>Self-reported health measurements and diary logs.</li>
            <li>Feedback on medications or therapies.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5>Sources of Consumer Health Data</h5>
          <p className="text-muted">
            We collect health data directly from you when you submit stories, input profile details, or chat with community members.
          </p>
        </section>

        <section className="mb-4">
          <h5>Your Rights</h5>
          <p className="text-muted">
            You have the right to request deletion of your health data, access what has been stored, and withdraw consent for data collection at any time by contacting support.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

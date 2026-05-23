"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserAgreementPage() {
  return (
    <div className="static-page d-flex flex-column min-height-100vh">
      <Header />
      <main className="content container py-5" style={{ flex: 1 }}>
        <h2 className="mb-4" style={{ fontWeight: 700 }}>User Agreement</h2>
        <p className="lead text-muted mb-4">Terms and conditions governing your use of HealTogether.</p>

        <section className="mb-4">
          <h5>1. Eligibility & Registration</h5>
          <p className="text-muted">
            You must be at least 18 years old to create an account and join support channels. You agree to provide accurate registration details (name, email, phone) and verify ownership via the OTP mechanism.
          </p>
        </section>

        <section className="mb-4">
          <h5>2. User Conduct & Safe Space</h5>
          <p className="text-muted">
            HealTogether is dedicated to patient support. Harassment, abuse, commercial advertising, or dissemination of medical diagnoses without clarifying subjective experiences is strictly prohibited. Keep discussions civil, safe, and helpful.
          </p>
        </section>

        <section className="mb-4">
          <h5>3. Content Ownership & Rights</h5>
          <p className="text-muted">
            You retain copyright of stories and comments you publish. However, by sharing them in our public/community view, you grant HealTogether a non-exclusive license to display them to registered members.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

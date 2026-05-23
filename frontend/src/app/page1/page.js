"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutUsPage() {
  return (
    <div className="static-page d-flex flex-column min-height-100vh">
      <Header />
      <main className="content container py-5" style={{ flex: 1 }}>
        <h2 className="mb-4" style={{ fontWeight: 700 }}>About HealTogether</h2>
        <p className="lead text-muted mb-4">
          HealTogether is a social network and support system built to help people learn from others with the same conditions.
        </p>

        <section className="mb-5">
          <h4>Our Mission</h4>
          <p>
            Our mission is simple: to improve the lives of patients worldwide through connection, shared knowledge, and mutual support. We believe that health is a journey best traveled together, and that patients themselves are one of the greatest untapped resources in healthcare.
          </p>
        </section>

        <section className="mb-5">
          <h4>How It Works</h4>
          <div className="row mt-4">
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm p-3">
                <h5>1. Register & Verify</h5>
                <p className="text-muted">Create a secure profile and verify your email to ensure our community remains a safe, trustworthy space.</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm p-3">
                <h5>2. Join Support Groups</h5>
                <p className="text-muted">Choose from 24 support communities covering chronic conditions, mental health, and wellness.</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 shadow-sm p-3">
                <h5>3. Communicate & Learn</h5>
                <p className="text-muted">Participate in live chatrooms, read inspiring stories from fellow patients, and share your own experiences.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

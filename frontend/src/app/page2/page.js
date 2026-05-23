"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="static-page d-flex flex-column min-height-100vh">
      <Header />
      <main className="content container py-5" style={{ flex: 1 }}>
        <h2 className="mb-4" style={{ fontWeight: 700 }}>Privacy & Security Policy</h2>
        <p className="lead text-muted mb-4">If you have any questions, don't hesitate to ask!</p>

        <h4>Privacy Policy Overview</h4>
        <p className="mb-4 text-muted">
          While this introduction to our Privacy Policy does not replace the need to read the full policy, it may help answer some of your most important questions right away.
        </p>

        <section className="mb-4">
          <h5>You own your data</h5>
          <ul>
            <li>You have the right to access your data at any time.</li>
            <li>You have the right to edit or delete any of the data you enter on the site.</li>
            <li>You have the right to request timely removal of all your data from the site.</li>
            <li>You have the right to request a complete download of your data from the site.</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5>You control what you share on the site and what you make visible to others.</h5>
          <p className="text-muted">
            You can share as much or as little about yourself on the site as you choose. You can select one of three Privacy Settings to control visibility:
          </p>
          <ul>
            <li><strong>Public view:</strong> Viewable by both non-members and members of HealTogether.</li>
            <li><strong>Community view:</strong> Viewable by fellow members.</li>
            <li><strong>Personal view:</strong> Visible only to you.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

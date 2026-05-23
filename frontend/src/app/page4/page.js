"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      alert("Thank you for contacting us! We will get back to you shortly.");
      setName("");
      setEmail("");
      setMsg("");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="static-page d-flex flex-column min-height-100vh">
      <Header />
      <main className="content container py-5" style={{ flex: 1, maxWidth: "600px" }}>
        <h2 className="mb-4 text-center" style={{ fontWeight: 700 }}>Contact Us</h2>
        <p className="text-center text-muted mb-5">Have queries, concerns, or feedback? Send us a message below.</p>

        <div className="card shadow-sm p-4 border-0" style={{ borderRadius: "10px" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="5"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fs-5"
              disabled={submitting}
              style={{ borderRadius: "8px" }}
            >
              {submitting ? "Sending..." : "Submit Message"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

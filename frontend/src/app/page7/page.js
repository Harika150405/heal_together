"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PartnersPage() {
  return (
    <div className="static-page d-flex flex-column min-height-100vh">
      <Header />
      <main className="content container py-5" style={{ flex: 1 }}>
        <h2 className="mb-4" style={{ fontWeight: 700 }}>Our Partners</h2>
        <p className="lead text-muted mb-5">Working together with healthcare organizations to build a healthier world.</p>

        <div className="row g-4 mt-2">
          <div className="col-md-6">
            <div className="card h-100 p-4 shadow-sm border-0">
              <h5 className="text-primary">Medical Research Initiative</h5>
              <p className="text-muted">Collaborating with academic centers to share anonymized patient feedback that drives clinical research and therapy refinements.</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 p-4 shadow-sm border-0">
              <h5 className="text-primary">Mental Health Foundation</h5>
              <p className="text-muted">Working with national counselling organizations to deliver verified mental health resources and guidance directly inside our depression, anxiety, and PTSD groups.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

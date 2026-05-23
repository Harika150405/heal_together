"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HelpCenterPage() {
  return (
    <div className="static-page d-flex flex-column min-height-100vh">
      <Header />
      <main className="content container py-5" style={{ flex: 1 }}>
        <h2 className="mb-4" style={{ fontWeight: 700 }}>Help Center & FAQ</h2>
        <p className="lead text-muted mb-5">Frequently asked questions and guides on using HealTogether.</p>

        <div className="accordion shadow-sm" id="helpAccordion" style={{ borderRadius: "10px", overflow: "hidden" }}>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                How do I join a support community chatroom?
              </button>
            </h2>
            <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#helpAccordion">
              <div className="accordion-body">
                Navigate to the <b>Community</b> directory in the header links, locate the group representing your condition, and click the <b>Join Chat</b> button. Once joined, you can open and participate in the group chat anytime.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                Can I edit or delete my stories after posting?
              </button>
            </h2>
            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
              <div className="accordion-body">
                Yes. Locate your post on the <b>Stories</b> page. If you are the author, you will see <b>Edit</b> and <b>Delete</b> options at the top right of your story card.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                Is my email address visible to other members?
              </button>
            </h2>
            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
              <div className="accordion-body">
                No. Your personal details, such as email, phone number, and address, are stored securely and never visible to other users. Only your <b>Username</b> is shown in story logs and chatrooms.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

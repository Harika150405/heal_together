"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [token, setToken] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  // Autoplay cycle every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  if (!token) return null; // wait for redirect in Header component

  return (
    <div className="home-theme">
      <div className="head">
        <Header />
      </div>

      <main>
        {/* React State-Controlled Carousel */}
        <div id="myCarousel" className="carousel slide mb-6">
          <div className="carousel-indicators">
            <button
              type="button"
              className={activeIndex === 0 ? "active" : ""}
              onClick={() => setActiveIndex(0)}
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              className={activeIndex === 1 ? "active" : ""}
              onClick={() => setActiveIndex(1)}
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              className={activeIndex === 2 ? "active" : ""}
              onClick={() => setActiveIndex(2)}
              aria-label="Slide 3"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className={`carousel-item ${activeIndex === 0 ? "active" : ""}`}>
              <img
                src="https://images.unsplash.com/photo-1644945570917-1585f682efaa?w=1200"
                className="d-block w-100"
                alt="Slide 1"
              />
              <div className="carousel-caption text-start">
                <h2>Find hope, find healing, find your people</h2>
                <h4>Discover a community dedicated to improving lives through connection</h4>
                <Link href="/community" className="carousel-btn">Join a Community</Link>
              </div>
            </div>

            <div className={`carousel-item ${activeIndex === 1 ? "active" : ""}`}>
              <img
                src="https://images.unsplash.com/photo-1653762378386-3d42e46d57f8?w=1200"
                className="d-block w-100"
                alt="Slide 2"
              />
              <div className="carousel-caption">
                <h2>Health is a journey best traveled together.</h2>
                <h4>Join a community that believes in the power of shared knowledge</h4>
                <Link href="/stories" className="carousel-btn">Read Patient Stories</Link>
              </div>
            </div>

            <div className={`carousel-item ${activeIndex === 2 ? "active" : ""}`}>
              <img
                src="https://plus.unsplash.com/premium_photo-1664363807000-c09ffda5a45d?w=1200"
                className="d-block w-100"
                alt="Slide 3"
              />
              <div className="carousel-caption text-end">
                <h2>Your story matters. Your strength inspires.</h2>
                <h4>Connect with a community that empowers you every step of the way</h4>
                <Link href="/stories/new" className="carousel-btn">Share Your Story</Link>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + 3) % 3)}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % 3)}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="section-header">
          <h2>Getting started is easy!</h2>
          <p>Begin your journey with HealTogether in three simple steps</p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-num">1</div>
            <div className="step-icon">📝</div>
            <h3>Share your story</h3>
            <p>
              Introduce yourself to the community. Share as little, or as much, about your health journey and the support you're looking for.
            </p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <div className="step-icon">🤝</div>
            <h3>Find your community</h3>
            <p>
              We offer 24 support communities where you can make helpful connections and be part of a safe environment.
            </p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <div className="step-icon">💬</div>
            <h3>Join the discussion</h3>
            <p>
              Find personalized answers, offer advice and feel supported by people who know what you are going through.
            </p>
          </div>
        </div>

        {/* Stats & Features Section */}
        <div className="stats-section">
          <div className="stats-container">
            <div className="stat-item">
              <h3>24</h3>
              <p>Support Groups</p>
            </div>
            <div className="stat-item">
              <h3>100%</h3>
              <p>Safe & Confidential</p>
            </div>
            <div className="stat-item">
              <h3>Real-Time</h3>
              <p>Community Chats</p>
            </div>
            <div className="stat-item">
              <h3>Shared</h3>
              <p>Patient Stories</p>
            </div>
          </div>
        </div>

        <div className="home-cta">
          <h2>Join HealTogether to Take Control of Your Health Journey Today.</h2>
          <Link href="/community" className="cta-btn">
            Explore Communities
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

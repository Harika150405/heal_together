"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    
    if (!t || !storedUser) {
      window.location.href = "/";
      return;
    }
    
    setToken(t);
    setUsername(storedUser);
    fetchDashboardData(t, storedUser);
  }, []);

  const fetchDashboardData = async (t, user) => {
    setLoading(true);
    try {
      // 1. Fetch Profile Info
      const profileRes = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      // 2. Fetch Joined Communities
      const commRes = await fetch(`${API_BASE_URL}/api/chat/my-communities`, {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (commRes.ok) {
        const commData = await commRes.json();
        setJoinedCommunities(commData);
      }

      // 3. Fetch All Stories and filter by user
      const storiesRes = await fetch(`${API_BASE_URL}/api/stories`, {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        const filtered = storiesData.filter(s => s.name === user);
        setMyStories(filtered);
      }
    } catch (err) {
      console.error("Error loading user dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-dashboard-theme min-vh-100 d-flex flex-column bg-light">
      <Header />

      <main className="flex-grow-1 container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Building your personalized board...</p>
          </div>
        ) : (
          <div>
            {/* Header / Profile Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-5">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div className="d-flex flex-column flex-md-row align-items-center gap-4 text-center text-md-start">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "2rem",
                      background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                    }}
                  >
                    {profile?.fname?.[0]?.toUpperCase() || "H"}
                  </div>
                  <div>
                    <h2 className="fw-bold text-dark mb-1">{profile?.fname} {profile?.lname}</h2>
                    <p className="text-muted mb-2"><code>@{username}</code> | Patient Support Member</p>
                    <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold">
                      Account Verified ✅
                    </span>
                  </div>
                </div>

                <div className="mt-4 mt-md-0 d-flex gap-2">
                  <Link href="/edit-profile" className="btn btn-outline-success rounded-3 px-4 py-2 fw-semibold">
                    ⚙️ Edit Profile
                  </Link>
                  <Link href="/community" className="btn btn-success rounded-3 px-4 py-2 fw-semibold">
                    🌿 Join Groups
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white d-flex flex-row align-items-center gap-3">
                  <div className="fs-1">🤝</div>
                  <div>
                    <h6 className="text-muted text-uppercase small mb-1">Joined Groups</h6>
                    <h3 className="fw-bold text-dark m-0">{joinedCommunities.length}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white d-flex flex-row align-items-center gap-3">
                  <div className="fs-1">📖</div>
                  <div>
                    <h6 className="text-muted text-uppercase small mb-1">Stories Shared</h6>
                    <h3 className="fw-bold text-dark m-0">{myStories.length}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white d-flex flex-row align-items-center gap-3">
                  <div className="fs-1">📅</div>
                  <div>
                    <h6 className="text-muted text-uppercase small mb-1">Active Since</h6>
                    <h3 className="fw-bold text-dark fs-5 m-0">Today</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Boards Section */}
            <div className="row g-4">
              {/* Joined Support Groups Board */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold text-dark m-0">My Support Groups</h4>
                    <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1">Active Channels</span>
                  </div>

                  {joinedCommunities.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted mb-4">You haven't joined any support communities yet.</p>
                      <Link href="/community" className="btn btn-outline-success rounded-3">
                        Browse Communities
                      </Link>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {joinedCommunities.map((c) => (
                        <div
                          key={c.id}
                          className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-light border-0"
                        >
                          <div>
                            <h6 className="fw-bold text-dark mb-1">{c.communityName}</h6>
                            <p className="text-muted small m-0">Joined recently</p>
                          </div>
                          <Link
                            href={`/chat/${encodeURIComponent(c.communityName)}`}
                            className="btn btn-success btn-sm rounded-3 px-3 py-1.5"
                          >
                            💬 Open Chat Room
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Shared Stories Board */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold text-dark m-0">My Shared Stories</h4>
                    <Link href="/stories/new" className="btn btn-outline-success btn-sm rounded-3">
                      + Add New
                    </Link>
                  </div>

                  {myStories.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted mb-4">You haven't shared your health story yet.</p>
                      <Link href="/stories/new" className="btn btn-outline-success rounded-3">
                        Share Your Story
                      </Link>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3" style={{ maxHeight: "350px", overflowY: "auto" }}>
                      {myStories.map((s) => (
                        <div key={s.id} className="p-3 rounded-4 bg-light border-0">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="badge bg-secondary-subtle text-secondary small">
                              {s.community}
                            </span>
                            <span className="text-muted small">
                              ❤️ {s.likesCount || 0} Likes | 💬 {s.comments?.length || 0} Comments
                            </span>
                          </div>
                          <p className="text-dark small mb-0 text-truncate-3">{s.story}</p>
                          <div className="text-end mt-2">
                            <Link href="/stories/view" className="text-success small fw-semibold text-decoration-none">
                              View in feed →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

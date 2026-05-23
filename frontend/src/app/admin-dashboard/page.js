"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ totalUsers: 0, totalGroups: 0, totalStories: 0, totalMessages: 0 });
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  
  // New Community Form State
  const [newGroupName, setNewGroupName] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submittingCommunity, setSubmittingCommunity] = useState(false);

  // Fetch admin data
  useEffect(() => {
    const t = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!t || role !== "ADMIN") {
      alert("Access Denied: Admins Only");
      window.location.href = "/home";
      return;
    }
    
    setToken(t);
    fetchData(t);
  }, []);

  const fetchData = async (t) => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch("http://192.168.39.157:3009/api/admin/stats", {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch Users
      const usersRes = await fetch("http://192.168.39.157:3009/api/admin/users", {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // 3. Fetch Stories
      const storiesRes = await fetch("http://192.168.39.157:3009/api/admin/stories", {
        headers: { "Authorization": `Bearer ${t}` }
      });
      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        setStories(storiesData);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user role
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const res = await fetch(`http://192.168.39.157:3009/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        alert("User role updated successfully!");
        fetchData(token);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating role");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user permanently? This cannot be undone.")) return;

    try {
      const res = await fetch(`http://192.168.39.157:3009/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        alert("User deleted successfully!");
        fetchData(token);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  // Create new community group
  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    setSubmittingCommunity(true);

    try {
      const res = await fetch("http://192.168.39.157:3009/api/admin/communities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          groupName: newGroupName,
          tagline: newTagline,
          description: newDesc
        })
      });

      if (res.ok) {
        alert("New community group created successfully!");
        setNewGroupName("");
        setNewTagline("");
        setNewDesc("");
        fetchData(token);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create community");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating community");
    } finally {
      setSubmittingCommunity(false);
    }
  };

  // Delete story (moderation)
  const handleDeleteStory = async (storyId) => {
    if (!confirm("Are you sure you want to delete this story? This will also delete any related likes and comments.")) return;

    try {
      const res = await fetch(`http://192.168.39.157:3009/api/admin/stories/${storyId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        alert("Story moderated and deleted successfully!");
        fetchData(token);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete story");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting story");
    }
  };

  return (
    <div className="admin-theme min-vh-100 d-flex flex-column bg-light">
      <Header />

      <main className="flex-grow-1 container py-5">
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 pb-3 border-bottom">
          <div>
            <h1 className="fw-bold text-dark mb-1">Admin Control Center</h1>
            <p className="text-muted mb-0">Manage users, communities, stories, and track engagement stats.</p>
          </div>
          <button onClick={() => fetchData(token)} className="btn btn-outline-secondary mt-3 mt-md-0 d-flex align-items-center gap-2">
            🔄 Refresh Data
          </button>
        </div>

        {/* Tab Selection */}
        <div className="nav nav-pills mb-4 p-2 bg-white rounded-3 shadow-sm d-flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`nav-link px-4 py-2.5 rounded-3 fw-semibold ${activeTab === "overview" ? "active bg-danger text-white" : "text-secondary bg-transparent"}`}
          >
            📊 Overview Stats
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`nav-link px-4 py-2.5 rounded-3 fw-semibold ${activeTab === "users" ? "active bg-danger text-white" : "text-secondary bg-transparent"}`}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`nav-link px-4 py-2.5 rounded-3 fw-semibold ${activeTab === "groups" ? "active bg-danger text-white" : "text-secondary bg-transparent"}`}
          >
            🌿 Community Support Groups
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`nav-link px-4 py-2.5 rounded-3 fw-semibold ${activeTab === "stories" ? "active bg-danger text-white" : "text-secondary bg-transparent"}`}
          >
            📖 Moderate Stories ({stories.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Fetching admin records...</p>
          </div>
        ) : (
          <div>
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)" }}>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-2">Total Users</h6>
                    <h2 className="display-5 fw-bold m-0">{stats.totalUsers}</h2>
                    <p className="m-0 mt-2 small opacity-75">Registered & verified accounts</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: "linear-gradient(135deg, #4E65FF 0%, #92EFFD 100%)" }}>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-2">Support Groups</h6>
                    <h2 className="display-5 fw-bold m-0">{stats.totalGroups}</h2>
                    <p className="m-0 mt-2 small opacity-75">Active support channels</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" }}>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-2">Shared Stories</h6>
                    <h2 className="display-5 fw-bold m-0">{stats.totalStories}</h2>
                    <p className="m-0 mt-2 small opacity-75">Patient journeys published</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)" }}>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-2">Total Messages</h6>
                    <h2 className="display-5 fw-bold m-0">{stats.totalMessages}</h2>
                    <p className="m-0 mt-2 small opacity-75">Real-time chat discussions</p>
                  </div>
                </div>

                <div className="col-12 mt-5">
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <h4 className="fw-bold text-dark mb-3">Admin Quick Guide</h4>
                    <ul className="text-muted d-flex flex-column gap-2 mb-0">
                      <li>Use the <b>Users</b> tab to view all registered patients, toggle user roles between <b>USER</b> and <b>ADMIN</b>, or suspend/delete users.</li>
                      <li>Use the <b>Community Support Groups</b> tab to create new medical groups or delete inactive ones.</li>
                      <li>Use the <b>Moderate Stories</b> tab to review all patient shared journals and delete entries containing spam or inappropriate content.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 2. USERS TAB */}
            {activeTab === "users" && (
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                <h4 className="fw-bold text-dark mb-4">Registered Patient Database</h4>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Verification Status</th>
                        <th>Role</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td><b>#{u.id}</b></td>
                          <td>{u.fname} {u.lname}</td>
                          <td><code>@{u.username}</code></td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>
                            {u.verified ? (
                              <span className="badge bg-success-subtle text-success px-2 py-1">Verified ✅</span>
                            ) : (
                              <span className="badge bg-warning-subtle text-warning px-2 py-1">Unverified ✉️</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge px-2.5 py-1.5 ${u.role === "ADMIN" ? "bg-danger" : "bg-secondary"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              onClick={() => handleToggleRole(u.id, u.role)}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              Toggle Role
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. SUPPORT GROUPS TAB */}
            {activeTab === "groups" && (
              <div className="row g-4">
                <div className="col-lg-5">
                  <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                    <h4 className="fw-bold text-dark mb-3">Create New Support Group</h4>
                    <form onSubmit={handleCreateCommunity}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-secondary">Group/Condition Name</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          placeholder="e.g. Diabetes, Hypertension, Autism"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-secondary">Tagline</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          placeholder="e.g. Stronger every day, together."
                          value={newTagline}
                          onChange={(e) => setNewTagline(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-secondary">Description</label>
                        <textarea
                          className="form-control rounded-3"
                          rows="4"
                          placeholder="Explain what the support channel focuses on, what topics patients discuss..."
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-danger w-100 rounded-3 py-2.5 fw-bold"
                        disabled={submittingCommunity}
                      >
                        {submittingCommunity ? "Creating Group..." : "➕ Create Support Group"}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                    <h4 className="fw-bold text-dark mb-3">Available Support Channels</h4>
                    <div className="d-flex flex-column gap-3" style={{ maxHeight: "550px", overflowY: "auto" }}>
                      {/* Using stats to list communities or fetch community list */}
                      {/* For now let's just prompt user about seeded communities or fetch community list dynamically */}
                      <p className="text-muted small">Communities are seeded automatically on backend server boot. To manage database seeding, refer to the backend code or list.</p>
                      <div className="alert alert-secondary py-3 px-4 rounded-3 border-0">
                        Total Seeded Medical Conditions: <b>{stats.totalGroups} active channels</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. MODERATE STORIES TAB */}
            {activeTab === "stories" && (
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                <h4 className="fw-bold text-dark mb-4">Patient Shared Journals & Stories</h4>
                {stories.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">No shared stories found in the system yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Author</th>
                          <th>Group/Condition</th>
                          <th>Story Snippet</th>
                          <th>Date Shared</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stories.map(s => (
                          <tr key={s.id}>
                            <td><b>#{s.id}</b></td>
                            <td><code>@{s.name}</code></td>
                            <td><span className="badge bg-secondary-subtle text-secondary">{s.community}</span></td>
                            <td style={{ maxWidth: "300px" }} className="text-truncate">
                              {s.story}
                            </td>
                            <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                            <td className="text-end">
                              <button
                                onClick={() => handleDeleteStory(s.id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                Moderate & Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

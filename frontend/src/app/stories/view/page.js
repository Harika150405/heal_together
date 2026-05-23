"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ViewStoriesPage() {
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  // Edit states
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Comment input states
  const [commentInputs, setCommentInputs] = useState({}); // storyId -> string

  const fetchStoriesList = async (authToken) => {
    try {
      const res = await fetch("http://192.168.39.157:3009/api/stories", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    if (!t || !u) {
      router.push("/");
      return;
    }
    setToken(t);
    setUsername(u);
    fetchStoriesList(t);
  }, [router]);

  const handleToggleLike = async (storyId) => {
    try {
      const res = await fetch(`http://192.168.39.157:3009/api/stories/${storyId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Update state locally
        setStories(prev =>
          prev.map(story =>
            story.id === storyId 
              ? { ...story, hasLiked: data.liked, likesCount: data.likesCount } 
              : story
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      const res = await fetch(`http://192.168.39.157:3009/api/stories/${storyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        alert("Story deleted successfully!");
        setStories(prev => prev.filter(story => story.id !== storyId));
      } else {
        alert("Failed to delete story.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (story) => {
    setEditingStoryId(story.id);
    setEditingText(story.story);
  };

  const handleSaveEdit = async (storyId) => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch(`http://192.168.39.157:3009/api/stories/${storyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ story: editingText })
      });

      if (res.ok) {
        alert("Story updated successfully!");
        setStories(prev =>
          prev.map(story =>
            story.id === storyId ? { ...story, story: editingText } : story
          )
        );
        setEditingStoryId(null);
      } else {
        alert("Failed to update story.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (e, storyId) => {
    e.preventDefault();
    const commentText = commentInputs[storyId];
    if (!commentText || !commentText.trim()) return;

    try {
      const res = await fetch(`http://192.168.39.157:3009/api/stories/${storyId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ comment: commentText })
      });

      if (res.ok) {
        const newComment = await res.json();
        // Clear comment box
        setCommentInputs(prev => ({ ...prev, [storyId]: "" }));
        // Append comment locally
        setStories(prev =>
          prev.map(story =>
            story.id === storyId 
              ? { ...story, comments: [...story.comments, newComment] } 
              : story
          )
        );
      } else {
        alert("Failed to post comment.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentInputChange = (storyId, text) => {
    setCommentInputs(prev => ({ ...prev, [storyId]: text }));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main className="container py-5" style={{ flex: 1, maxWidth: "800px" }}>
        <h1 className="text-center mb-5" style={{ color: "#2c3e50", fontWeight: "700" }}>
          Community Stories
        </h1>

        {stories.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">No stories shared yet. Be the first to share!</h4>
          </div>
        ) : (
          stories.map((story) => (
            <div key={story.id} className="card mb-4 shadow-sm border-0" style={{ borderRadius: "12px" }}>
              <div className="card-body p-4">
                {/* Story Metadata */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0 text-primary" style={{ fontWeight: "700" }}>{story.name}</h6>
                    <small className="text-muted">
                      Shared in <span className="badge bg-secondary">{story.community}</span> on{" "}
                      {new Date(story.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  {story.name === username && (
                    <div className="d-flex gap-2">
                      <button 
                        onClick={() => handleEditClick(story)} 
                        className="btn btn-sm btn-outline-secondary"
                        style={{ fontSize: "12px" }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteStory(story.id)} 
                        className="btn btn-sm btn-outline-danger"
                        style={{ fontSize: "12px" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Story Content / Edit Box */}
                {editingStoryId === story.id ? (
                  <div className="mb-3">
                    <textarea
                      className="form-control mb-2"
                      rows="4"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="d-flex gap-2">
                      <button 
                        onClick={() => handleSaveEdit(story.id)} 
                        className="btn btn-sm btn-success"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingStoryId(null)} 
                        className="btn btn-sm btn-light"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="card-text mb-4" style={{ fontSize: "16px", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {story.story}
                  </p>
                )}

                {/* Like section */}
                <div className="d-flex align-items-center mb-4">
                  <button 
                    onClick={() => handleToggleLike(story.id)} 
                    className={`btn btn-sm d-flex align-items-center gap-1 ${story.hasLiked ? "btn-primary" : "btn-outline-primary"}`}
                    style={{ borderRadius: "20px" }}
                  >
                    👍 {story.hasLiked ? "Liked" : "Like"}
                  </button>
                  <span className="ms-3 text-muted" style={{ fontSize: "14px" }}>
                    {story.likesCount} {story.likesCount === 1 ? "like" : "likes"}
                  </span>
                </div>

                <hr />

                {/* Comments List */}
                <div className="comments-section mt-3">
                  <h6 className="text-muted mb-3" style={{ fontWeight: "700" }}>Comments</h6>
                  {story.comments.length === 0 ? (
                    <p className="text-muted small">No comments yet. Write one below!</p>
                  ) : (
                    story.comments.map((comment) => (
                      <div key={comment.id} className="bg-light p-2 rounded mb-2" style={{ fontSize: "14px" }}>
                        <div className="d-flex justify-content-between mb-1">
                          <strong className="text-dark">{comment.username}</strong>
                          <span className="text-muted" style={{ fontSize: "11px" }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ whiteSpace: "pre-wrap" }}>{comment.comment}</div>
                      </div>
                    ))
                  )}

                  {/* Comment Input */}
                  <form onSubmit={(e) => handlePostComment(e, story.id)} className="d-flex mt-3 gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Add a comment..."
                      value={commentInputs[story.id] || ""}
                      onChange={(e) => handleCommentInputChange(story.id, e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-sm btn-primary">
                      Comment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_BASE_URL } from "@/config";

export default function NewStoryPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/");
      return;
    }
    setToken(t);

    const fetchCommunitiesList = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/communities/list`);
        if (res.ok) {
          const list = await res.json();
          setCommunities(list);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCommunitiesList();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCommunity || !storyContent.trim()) {
      alert("Please select a community and write your story.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          community: selectedCommunity,
          story: storyContent
        })
      });

      if (res.ok) {
        alert("Story shared successfully!");
        router.push("/stories/view");
      } else {
        alert("Failed to share story.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="form-theme" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div className="container" style={{ marginTop: "40px", marginBottom: "40px" }}>
        <div className="title" style={{ color: "#007bff" }}>Share Your Story</div>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="input_field">
              <label>Select Community</label>
              <div className="selectbox">
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  required
                >
                  <option value="">Select Group</option>
                  {communities.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input_field">
              <label>Your Story</label>
              <textarea
                className="textarea"
                style={{ height: "180px" }}
                placeholder="Share your health journey, tips, or words of encouragement..."
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="input_field">
              <input
                type="submit"
                value={loading ? "Posting Story..." : "Post Story"}
                className="btn"
                style={{ backgroundColor: "#007bff" }}
                disabled={loading}
              />
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

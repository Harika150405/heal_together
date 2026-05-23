"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function MyCommunitiesPage() {
  const router = useRouter();
  const [joinedList, setJoinedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoined = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/my-communities`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJoinedList(data);
        } else {
          alert("Failed to retrieve communities.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJoined();
  }, [router]);

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
    <div className="community-theme" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main className="container py-5" style={{ flex: 1 }}>
        <h1 className="mb-4" style={{ color: "#2c3e50", fontWeight: "700" }}>My Communities</h1>
        <p className="text-muted mb-5">These are the support groups you have joined. Click any group to enter the chatroom.</p>

        {joinedList.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted mb-4">You have not joined any support communities yet.</h4>
            <Link href="/community" className="btn btn-primary px-4 py-2">
              Browse Support Communities
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {joinedList.map((item) => (
              <div key={item.id} className="col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "10px" }}>
                  <div className="card-body text-center py-4 d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="card-title text-primary mb-3">{item.communityName}</h4>
                      <p className="card-text text-muted mb-4">Click below to converse and share insights with members.</p>
                    </div>
                    <Link
                      href={`/chat/${encodeURIComponent(item.communityName)}`}
                      className="btn btn-outline-primary w-100"
                      style={{ borderRadius: "20px" }}
                    >
                      Enter Chatroom
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "OTP sent to your email!");
        localStorage.setItem("email", email);
        router.push("/verify-otp?mode=reset");
      } else {
        alert(data.error || "Email not found!");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #D071F9 !important;
          font-family: Arial, sans-serif;
        }
      `}</style>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ width: "320px", background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "#333", marginBottom: "20px", textAlign: "center" }}>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
            <br />
            <br />
            <input
              type="submit"
              value={loading ? "Sending..." : "Send OTP"}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                background: "#D071F9",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            />
          </form>
          <br />
          <div style={{ textAlign: "center" }}>
            <Link href="/" style={{ color: "#0a63d8", textDecoration: "none" }}>
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

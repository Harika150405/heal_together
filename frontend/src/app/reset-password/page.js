"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedOtp = localStorage.getItem("otp");
    if (storedEmail && storedOtp) {
      setEmail(storedEmail);
      setOtp(storedOtp);
    } else {
      alert("Unauthorized access! Please request OTP again.");
      router.push("/forgot-password");
    }
  }, [router]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== conpassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://192.168.39.157:3009/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, conpassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Password reset successfully!");
        localStorage.removeItem("email");
        localStorage.removeItem("otp");
        router.push("/");
      } else {
        alert(data.error || "Reset failed. Please try again.");
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
          <h2 style={{ color: "#333", marginBottom: "20px", textAlign: "center" }}>Reset Password</h2>
          <form onSubmit={handleReset}>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={conpassword}
              onChange={(e) => setConpassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" }}
            />
            <input
              type="submit"
              value={loading ? "Updating..." : "Update Password"}
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
        </div>
      </div>
    </>
  );
}

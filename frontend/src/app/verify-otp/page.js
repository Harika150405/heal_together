"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const mode = searchParams.get("mode") || "register"; // 'register' or 'reset'

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert("No active session found. Please start again.");
      router.push(mode === "reset" ? "/forgot-password" : "/register");
    }
  }, [mode, router]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "reset" 
        ? `${API_BASE_URL}/api/auth/verify-reset-otp` 
        : `${API_BASE_URL}/api/auth/verify-registration-otp`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "OTP verified successfully!");
        if (mode === "reset") {
          // Store OTP in local storage to verify on reset screen
          localStorage.setItem("otp", otp);
          router.push("/reset-password");
        } else {
          router.push("/");
        }
      } else {
        alert(data.error || "Invalid OTP. Please try again.");
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
        }
      `}</style>

      <div className="form-theme">
        <div className="container">
          <div className="title">
            {mode === "reset" ? "Verify Your OTP" : "Verify Your Email"}
          </div>
          <form onSubmit={handleVerify}>
            <div className="form">
              <div className="input_field">
                <label>Enter OTP</label>
                <input
                  type="text"
                  className="input"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="input_field">
                <input
                  type="submit"
                  value={loading ? "Verifying..." : "Verify OTP"}
                  className="btn"
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-center py-5">Loading verification form...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}


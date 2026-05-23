"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Clear previous sessions if visiting login
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    // Initialize Google Sign-in
    if (typeof window !== "undefined") {
      const initGoogle = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: "491481553436-reigb7rb54coisfmop5j836j2o0lepcc.apps.googleusercontent.com", // REPLACE WITH YOUR ACTUAL GOOGLE CLIENT ID
            callback: handleGoogleLoginCallback
          });
          window.google.accounts.id.renderButton(
            document.getElementById("googleBtn"),
            { theme: "outline", size: "large", width: "100%" }
          );
        }
      };

      // Poll until SDK script is loaded and window.google is ready
      const interval = setInterval(() => {
        if (window.google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, []);

  const handleGoogleLoginCallback = async (response) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("role", data.user.role || "USER");
        alert(data.message || "Google Login successful!");

        if (data.user.role === "ADMIN") {
          router.push("/admin-dashboard");
        } else {
          router.push("/home");
        }
      } else {
        alert(data.error || "Google login failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server during Google Sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("role", data.user.role || "USER");
        alert(data.message || "Login successful!");
        
        if (data.user.role === "ADMIN") {
          router.push("/admin-dashboard");
        } else {
          router.push("/home");
        }
      } else {
        if (data.notVerified) {
          alert(data.error);
          localStorage.setItem("email", data.email);
          router.push("/verify-otp?mode=register");
        } else {
          alert(data.error || "Login Failed: Invalid Username or Password");
        }
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
          margin: 0;
          padding: 0;
          background: url('https://imageio.forbes.com/specials-images/imageserve/645403962766f9dc50eabd27/0x0.jpg?format=jpg&crop=1640,1228,x61,y0,safe&height=600&width=1200&fit=bounds')
                      no-repeat center center fixed !important;
          background-size: cover !important;
          font-family: Arial, sans-serif;
        }
      `}</style>

      <div className="login-theme">
        <div className="center">
          <h1>Login</h1>
          <div className="form">
            <form onSubmit={handleLogin} autoComplete="off">
              <input
                type="text"
                name="username"
                className="textfield"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                className="textfield"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="forgetpass">
                <Link href="/forgot-password" className="link">
                  Forget Password
                </Link>
              </div>
              <input
                type="submit"
                value={loading ? "Logging in..." : "Login"}
                className="btn"
                disabled={loading}
              />
            </form>
            <div style={{ margin: "15px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={{ height: "1px", background: "#ddd", flex: 1 }}></span>
              <span style={{ fontSize: "12px", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>or</span>
              <span style={{ height: "1px", background: "#ddd", flex: 1 }}></span>
            </div>
            <div id="googleBtn" style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}></div>
            <div className="signup">
              New Member?{" "}
              <Link href="/register" className="link">
                SignUp Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

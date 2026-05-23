"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    fname: "",
    lname: "",
    password: "",
    conpassword: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.conpassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://192.168.39.157:3009/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Registration successful! OTP sent to your email.");
        localStorage.setItem("email", formData.email);
        router.push("/verify-otp?mode=register");
      } else {
        alert(data.error || "Failed to register. Please try again.");
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
          <div className="title">Registration Form</div>
          <form onSubmit={handleRegister}>
            <div className="form">
              <div className="input_field">
                <label>Username</label>
                <input
                  type="text"
                  className="input"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input_field">
                <label>First Name</label>
                <input
                  type="text"
                  className="input"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input_field">
                <label>Last Name</label>
                <input
                  type="text"
                  className="input"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input_field">
                <label>Password</label>
                <input
                  type="password"
                  className="input"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input_field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="input"
                  name="conpassword"
                  value={formData.conpassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input_field">
                <label>Gender</label>
                <div className="selectbox">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="input_field">
                <label>Email Address</label>
                <input
                  type="email"
                  className="input"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input_field">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="input"
                  name="phone"
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input_field">
                <label>Address</label>
                <textarea
                  className="textarea"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="input_field">
                <label className="check">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                </label>
                <p>Agree to terms and conditions</p>
              </div>

              <div className="input_field">
                <input
                  type="submit"
                  value={loading ? "Registering..." : "Register"}
                  className="btn"
                  disabled={loading}
                />
              </div>
            </div>
          </form>
          <Link href="/" className="back-link">
            &larr; Already registered? Login
          </Link>
        </div>
      </div>
    </>
  );
}

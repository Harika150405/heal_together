"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "@/config";

export default function EditProfilePage() {
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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setFormData({
            username: data.username || "",
            fname: data.fname || "",
            lname: data.lname || "",
            password: "",
            conpassword: "",
            gender: data.gender || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        } else {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          router.push("/");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (formData.password || formData.conpassword) {
      if (formData.password !== formData.conpassword) {
        alert("Passwords do not match!");
        return;
      }
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fname: formData.fname,
          lname: formData.lname,
          password: formData.password || undefined,
          conpassword: formData.conpassword || undefined,
          gender: formData.gender,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Profile updated successfully!");
        setFormData(prev => ({ ...prev, password: "", conpassword: "" }));
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    } finally {
      setUpdating(false);
    }
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
    <div className="form-theme" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div className="container" style={{ marginTop: "40px", marginBottom: "40px" }}>
        <div className="title">Edit Profile</div>
        <form onSubmit={handleUpdate}>
          <div className="form">
            <div className="input_field">
              <label>Username</label>
              <input
                type="text"
                className="input"
                name="username"
                value={formData.username}
                disabled
                style={{ backgroundColor: "#f0f0f0", color: "#777" }}
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
              <label>New Password (optional)</label>
              <input
                type="password"
                className="input"
                name="password"
                value={formData.password}
                placeholder="Leave blank to keep current"
                onChange={handleChange}
              />
            </div>

            <div className="input_field">
              <label>Confirm Password</label>
              <input
                type="password"
                className="input"
                name="conpassword"
                value={formData.conpassword}
                placeholder="Confirm password changes"
                onChange={handleChange}
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
                disabled
                style={{ backgroundColor: "#f0f0f0", color: "#777" }}
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
              <input
                type="submit"
                value={updating ? "Saving Changes..." : "Save Changes"}
                className="btn"
                disabled={updating}
              />
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

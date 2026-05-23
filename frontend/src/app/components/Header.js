"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("USER");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role") || "USER";
    if (!token || !storedUser) {
      router.push("/");
    } else {
      setUsername(storedUser);
      setRole(storedRole);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 border-bottom container-fluid px-md-5">
      <div className="col-md-3 mb-2 mb-md-0 text-start">
        <Link href="/home" className="d-inline-flex link-body-emphasis text-decoration-none">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9JusyOxrmJsgeLDHppsCKAF17Cpdf5kFnbQ&s"
            alt="Logo"
            style={{ width: "100px", height: "50px", objectFit: "contain" }}
          />
        </Link>
      </div>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li>
          <Link href="/home" className="nav-link px-2 link-secondary">
            Home
          </Link>
        </li>
        <li>
          <Link href="/community" className="nav-link px-2 link-dark">
            Community
          </Link>
        </li>
        <li>
          <Link href="/stories/view" className="nav-link px-2 link-dark">
            Stories
          </Link>
        </li>
        <li>
          <Link href="/stories/new" className="nav-link px-2 link-dark">
            Share Story
          </Link>
        </li>
        {role === "ADMIN" ? (
          <li>
            <Link href="/admin-dashboard" className="nav-link px-2 text-danger fw-bold">
              Admin Board
            </Link>
          </li>
        ) : (
          <li>
            <Link href="/user-dashboard" className="nav-link px-2 text-success fw-bold">
              My Dashboard
            </Link>
          </li>
        )}
        <li>
          <Link href="/page1" className="nav-link px-2 link-dark">
            About Us
          </Link>
        </li>
      </ul>

      <div className="col-md-3 text-end d-flex align-items-center justify-content-end gap-2">
        {username && (
          <span className="text-muted me-2">
            Hi, <b>{username}</b>
            {role === "ADMIN" && <span className="badge bg-danger ms-1" style={{ fontSize: "0.75rem" }}>Admin</span>}
          </span>
        )}
        <button onClick={handleLogout} className="btn btn-outline-primary">
          Logout
        </button>
        <Link href="/edit-profile" className="btn btn-primary">
          Edit Profile
        </Link>
      </div>
    </header>
  );
}

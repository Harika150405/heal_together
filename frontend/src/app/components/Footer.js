"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-section bg-light border-top py-5 container-fluid">
      <div className="row justify-content-center text-center text-md-start px-md-5">
        <div className="col-md-3 mb-4 mb-md-0 offset-md-1">
          <h5>Company</h5>
          <ul className="list-unstyled mt-3">
            <li className="mb-2">
              <Link href="/page1" className="text-decoration-none text-dark">
                About us
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/page2" className="text-decoration-none text-dark">
                Privacy And Security
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/page3" className="text-decoration-none text-dark">
                Consumer Health Data
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-md-3 mb-4 mb-md-0">
          <h5>Work With Us</h5>
          <ul className="list-unstyled mt-3">
            <li className="mb-2">
              <Link href="/page7" className="text-decoration-none text-dark">
                Our partners
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-md-3 mb-4 mb-md-0">
          <h5>Support</h5>
          <ul className="list-unstyled mt-3">
            <li className="mb-2">
              <Link href="/page4" className="text-decoration-none text-dark">
                Contact us
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/page5" className="text-decoration-none text-dark">
                Help center
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/page6" className="text-decoration-none text-dark">
                User Agreement
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <hr className="my-4 mx-md-5" />
      <p className="text-center text-muted mb-0">© 2025 HealTogether. All rights reserved.</p>
    </footer>
  );
}

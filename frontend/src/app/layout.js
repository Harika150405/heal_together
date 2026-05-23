/* layout.js */
import "./globals.css";

export const metadata = {
  title: "HealTogether",
  description: "Find hope, find healing, find your people",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Bootstrap CSS CDN */}
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          crossOrigin="anonymous"
        />
        {/* Google One Tap / Sign-In SDK */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body>
        {children}
        {/* Bootstrap JS CDN */}
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" 
          async
        />
      </body>
    </html>
  );
}

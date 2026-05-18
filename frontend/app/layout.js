import "./globals.css";

export const metadata = {
  title: "GlobalTNA — Service Request Board",
  description: "Post and browse home service requests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="header-inner">
            <a href="/" className="logo">
              <span className="logo-mark">G</span>
              <span className="logo-text">GlobalTNA</span>
            </a>
            <a href="/jobs/new" className="btn btn-primary">
              + Post a Job
            </a>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="site-footer">
          <p>© {new Date().getFullYear()} GlobalTNA · Mini Service Request Board</p>
        </footer>
      </body>
    </html>
  );
}

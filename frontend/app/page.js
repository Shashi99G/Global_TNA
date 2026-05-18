"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getJobs } from "@/lib/api";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "Other"];
const STATUSES = ["Open", "In Progress", "Closed"];

function statusClass(status) {
  if (status === "Open") return "badge badge-open";
  if (status === "In Progress") return "badge badge-inprogress";
  return "badge badge-closed";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function HomePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getJobs({ category, status, search });
      setJobs(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "8px" }}>
        <div>
          <h1 className="page-title">Service Requests</h1>
          <p className="page-sub">Browse open jobs posted by homeowners in your area.</p>
        </div>
      </div>

      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Search title & description…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
          {search && (
            <button type="button" className="btn btn-secondary" onClick={() => { setSearch(""); setSearchInput(""); }}>
              Clear
            </button>
          )}
        </form>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>

        {(category || status || search) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setCategory(""); setStatus(""); setSearch(""); setSearchInput(""); }}>
            Reset all
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-center"><span className="spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="empty">
          <div className="empty-title">No jobs found</div>
          <div className="empty-sub">Try adjusting your filters, or be the first to post a request.</div>
          <a href="/jobs/new" className="btn btn-primary">Post a job</a>
        </div>
      ) : (
        <>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            {jobs.length} {jobs.length === 1 ? "result" : "results"}
          </p>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="card job-card" onClick={() => router.push(`/jobs/${job._id}`)}>
                <div className="job-card-header">
                  <h2 className="job-card-title">{job.title}</h2>
                  <span className={statusClass(job.status)}>{job.status}</span>
                </div>
                <p className="job-card-desc">{job.description}</p>
                <div className="job-card-meta">
                  {job.category && <span className="tag">{job.category}</span>}
                  {job.location && (
                    <span className="meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {job.location}
                    </span>
                  )}
                  <span className="meta-item">{formatDate(job.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

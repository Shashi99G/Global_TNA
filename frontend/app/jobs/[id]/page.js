"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getJob, updateJobStatus, deleteJob } from "@/lib/api";

const STATUSES = ["Open", "In Progress", "Closed"];

function statusClass(status) {
  if (status === "Open") return "badge badge-open";
  if (status === "In Progress") return "badge badge-inprogress";
  return "badge badge-closed";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getJob(id);
        setJob(data.data);
        setSelectedStatus(data.data.status);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusUpdate() {
    if (selectedStatus === job.status) return;
    setUpdating(true);
    setSuccessMsg("");
    setError("");
    try {
      const data = await updateJobStatus(id, selectedStatus);
      setJob(data.data);
      setSelectedStatus(data.data.status);
      setSuccessMsg("Status updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this job? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteJob(id);
      router.push("/");
    } catch (e) {
      setError(e.message);
      setDeleting(false);
    }
  }

  if (loading) return <div className="loading-center"><span className="spinner" /></div>;

  if (error && !job) {
    return (
      <>
        <div className="detail-back"><a href="/" className="btn btn-secondary btn-sm">← Back to listings</a></div>
        <div className="alert alert-error">{error}</div>
      </>
    );
  }

  return (
    <div className="detail-layout">
      <div className="detail-back">
        <a href="/" className="btn btn-secondary btn-sm">← Back to listings</a>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="detail-header">
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.4px", lineHeight: 1.3, flex: 1 }}>
            {job.title}
          </h1>
          <span className={statusClass(job.status)}>{job.status}</span>
        </div>
        <div className="detail-meta">
          {job.category && <span className="tag">{job.category}</span>}
          {job.location && (
            <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {job.location}
            </span>
          )}
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Posted {formatDate(job.createdAt)}
          </span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-muted)", marginBottom: "8px" }}>Description</h3>
        <p style={{ fontSize: "15px", whiteSpace: "pre-wrap" }}>{job.description}</p>
      </div>

      {(job.contactName || job.contactEmail) && (
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-muted)", marginBottom: "12px" }}>Contact Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {job.contactName && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span style={{ fontSize: "14px" }}>{job.contactName}</span>
              </div>
            )}
            {job.contactEmail && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,12 2,6"/>
                </svg>
                <a href={`mailto:${job.contactEmail}`} style={{ fontSize: "14px", color: "var(--accent)" }}>
                  {job.contactEmail}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-muted)", marginBottom: "14px" }}>Actions</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="status-select" style={{ fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap" }}>
            Update status:
          </label>
          <select
            id="status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: "auto" }}
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === job.status}
          >
            {updating
              ? <><span className="spinner" style={{ width: "14px", height: "14px", borderTopColor: "#fff" }} /> Saving…</>
              : "Save"
            }
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={deleting}
            style={{ marginLeft: "auto" }}
          >
            {deleting ? "Deleting…" : "Delete Job"}
          </button>
        </div>
      </div>
    </div>
  );
}

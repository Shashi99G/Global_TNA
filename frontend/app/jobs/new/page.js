"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/lib/api";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "Other"];

function validate(fields) {
  const errs = {};
  if (!fields.title.trim()) errs.title = "Title is required.";
  else if (fields.title.trim().length > 150) errs.title = "Max 150 characters.";
  if (!fields.description.trim()) errs.description = "Description is required.";
  else if (fields.description.trim().length > 2000) errs.description = "Max 2000 characters.";
  if (fields.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.contactEmail)) {
    errs.contactEmail = "Enter a valid email address.";
  }
  return errs;
}

export default function NewJobPage() {
  const router = useRouter();
  const [fields, setFields] = useState({
    title: "", description: "", category: "Plumbing",
    location: "", contactName: "", contactEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError("");
    try {
      const res = await createJob(fields);
      router.push(`/jobs/${res.data._id}`);
    } catch (err) {
      setApiError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="detail-back">
        <a href="/" className="btn btn-secondary btn-sm">← Back to listings</a>
      </div>
      <h1 className="page-title">Post a Service Request</h1>
      <p className="page-sub">Fill in the details below and tradespeople in your area will be able to find your job.</p>

      <div className="form-card">
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="title">Job title <span style={{ color: "var(--danger)" }}>*</span></label>
            <input
              id="title" name="title" type="text"
              placeholder="e.g. Leaking kitchen tap needs fixing"
              value={fields.title} onChange={handleChange}
              className={errors.title ? "error" : ""}
              maxLength={150}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span style={{ color: "var(--danger)" }}>*</span></label>
            <textarea
              id="description" name="description"
              placeholder="Describe the problem in detail."
              value={fields.description} onChange={handleChange}
              className={errors.description ? "error" : ""}
              rows={4} maxLength={2000}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={fields.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="location">Location</label>
              <input
                id="location" name="location" type="text"
                placeholder="e.g. Glasgow"
                value={fields.location} onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ height: "20px" }} />

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Contact details <span style={{ fontStyle: "italic" }}>(optional)</span>
            </p>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="contactName">Your name</label>
                <input
                  id="contactName" name="contactName" type="text"
                  placeholder="e.g. John Smith"
                  value={fields.contactName} onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="contactEmail">Email address</label>
                <input
                  id="contactEmail" name="contactEmail" type="email"
                  placeholder="you@example.com"
                  value={fields.contactEmail} onChange={handleChange}
                  className={errors.contactEmail ? "error" : ""}
                />
                {errors.contactEmail && <span className="field-error">{errors.contactEmail}</span>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: "100%", justifyContent: "center", padding: "11px" }}
          >
            {submitting
              ? <><span className="spinner" style={{ borderTopColor: "#fff" }} /> Posting…</>
              : "Post Job Request"
            }
          </button>

        </form>
      </div>
    </>
  );
}

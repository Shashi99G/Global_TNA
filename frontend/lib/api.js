const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}

export const getJobs = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  return apiFetch(`/api/jobs${qs ? `?${qs}` : ""}`);
};

export const getJob = (id) => apiFetch(`/api/jobs/${id}`);

export const createJob = (body) =>
  apiFetch("/api/jobs", { method: "POST", body: JSON.stringify(body) });

export const updateJobStatus = (id, status) =>
  apiFetch(`/api/jobs/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteJob = (id) =>
  apiFetch(`/api/jobs/${id}`, { method: "DELETE" });

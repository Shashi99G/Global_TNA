const express = require("express");
const router = express.Router();
const JobRequest = require("../models/JobRequest");

// GET /api/jobs
router.get("/", async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }
    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id).lean();
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs
router.post("/", async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } =
      req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "title and description are required" });
    }
    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/jobs/:id  — status only
router.patch("/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["Open", "In Progress", "Closed"];
    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "status field is required" });
    if (!allowed.includes(status))
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${allowed.join(", ")}`,
      });
    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

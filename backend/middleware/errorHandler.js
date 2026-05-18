const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join("; ") });
  }
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = { notFound, errorHandler };

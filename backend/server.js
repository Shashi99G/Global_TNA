require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const jobRoutes = require("./routes/jobs");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/jobs", jobRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/globaltna";

if (require.main === module) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
      );
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      process.exit(1);
    });
}

module.exports = app;

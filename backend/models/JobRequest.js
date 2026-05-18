const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title must be 150 characters or fewer"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description must be 2000 characters or fewer"],
    },
    category: {
      type: String,
      enum: {
        values: ["Plumbing", "Electrical", "Painting", "Joinery", "Other"],
        message: "{VALUE} is not a valid category",
      },
      default: "Other",
    },
    location: { type: String, trim: true, default: "" },
    contactName: { type: String, trim: true, default: "" },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "{VALUE} is not a valid status",
      },
      default: "Open",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

jobRequestSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("JobRequest", jobRequestSchema, "jobRequests");

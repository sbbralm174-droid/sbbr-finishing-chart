import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },   // fixed নাম
    count: { type: Number, required: true },  // কতগুলো সমস্যা
    date: { type: String, required: true },   // YYYY-MM-DD format
  },
  { timestamps: true }
);

export const Issue = mongoose.models.Issue || mongoose.model("Issue", IssueSchema);

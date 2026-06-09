const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    question: String,
    answer: String,
    note: String,
    isPinned: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false },

    coachingScore: { type: Number, default: null },
    coachingFeedback: { type: String, default: "" },
    coachingImprovedAnswer: { type: String, default: "" },
    coachingKeyFixes: { type: [String], default: [] },
    coachingFollowUps: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);

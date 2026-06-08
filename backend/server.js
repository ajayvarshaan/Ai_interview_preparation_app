require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authController = require("./controller/authController");
const sessionRoutes = require("./routes/sessionRoutes");
const sessionController = require("./controller/sessionController");
const questionRoutes = require("./routes/questionRoutes");
const questionController = require("./controller/questionController");
const { protect } = require("./middlewares/authMiddleware");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
  evaluateAnswer,
  improveAnswer,
  clarifyDoubt,
} = require("./controller/aiController");


const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();
// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);
app.post("/api/ai/evaluate-answer", protect, evaluateAnswer);
app.post("/api/ai/improve-answer", protect, improveAnswer);
app.post("/api/ai/clarify-doubt", protect, clarifyDoubt);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
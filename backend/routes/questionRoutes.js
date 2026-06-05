const express = require("express");
const { togglePinQuestion, updateQuestionNote, addQuestionsToSession, toggleDoneQuestion } = require("../controller/questionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/done", protect, toggleDoneQuestion);
router.post("/:id/note", protect, updateQuestionNote);

module.exports = router;

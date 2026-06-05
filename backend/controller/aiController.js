const { GoogleGenAI } = require("@google/genai");
const { conceptExplainPrompt, questionAnswerPrompt, evaluateAnswerPrompt } = require("../utils/prompts");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateWithRetry = async (params, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      const is503 = error?.status === 503 || error?.message?.includes("503");
      if (is503 && i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay * (i + 1)));
      } else {
        throw error;
      }
    }
  }
};

const cleanJSON = (text) =>
  text.replace(/```json\s*/g, "").replace(/```/g, "").trim();

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const response = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const data = JSON.parse(cleanJSON(response.text));
    return res.status(200).json(data);
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const data = JSON.parse(cleanJSON(response.text));
    return res.status(200).json(data);
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

// @desc    Evaluate user answer in mock interview
// @route   POST /api/ai/evaluate-answer
// @access  Private
const evaluateAnswer = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = evaluateAnswerPrompt(question, userAnswer);

    const response = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const data = JSON.parse(cleanJSON(response.text));
    return res.status(200).json(data);
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      message: "Failed to evaluate answer",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
  evaluateAnswer,
};

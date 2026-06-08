const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a detailed but beginner-friendly answer.
- If the answer needs a code example, add a small code block inside.
- Keep formatting very clean.
- Return a pure JSON array like:

[
  {
    "question": "Question here?",
    "answer": "Answer here."
  },
  ...
]

Important: Do NOT add any extra text. Only return valid JSON.
`;

const conceptExplainPrompt = (question) => `
You are an AI trained to generate explanations for a given interview question.

Task:

Explain the following interview question and its concept in-depth as if you're teaching a beginner developer.

Question: "${question}"

After the explanation, provide a short and clear title that summarizes the concept for the article or note.

If the explanation includes a code example, provide a small code block.

Keep the formatting very clean and clear.

Return the result as a valid JSON object in the following format:

{
  "title": "Short title here?",
  "explanation": "Explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;

const evaluateAnswerPrompt = (question, userAnswer) => `
You are an expert technical interviewer evaluating a candidate's answer.

Question: "${question}"
Candidate's Answer: "${userAnswer}"

Evaluate the answer and return a JSON object with the following fields:
{
  "score": <number from 0 to 10>,
  "feedback": "Detailed feedback on the answer, what was good, what was missing.",
  "idealAnswer": "A concise ideal answer for this question.",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;

const improveAnswerPrompt = (question, userAnswer) => `
You are an expert technical interviewer and coach.

Task:
1) Evaluate the candidate's answer.
2) Produce an improved, corrected, and clearer answer.
3) Provide a short list of key fixes the candidate should apply.
4) Provide 3 follow-up practice questions to reinforce understanding.

Inputs:
Question: "${question}"
Candidate's Answer: "${userAnswer}"

Return a PURE JSON object in the following format:
{
  "score": <number from 0 to 10>,
  "feedback": "Detailed coaching feedback (what to keep, what to improve, what to add).",
  "improvedAnswer": "A better version of the answer written clearly and technically.",
  "keyFixes": ["fix 1", "fix 2", "fix 3"],
  "followUpQuestions": ["follow up question 1", "follow up question 2", "follow up question 3"]
}

Important:
- Do NOT add any extra text outside JSON.
- Only return valid JSON.
`;

const clarifyDoubtPrompt = ({ sessionId, questionContext, userMessage }) => `
You are an AI tutor for interview preparation.

Task:
- Clarify the user's doubt in a beginner-friendly way.
- If needed, provide a small example (code or pseudo-code).
- Keep the response concise but useful.
- Always answer directly.

Context:
- SessionId: ${sessionId || "(not provided)"}
- Related context: ${questionContext || "(none)"}

User doubt:
${userMessage}

Return a PURE JSON object in this format:
{
  "answer": "..."
}

Important: Do NOT add extra text outside JSON.
`;

module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
  evaluateAnswerPrompt,
  improveAnswerPrompt,
  clarifyDoubtPrompt,
};


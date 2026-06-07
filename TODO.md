# TODO

- [x] Implement mobile-aligned Q&A display in InterviewPrep section.
- [x] Adjust QuestionCard layout for small screens so Question text, Answer preview, and action buttons align correctly.
- [x] Adjust “Learn More” explanation panel to behave like a mobile drawer (no stuck side panel spacing) and ensure header/body spacing is mobile-friendly.
- [ ] Run frontend lint/build (if available) and sanity-check responsive layout.
- [ ] Add “AI Answer Coaching: Improve My Answer” (persisted per question)
  - [x] Backend: extend Question model for coaching results
  - [x] Backend: add new AI endpoint `/api/ai/improve-answer`
  - [x] Frontend: add “Improve Answer” UI in InterviewPrep/QuestionCard
  - [x] Frontend: display persisted coaching output on reload



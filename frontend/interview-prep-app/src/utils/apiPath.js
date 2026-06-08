export const BASE_URL = "https://ai-interview-preparation-app-front.onrender.com";




export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },

  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions",
    GENERATE_EXPLANATION: "/api/ai/generate-explanation",
    EVALUATE_ANSWER: "/api/ai/evaluate-answer",
    IMPROVE_ANSWER: "/api/ai/improve-answer",
    CLARIFY_DOUBT: "/api/ai/clarify-doubt",
  },

  SESSION: {
    CREATE: "/api/sessions/create",
    GET_ALL: "/api/sessions/my-sessions",
    GET_ONE: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
  },

  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",
    PIN: (id) => `/api/questions/${id}/pin`,
    DONE: (id) => `/api/questions/${id}/done`,
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
  },
};

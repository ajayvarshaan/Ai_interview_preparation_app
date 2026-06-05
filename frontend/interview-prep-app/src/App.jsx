import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import MockInterview from "./pages/InterviewPrep/MockInterview";
import UserProvider from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
          <Route path="/mock-interview/:sessionId" element={<MockInterview />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
    </UserProvider>
  );
};

export default App;

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import SharedLayout from "./components/SharedLayout/SharedLayout";
import Home from "./pages/Home/Home";
import Landing from "./pages/Landing/Landing";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import Answer from "./pages/Answer/Answer";
import NotFound from "./Pages/NotFound/NotFound";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import EditQuestion from "./pages/EditQuestion/EditQuestion";
import TermsAndConditions from "./pages/TermsAndConditions/TermsAndConditions";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Landing />} />
          <Route path="home" element={<Home />} />
          <Route path="ask-question" element={<AskQuestion />} />
          <Route path="answer/:question_id" element={<Answer />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          <Route
            path="/EditQuestion/:question_id/edit"
            element={<EditQuestion />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer position="top-center" autoClose={1500} />
    </>
  );
}

export default App;

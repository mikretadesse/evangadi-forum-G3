// import React from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Routes, Route } from "react-router-dom";
// import SharedLayout from "./components/SharedLayout/SharedLayout";
// import Landing from "./pages/Landing/Landing";
// import Home from "./Pages/Home/Home"; //
// import AskQuestion from "./pages/AskQuestion/AskQuestion";
// import Answer from "./pages/Answer/Answer";
// import NotFound from "./Pages/NotFound/NotFound";
// import About from "./components/About/About";
// import Login from "./components/Login/Login";
// import Signup from "./components/Signup/Signup";
// import Howitworks from "./pages/HowItWorks/Howitworks";
// import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
// import ResetPassword from "./components/ForgotPassword/ResetPassword";


// function App() {
//   return (
//     <>
//       <Routes>
//         <Route path="/" element={<SharedLayout />}>
//           <Route index element={<Landing />} />
//           <Route path="home" element={<Home />} />
//           <Route path="ask-question" element={<AskQuestion />} />
//           <Route path="answer/:id" element={<Answer />} />
//           <Route path="forgot-password" element={<ForgotPassword />} />
//           <Route path="reset-password" element={<ResetPassword />} />
//           <Route path="answer/:question_id" element={<Answer />} />
//           <Route path="login" element={<Login />} />
//           <Route path="signup" element={<Signup />} />
//           <Route path="*" element={<NotFound />} />
//           <Route path="about" element={<About />} />
//           <Route path="how-it-works" element={<Howitworks />} />
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//       {/*  Toast system */}
//       <ToastContainer position="top-center" autoClose={1500} />
//     </>
//   );
// }

// export default App;

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import SharedLayout from "./components/SharedLayout/SharedLayout";
import Home from "./Pages/Home/Home";
// import Landing from "./pages/Landing/Landing";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import Answer from "./pages/Answer/Answer";
import NotFound from "./Pages/NotFound/NotFound";
import About from "./components/About/About";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Howitworks from "./pages/HowItWorks/Howitworks";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import Howitworks from "./pages/Howitworks/Howitworks";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          {/* Redirect from "/" to "/home" */}
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="ask-question" element={<AskQuestion />} />
          <Route path="answer/:question_id" element={<Answer />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="about" element={<About />} />
          <Route path="how-it-works" element={<Howitworks />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer position="top-center" autoClose={1500} />
    </>
  );
}

export default App;


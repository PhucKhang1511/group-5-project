import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainApp from "./MainApp"; // app chính của bạn
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;


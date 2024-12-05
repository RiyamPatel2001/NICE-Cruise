import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Signin";
import HomePage from "./HomePage";
import SuccessPage from "./Success";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<HomePage />} />{" "}
        {/* Update this to /home */}
        <Route path="/Success" element={<SuccessPage />} />{" "}
        {/* Correct path for SuccessPage */}
      </Routes>
    </Router>
  );
}

export default App;

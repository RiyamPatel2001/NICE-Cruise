import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Signin";
import HomePage from "./HomePage";
import SuccessPage from "./Success";
import TotalCost from "./TotalCost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<HomePage />} />{" "}
        {/* Update this to /home */}
        <Route path="/Success" element={<SuccessPage />} />{" "}
        {/* Correct path for SuccessPage */}
        <Route path="/totalcost" element={<TotalCost />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;

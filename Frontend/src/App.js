import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Signin";
import HomePage from "./HomePage";
import SuccessPage from "./Success";
import TotalCost from "./TotalCost";
import GuestInformation from "./GuestInformation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<HomePage />} />{" "}
        <Route path="/Success" element={<SuccessPage />} />{" "}
        <Route path="/GuestInformation" element={<GuestInformation />} />
        <Route path="/totalcost" element={<TotalCost />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;

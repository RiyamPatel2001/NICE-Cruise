import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GuestInformation from "./GuestInformation";
import HomePage from "./HomePage";
import Register from "./Register";
import SignIn from "./Signin";
import SuccessPage from "./Success";
import TotalCost from "./TotalCost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/guest-information" element={<GuestInformation />} />
        <Route path="/total-cost" element={<TotalCost />} />
      </Routes>
    </Router>
  );
}

export default App;

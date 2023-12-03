import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import MatchDetailsPage from "./MatchDetailsPage";
import LoginPage from "./Pages/UserManagement/Login";
import SignupPage from "./Pages/UserManagement/Signup";
import NavbarComponent from "./Component/NavbarComponent";
import SavedMatches from "./SavedMatches";

function App() {
  return (
    <Router>
      <NavbarComponent></NavbarComponent>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/match-details" element={<MatchDetailsPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/saved-matches" element={<SavedMatches />} />
      </Routes>
    </Router>
  );
}

export default App;

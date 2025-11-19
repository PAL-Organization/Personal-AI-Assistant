import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Callback from "../pages/Callback";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/ccallback" element={<Callback />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

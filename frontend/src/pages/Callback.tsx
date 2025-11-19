import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate authentication token processing
    setTimeout(() => {
      navigate("/profile");
    }, 1200);
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-sky-600 border-t-transparent"></div>
      <p className="text-slate-600">Processing login...</p>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginButton() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(false);

  return loggedIn ? (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600">shivansh@pal.ai</span>
      <button
        onClick={() => setLoggedIn(false)}
        className="px-3 py-1.5 rounded-md border text-sm"
      >
        Logout
      </button>
    </div>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="bg-sky-600 text-white px-3 py-1.5 rounded-md rounded text-sm hover:bg-sky-700"
    >
      Login
    </button>
  );
}

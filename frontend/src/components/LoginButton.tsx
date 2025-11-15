import React from "react";

export default function LoginButton() {
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
      onClick={() => setLoggedIn(true)}
      className="bg-sky-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-sky-700"
    >
      Login
    </button>
  );
}

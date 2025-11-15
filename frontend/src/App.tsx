import React from "react";
import LoginButton from "./components/LoginButton";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">PAL — Personal AI</h1>
          <LoginButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1">
        <Dashboard />
      </main>

      <footer className="bg-white border-t py-4 text-center">
        <small className="text-slate-500">© PAL-Organization</small>
      </footer>
    </div>
  );
}

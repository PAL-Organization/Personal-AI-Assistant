import React from "react";

export default function Dashboard() {
  const [messages, setMessages] = React.useState<string[]>([
    "Welcome to PAL — your personal AI layer.",
  ]);
  const [input, setInput] = React.useState("");

  function send() {
    if (!input.trim()) return;
    setMessages((m) => [...m, `You: ${input}`]);
    setTimeout(() => {
      setMessages((m) => [...m, `PAL: Got it — saved \"${input}\" to memory.`]);
    }, 600);
    setInput("");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <section className="md:col-span-2">
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-3">Chat</h2>
          <div className="h-64 overflow-auto border rounded p-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className="mb-2 text-sm">
                {m}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="Say something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              className="bg-sky-600 text-white px-4 py-2 rounded"
              onClick={send}
            >
              Send
            </button>
          </div>
        </div>
      </section>

      <aside>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-medium mb-2">Quick Facts</h3>
          <ul className="text-sm text-slate-600">
            <li>- No memories yet</li>
            <li>- Autofill extension not connected</li>
            <li>- Email not connected</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

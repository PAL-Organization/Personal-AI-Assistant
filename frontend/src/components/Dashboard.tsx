// frontend/src/components/Dashboard.tsx
import React from "react";
import { addMemory, getMemory } from "../lib/memoryApi";

export default function Dashboard() {
  const [messages, setMessages] = React.useState<string[]>([
    "Welcome to PAL — your personal AI layer.",
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [extensionStatus, setExtensionStatus] = React.useState<
    "connected" | "not-connected"
  >("not-connected");

  // Example: on mount, try to load a previous memory
  React.useEffect(() => {
    (async () => {
      try {
        const res = await getMemory("last_message");
        if (res?.value) {
          setMessages((m) => [...m, `PAL: Remembered last message: "${res.value}"`]);
        }
      } catch (err) {
        // ignore if backend not available
        console.warn("getMemory failed", err);
      }
    })();
  }, []);

  // Step 6: detect extension (safe check)
  // in Dashboard.tsx, inside the useEffect for extension detection:

React.useEffect(() => {
  try {
    // set up listener for response from content script
    function onMessage(e: MessageEvent) {
      const m = e.data || {};
      if (m && m.channel === "PAL" && m.action === "PING_RESP") {
        if (m.data && m.data.status === "ok") {
          setExtensionStatus("connected");
        } else {
          setExtensionStatus("not-connected");
        }
      }
    }
    window.addEventListener("message", onMessage);

    // Post a ping message to the page. content script will forward to background.
    window.postMessage({ channel: "PAL", action: "PING" }, "*");

    // cleanup
    return () => window.removeEventListener("message", onMessage);
  } catch (err) {
    setExtensionStatus("not-connected");
  }
}, []);


  async function send() {
    if (!input.trim()) return;
    const text = input.trim();

    // update local UI immediately
    setMessages((m) => [...m, `You: ${text}`]);
    setInput("");
    setLoading(true);

    try {
      // persist to backend memory
      await addMemory("last_message", text);

      // fake AI reply after brief delay
      setTimeout(() => {
        setMessages((m) => [...m, `PAL: Got it — saved "${text}" to memory.`]);
        setLoading(false);
      }, 450);
    } catch (err) {
      setMessages((m) => [...m, `PAL: Could not save memory (offline).`]);
      setLoading(false);
      console.error(err);
    }
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
            {loading && <div className="text-sm text-slate-500">Saving...</div>}
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
            <li>
              - Autofill extension:{" "}
              {extensionStatus === "connected" ? (
                <span style={{ color: "green" }}>Connected</span>
              ) : (
                <span style={{ color: "red" }}>Not connected</span>
              )}
            </li>
            <li>- Email not connected</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

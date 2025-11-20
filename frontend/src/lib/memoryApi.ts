// frontend/src/lib/memoryApi.ts
const BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export async function addMemory(key: string, value: string) {
  const res = await fetch(`${BASE}/api/memory/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error(`addMemory failed: ${res.status}`);
  return res.json();
}

export async function getMemory(key: string) {
  const res = await fetch(`${BASE}/api/memory/${encodeURIComponent(key)}`);
  if (!res.ok) throw new Error(`getMemory failed: ${res.status}`);
  return res.json();
}

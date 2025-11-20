// background.js - service worker
const BACKEND_BASE = "http://127.0.0.1:8000"; // change if needed

// Create a context menu item for selected text
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pal-save-selection",
    title: "Save selection to PAL memory",
    contexts: ["selection"]
  });
});
// extension/background.js (add or confirm)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "PING_PAL" || message?.type === "PING_PAL") {
    sendResponse({ status: "ok" });
    return true;
  }

  // If page asked background via content script with {type: "SAVE_TO_MEMORY", payload}
  if (message && message.type === "SAVE_TO_MEMORY") {
    const { key, value } = message.payload || {};
    // call backend (same saveToMemory implementation you already have)
    fetch("http://127.0.0.1:8000/api/memory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    })
      .then((r) => r.json().then((d) => sendResponse({ ok: true, data: d })))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true; // indicates we will call sendResponse asynchronously
  }
});

// handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "pal-save-selection") {
    // Tell content script to get the selection and send it back
    chrome.tabs.sendMessage(tab.id, { type: "GET_SELECTION" }, (response) => {
      if (!response) {
        console.warn("No response from content script (maybe not injected).");
        return;
      }
      const selectedText = response.selection ?? "";
      if (selectedText.trim()) {
        saveToMemory("selected_text", selectedText).then((r) => {
          // Notify content script / popup
          chrome.tabs.sendMessage(tab.id, { type: "PAL_SAVED", value: selectedText });
        }).catch((err) => {
          console.error("Save failed", err);
          chrome.tabs.sendMessage(tab.id, { type: "PAL_SAVE_FAILED", error: String(err) });
        });
      }
    });
  }
});

// ping handler from popup or content
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "PING_PAL") {
    sendResponse({ status: "ok" });
    return true;
  }

  return true;
});

// function to call backend
async function saveToMemory(key, value) {
  const resp = await fetch(`${BACKEND_BASE}/api/memory/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value })
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return resp.json();
}

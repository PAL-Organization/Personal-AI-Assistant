// content.js
// Listens for a GET_SELECTION request from background and returns the current selection.
// Also shows a tiny on-page toast for success/failure (optional simple UI).

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "GET_SELECTION") {
    // window.getSelection() must be called in page context
    const sel = window.getSelection();
    const text = sel ? sel.toString() : "";
    sendResponse({ selection: text });
    return true; // keep channel open if async
  }

  if (message?.type === "PAL_SAVED") {
    showToast(`Saved to PAL: "${truncate(message.value, 80)}"`);
  }

  if (message?.type === "PAL_SAVE_FAILED") {
    showToast(`PAL save failed: ${message.error}`, true);
  }
});

// small toast UI injection
function showToast(text, isError=false) {
  const id = "__pal_toast";
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.style.position = "fixed";
    el.style.right = "16px";
    el.style.bottom = "16px";
    el.style.zIndex = 999999;
    el.style.padding = "8px 12px";
    el.style.borderRadius = "6px";
    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    el.style.fontFamily = "Arial, sans-serif";
    el.style.fontSize = "13px";
    document.body.appendChild(el);
  }
  el.style.background = isError ? "#ffdddd" : "#e6ffed";
  el.style.color = isError ? "#900" : "#053";
  el.textContent = text;
  el.style.opacity = "1";
  setTimeout(() => {
    el.style.transition = "opacity 400ms";
    el.style.opacity = "0";
  }, 2400);
}

function truncate(s, n) {
  if (!s) return s;
  return s.length > n ? s.slice(0, n-1) + "…" : s;
}
// extension/content.js
// Injected into every page (run_at: document_end)
// Responsibilities:
// 1) respond to runtime messages from background (shows toast)
// 2) bridge page <-> background using window.postMessage

// ---------- existing toast functionality ----------
function showToast(text, isError = false) {
  const id = "__pal_toast";
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.style.position = "fixed";
    el.style.right = "16px";
    el.style.bottom = "16px";
    el.style.zIndex = 999999;
    el.style.padding = "8px 12px";
    el.style.borderRadius = "6px";
    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    el.style.fontFamily = "Arial, sans-serif";
    el.style.fontSize = "13px";
    document.body.appendChild(el);
  }
  el.style.background = isError ? "#ffdddd" : "#e6ffed";
  el.style.color = isError ? "#900" : "#053";
  el.textContent = text;
  el.style.opacity = "1";
  setTimeout(() => {
    el.style.transition = "opacity 400ms";
    el.style.opacity = "0";
  }, 2400);
}

function truncate(s, n) {
  if (!s) return s;
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

// Listen for messages from background (service worker)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "PAL_SAVED") {
    showToast(`Saved to PAL: "${truncate(message.value, 80)}"`);
  }
  if (message?.type === "PAL_SAVE_FAILED") {
    showToast(`PAL save failed: ${message.error}`, true);
  }

  // if background asks for selection, content script can handle it
  if (message?.type === "GET_SELECTION_PAGE") {
    const sel = window.getSelection();
    sendResponse({ selection: sel ? sel.toString() : "" });
    return true;
  }
});

// ---------- Page <-> Extension bridge ----------
// From the page: window.postMessage({ channel: 'PAL', action: 'PING' }, '*')
// We'll forward to chrome.runtime and post the response back as:
// window.postMessage({ channel: 'PAL', action: 'PING_RESP', data: {...} }, '*')

window.addEventListener("message", async (event) => {
  // only accept messages from the same window
  if (event.source !== window) return;
  const msg = event.data || {};
  if (msg && msg.channel === "PAL") {
    try {
      if (msg.action === "PING") {
        // forward to background and get response
        chrome.runtime.sendMessage("PING_PAL", (resp) => {
          window.postMessage({ channel: "PAL", action: "PING_RESP", data: resp }, "*");
        });
      }

      if (msg.action === "SAVE_SELECTION_FROM_PAGE") {
        // optional: page asked 'save selection' -> ask background to save
        // msg.payload should be {key, value}
        const payload = msg.payload || {};
        chrome.runtime.sendMessage({ type: "SAVE_TO_MEMORY", payload }, (resp) => {
          window.postMessage({ channel: "PAL", action: "SAVE_RESP", data: resp }, "*");
        });
      }

      // add other actions as needed
    } catch (err) {
      window.postMessage({ channel: "PAL", action: "ERROR", data: String(err) }, "*");
    }
  }
});

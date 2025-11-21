// popup.js
document.getElementById("ping").addEventListener("click", () => {
  chrome.runtime.sendMessage("PING_PAL", (resp) => {
    const s = document.getElementById("status");
    if (resp && resp.status === "ok") {
      s.textContent = "connected";
      s.style.color = "green";
    } else {
      s.textContent = "not responding";
      s.style.color = "red";
    }
  });
});

// On open, ping
chrome.runtime.sendMessage("PING_PAL", (resp) => {
  const s = document.getElementById("status");
  if (resp && resp.status === "ok") {
    s.textContent = "connected";
    s.style.color = "green";
  } else {
    s.textContent = "not responding";
    s.style.color = "red";
  }
});

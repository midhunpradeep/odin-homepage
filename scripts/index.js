"use strict";

const CURSOR_DURATION_MS = 150;

function createGlowDot(event, timeout) {
  const dot = document.createElement("div");
  dot.classList.add("glow-dot");
  dot.style.left = `${event.pageX}px`;
  dot.style.top = `${event.pageY}px`;
  document.body.appendChild(dot);
  setTimeout(() => document.body.removeChild(dot), timeout);
}

function main() {
  window.addEventListener("mousemove", (event) => {
    createGlowDot(event, CURSOR_DURATION_MS);
  });
}

main();

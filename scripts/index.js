"use strict";

const CURSOR_DURATION_MS = 150;

function createDot(event, timeout) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  dot.style.left = `${event.pageX}px`;
  dot.style.top = `${event.pageY}px`;
  document.body.appendChild(dot);
  setTimeout(() => document.body.removeChild(dot), timeout);
}

function main() {
  window.addEventListener("mousemove", (event) => {
    createDot(event, CURSOR_DURATION_MS);
  });
}

main();

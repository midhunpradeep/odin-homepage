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

let _lastStarTime = new Date().getTime();
function createStar(event, color, timeout, delay) {
  const currentTime = new Date().getTime();
  if (currentTime - _lastStarTime < delay) {
    return;
  }

  _lastStarTime = currentTime;
  const star = document.createElement("div");
  star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star-four-points</title><path fill=${color} d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" /></svg>`;
  star.classList.add("star");
  star.style.left = `${event.pageX}px`;
  star.style.top = `${event.pageY}px`;
  document.body.appendChild(star);
  setTimeout(() => document.body.removeChild(star), timeout);
}

function main() {
  window.addEventListener("mousemove", (event) => {
    createGlowDot(event, CURSOR_DURATION_MS);
    createStar(event, "#FFFFFF", CURSOR_DURATION_MS * 3, 100);
  });
}

main();

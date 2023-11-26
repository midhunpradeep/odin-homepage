"use strict";

const CURSOR_DURATION_MS = 150;
// const STAR_DURATION_MS = CURSOR_DURATION_MS * 3;
const TIME_BETWEEN_STARS_MS = 100;

function createGlowDot(event, timeout) {
  const dot = document.createElement("div");
  dot.classList.add("glow-dot");
  dot.style.left = `${event.pageX}px`;
  dot.style.top = `${event.pageY}px`;
  document.body.appendChild(dot);
  setTimeout(() => document.body.removeChild(dot), timeout);
}

let _lastStarTime = new Date().getTime();
function shouldCreateStar(delay) {
  const currentTime = new Date().getTime();
  return currentTime - _lastStarTime >= delay;
}

function createStar(event, color, animation) {
  _lastStarTime = new Date().getTime();
  const star = document.createElement("div");
  star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star-four-points</title><path fill=${color} d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" /></svg>`;
  star.classList.add("star");
  star.style.left = `${event.pageX}px`;
  star.style.top = `${event.pageY}px`;
  star.style.animationName = animation;
  document.body.appendChild(star);
  star.addEventListener("animationend", () => {
    document.body.removeChild(star);
  });
}

function main() {
  const starAnimations = ["fall-1", "fall-2", "fall-3"];
  const starColors = [
    "#FC456A",
    "#DD4A82",
    "#BE4E9A",
    "#9F53B3",
    "#7F57CB",
    "#605CE3",
    "#4160FB",
    "#605CE3",
    "#7F57CB",
    "#9F53B3",
    "#BE4E9A",
    "#DD4A82",
  ];

  let currentAnimation = 0;
  let currentStarColor = 0;

  window.addEventListener("mousemove", (event) => {
    createGlowDot(event, CURSOR_DURATION_MS);
    if (shouldCreateStar(TIME_BETWEEN_STARS_MS)) {
      createStar(
        event,
        starColors[currentStarColor],
        starAnimations[currentAnimation],
      );
      currentAnimation = (currentAnimation + 1) % starAnimations.length;
      currentStarColor = (currentStarColor + 1) % starColors.length;
    }
  });
}

main();

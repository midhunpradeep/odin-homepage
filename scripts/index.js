"use strict";

const CURSOR_DURATION_MS = 150;
// const STAR_DURATION_MS = CURSOR_DURATION_MS * 3;
const TIME_BETWEEN_STARS_MS = 75;

// disabled for now due to general jank
const MAX_DISTANCE_BETWEEN_DOTS = null;

// initialized in main()
let lastDotX = null;
let lastDotY = null;
function createGlowDot(x, y, maxDistanceBetweenDots, timeout) {
  if (maxDistanceBetweenDots !== null) {
    const dist = distanceBetween(x, y, lastDotX, lastDotY);
    if (dist > maxDistanceBetweenDots) {
      const numDotsBetween = Math.ceil(dist / maxDistanceBetweenDots) - 1;
      for (let i = 1; i < numDotsBetween; i++) {
        const alpha = i / numDotsBetween;
        createGlowDot(
          lerp(lastDotX, x, alpha),
          lerp(lastDotY, y, alpha),
          null,
          CURSOR_DURATION_MS,
        );
      }
    }
  }

  const dot = document.createElement("div");
  dot.classList.add("glow-dot");
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  document.body.appendChild(dot);
  lastDotX = x;
  lastDotY = y;
  setTimeout(() => document.body.removeChild(dot), timeout);
}

let _lastStarTime = new Date().getTime();
function shouldCreateStar(delay) {
  const currentTime = new Date().getTime();
  return currentTime - _lastStarTime >= delay;
}

function createStar(x, y, color, animation) {
  _lastStarTime = new Date().getTime();
  const star = document.createElement("div");
  star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star-four-points</title><path fill=${color} d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" /></svg>`;
  star.classList.add("star");
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.animationName = animation;
  document.body.appendChild(star);
  star.addEventListener("animationend", () => {
    document.body.removeChild(star);
  });
}

function main() {
  window.addEventListener(
    "mousemove",
    (event) => {
      lastDotX = event.pageX;
      lastDotY = event.pageY;
    },
    { once: true },
  );

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

  const mouseMoveListener = (event) => {
    createGlowDot(
      event.pageX,
      event.pageY,
      MAX_DISTANCE_BETWEEN_DOTS,
      CURSOR_DURATION_MS,
    );
    if (shouldCreateStar(TIME_BETWEEN_STARS_MS)) {
      createStar(
        event.pageX,
        event.pageY,
        starColors[currentStarColor],
        starAnimations[currentAnimation],
      );
      currentAnimation = (currentAnimation + 1) % starAnimations.length;
      currentStarColor = (currentStarColor + 1) % starColors.length;
    }
  };

  window.addEventListener("mousemove", mouseMoveListener);
  let hasListener = true;

  const toggleAnimBtn = document.querySelector(".mouse-anim-toggle");
  toggleAnimBtn.addEventListener("click", () => {
    if (hasListener) {
      window.removeEventListener("mousemove", mouseMoveListener);
      toggleAnimBtn.textContent = "Enable mouse animation";
    } else {
      window.addEventListener("mousemove", mouseMoveListener);
      toggleAnimBtn.textContent = "Disable mouse animation";
    }
    hasListener = !hasListener;
  });

  const settingsList = document.querySelector(".settings");
  settingsList.addEventListener("transitionrun", () => {
    if (!settingsList.classList.contains("hidden")) {
      settingsList.style.visibility = "visible";
    }
  });
  settingsList.addEventListener("transitionend", () => {
    if (settingsList.classList.contains("hidden")) {
      settingsList.style.visibility = "hidden";
    }
  });

  const settingsBtn = document.querySelector(".settings-btn");
  settingsBtn.addEventListener("click", () => {
    if (settingsList.classList.contains("hidden")) {
      settingsBtn.classList.add("rotate-anticlockwise");
    } else {
      settingsBtn.classList.add("rotate-clockwise");
    }

    settingsList.classList.toggle("hidden");
  });
  settingsBtn.addEventListener("animationend", () => {
    settingsBtn.classList.remove("rotate-clockwise");
    settingsBtn.classList.remove("rotate-anticlockwise");
  });
}

main();

function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function lerp(a, b, alpha) {
  return a + alpha * (b - a);
}

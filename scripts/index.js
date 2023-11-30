"use strict";

const TIME_BETWEEN_STARS_MS = 75;
const DISTANCE_BETWEEN_STARS_PX = 75;

const MAX_GLOW_DOT_DISTANCE_PX = 7;

// Add animation nodes as child of main instead of body to prevent page overflow
const mainElement = document.querySelector("main");

function createGlowEffect(lastX, lastY, currentX, currentY) {
  if (lastX === null && lastY === null) {
    createGlowDot(currentX, currentY);
    return;
  }

  const mouseMoveDist = distanceBetween(lastX, lastY, currentX, currentY);
  const numDots = Math.max(
    1,
    Math.floor(mouseMoveDist / MAX_GLOW_DOT_DISTANCE_PX),
  );

  const dx = (currentX - lastX) / numDots;
  const dy = (currentY - lastY) / numDots;
  for (let i = 0; i < numDots; i++) {
    const x = lastX + dx * i;
    const y = lastY + dy * i;
    createGlowDot(x, y);
  }
}

function createGlowDot(x, y) {
  const dot = document.createElement("div");
  dot.classList.add("glow-dot");
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  mainElement.appendChild(dot);
  dot.addEventListener("animationend", () => {
    mainElement.removeChild(dot);
  });
}

let _lastStarTime = new Date().getTime();
let _lastStarX = null;
let _lastStarY = null;
function shouldCreateStar(delay, x, y) {
  const currentTime = new Date().getTime();
  if (currentTime - _lastStarTime >= delay) {
    return true;
  }

  const distance = distanceBetween(x, y, _lastStarX, _lastStarY);
  return distance >= DISTANCE_BETWEEN_STARS_PX;
}

function createStar(x, y, color, animation) {
  _lastStarTime = new Date().getTime();
  _lastStarX = x;
  _lastStarY = y;

  const star = document.createElement("div");
  star.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>star-four-points</title><path fill=${color} d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" /></svg>`;
  star.classList.add("star");
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.animationName = animation;
  mainElement.appendChild(star);
  star.addEventListener("animationend", () => {
    mainElement.removeChild(star);
  });
}

// Filled in main()
const _originalTexts = new Map();

function triggerTextHoverEffect(element, delay, timeBeforeNextAnimate) {
  const ITERATIONS_PER_LETTER = 3;

  if (element.classList.contains("trigger-text-animating")) {
    return;
  }

  element.classList.add("trigger-text-animating");
  const originalText = _originalTexts.get(element);
  let i = 0;
  let interval = setInterval(() => {
    const j = Math.floor(i / ITERATIONS_PER_LETTER);
    if (j > originalText.length) {
      clearInterval(interval);
      element.textContent = originalText;
      setTimeout(() => {
        element.classList.remove("trigger-text-animating");
      }, timeBeforeNextAnimate);

      return;
    }

    element.innerText =
      originalText.slice(0, j) + getRandomString(originalText.length - j);

    i++;
  }, delay);
}

function main() {
  let lastMouseX = null;
  let lastMouseY = null;

  window.addEventListener(
    "mousemove",
    (event) => {
      _lastStarX = event.pageX;
      _lastStarY = event.pageY;
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
    createGlowEffect(lastMouseX, lastMouseY, event.pageX, event.pageY);
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;

    if (shouldCreateStar(TIME_BETWEEN_STARS_MS, event.pageX, event.pageY)) {
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

  document.body.addEventListener("mouseleave", () => {
    lastMouseX = null;
    lastMouseY = null;
  });
  window.addEventListener("scroll", () => {
    lastMouseX = null;
    lastMouseY = null;
  });

  window.addEventListener("mousemove", mouseMoveListener);
  let hasListener = true;

  const textAnimateListeners = new Map();
  for (const animateText of document.querySelectorAll(".hover-animate")) {
    _originalTexts.set(animateText, animateText.textContent);

    const listener = () => {
      triggerTextHoverEffect(animateText, 30, 1000);
    };
    animateText.addEventListener("mouseover", listener);

    textAnimateListeners.set(animateText, listener);
  }

  const toggleAnimBtn = document.querySelector(".mouse-anim-toggle");
  toggleAnimBtn.addEventListener("click", () => {
    if (hasListener) {
      window.removeEventListener("mousemove", mouseMoveListener);
      for (const element of textAnimateListeners.keys()) {
        element.removeEventListener(
          "mouseover",
          textAnimateListeners.get(element),
        );
      }
      toggleAnimBtn.textContent = "Enable mouse animation";
    } else {
      window.addEventListener("mousemove", mouseMoveListener);
      for (const element of textAnimateListeners.keys()) {
        element.addEventListener(
          "mouseover",
          textAnimateListeners.get(element),
        );
      }
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

  const settingsArea = document.querySelector(".settings-wrapper");
  document.addEventListener("click", (event) => {
    if (
      !settingsList.classList.contains("hidden") &&
      event.target !== settingsArea &&
      !settingsArea.contains(event.target)
    ) {
      settingsBtn.classList.add("rotate-clockwise");
      settingsList.classList.add("hidden");
    }
  });
}

main();

function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getRandomString(length) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let string = "";
  for (let i = 0; i < length; i++) {
    string += alphabet.charAt(getRandomInteger(0, alphabet.length));
  }
  return string;
}

function getRandomInteger(low, highExclusive) {
  return Math.floor(Math.random() * highExclusive) + low;
}

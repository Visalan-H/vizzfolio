// Preloader with nickname to full name animation
export function initPreloader() {
  const PRELOADER_SEEN_KEY = "vizzfolio-preloader-seen";
  const preloader = document.getElementById("preloader");
  const preloaderName = document.getElementById("preloader-name");
  const mainContent = document.getElementById("main-content");

  if (!preloader || !preloaderName || !mainContent) return;
  if (preloader.dataset.started === "1") return;

  preloader.dataset.started = "1";

  const hasSeenPreloader = (() => {
    try {
      return sessionStorage.getItem(PRELOADER_SEEN_KEY) === "1";
    } catch {
      return false;
    }
  })();

  if (hasSeenPreloader) {
    skipPreloader(preloader, mainContent);
    return;
  }

  try {
    sessionStorage.setItem(PRELOADER_SEEN_KEY, "1");
  } catch {
    // Ignore storage access issues (private mode, blocked storage, etc.)
  }

  // Copy target font styles for pixel-perfect alignment
  copyTargetStyles(preloaderName, mainContent);

  // Animation: Vizz → Vi → Visalan H
  const nickname = "Vizz";
  const fullName = "Visalan H";
  const commonPrefix = "Vi"; // The part that stays

  // Phase 1: Type nickname
  typeText(preloaderName, nickname, 100, () => {
    setTimeout(() => {
      // Phase 2: Backspace to common prefix
      backspaceText(preloaderName, nickname, commonPrefix, 80, () => {
        // Phase 3: Type the rest of full name
        typeText(preloaderName, fullName.slice(commonPrefix.length), 60, () => {
          // Phase 4: Animate to target position
          setTimeout(() => {
            animateToTarget(preloader, preloaderName, mainContent);
          }, 400);
        }, commonPrefix); // Start with prefix already there
      });
    }, 500); // Pause on nickname
  });
}

function copyTargetStyles(preloaderName, mainContent) {
  mainContent.style.opacity = "0";
  mainContent.style.visibility = "hidden";
  mainContent.classList.remove("content-hidden");

  requestAnimationFrame(() => {
    const targetEl = document.getElementById("intro-name");
    if (targetEl) {
      const targetStyle = window.getComputedStyle(targetEl);
      preloaderName.style.fontSize = targetStyle.fontSize;
      preloaderName.style.letterSpacing = targetStyle.letterSpacing;
      preloaderName.style.lineHeight = targetStyle.lineHeight;
      preloaderName.style.fontWeight = targetStyle.fontWeight;
      preloaderName.style.fontFamily = targetStyle.fontFamily;
    }

    mainContent.classList.add("content-hidden");
    mainContent.style.removeProperty("opacity");
    mainContent.style.removeProperty("visibility");
  });
}

function typeText(element, text, speed, callback, prefix = "") {
  let i = 0;
  element.textContent = prefix;

  function type() {
    if (i < text.length) {
      element.textContent = prefix + text.slice(0, i + 1);
      i++;
      setTimeout(type, speed);
    } else {
      callback?.();
    }
  }
  type();
}

function backspaceText(element, currentText, targetPrefix, speed, callback) {
  let text = currentText;

  function backspace() {
    if (text.length > targetPrefix.length) {
      text = text.slice(0, -1);
      element.textContent = text;
      setTimeout(backspace, speed);
    } else {
      callback?.();
    }
  }
  backspace();
}

function animateToTarget(preloader, preloaderName, mainContent) {
  mainContent.classList.remove("content-hidden");
  mainContent.style.opacity = "0";
  mainContent.style.visibility = "hidden";

  requestAnimationFrame(() => {
    const targetEl = document.getElementById("intro-title");
    if (!targetEl) {
      finishAnimation(preloader, mainContent);
      return;
    }

    const targetRect = targetEl.getBoundingClientRect();
    const currentRect = preloaderName.getBoundingClientRect();

    // Disable transition for initial position
    preloaderName.style.transition = "none";
    preloaderName.classList.remove("centered");
    preloaderName.style.top = `${currentRect.top}px`;
    preloaderName.style.left = `${currentRect.left}px`;
    preloaderName.style.transform = "none";

    // Force reflow
    preloaderName.offsetHeight;

    // Enable transition
    preloaderName.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

    // Calculate offset
    const targetStyle = window.getComputedStyle(targetEl);
    const fontSize = parseFloat(targetStyle.fontSize);
    const verticalOffset = (targetRect.height - fontSize) / 2;

    // Animate to target
    const dx = targetRect.left - currentRect.left;
    const dy = targetRect.top - currentRect.top;

    preloaderName.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    preloaderName.style.transform = `translate(${dx}px, ${dy}px)`;

    preloader.classList.add("fade-bg");

    setTimeout(() => {
      finishAnimation(preloader, mainContent);
    }, 700);
  });
}

function finishAnimation(preloader, mainContent) {
  mainContent.style.removeProperty("opacity");
  mainContent.style.removeProperty("visibility");
  mainContent.classList.add("content-visible");

  const introName = document.getElementById("intro-name");
  introName?.classList.add("visible");

  preloader.classList.add("done");
  setTimeout(() => preloader.remove(), 300);
}

function skipPreloader(preloader, mainContent) {
  mainContent.classList.remove("content-hidden");
  mainContent.classList.add("content-visible");
  mainContent.style.removeProperty("opacity");
  mainContent.style.removeProperty("visibility");

  const introName = document.getElementById("intro-name");
  introName?.classList.add("visible");

  preloader.remove();
}

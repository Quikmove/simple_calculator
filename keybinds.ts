function getSelector(k: string): string | null {
  let selector;
  if (/^\d$/.test(k)) {
    selector = `button[data-number][data-key="${k}"]`;
    return selector;
  }
  switch (k) {
    case ".":
    case ",":
      selector = `button[data-dot]`;
      break;
    case "+":
      selector = `button[data-binary][data-key="add"]`;
      break;
    case "-":
      selector = `button[data-binary][data-key="subtract"]`;
      break;
    case "*":
      selector = `button[data-binary][data-key="multiply"]`;
      break;
    case "/":
      selector = `button[data-binary][data-key="divide"]`;
      break;
    case "^":
      selector = `button[data-binary][data-key="pow"]`;
      break;
    case "Enter":
    case "=":
      selector = `button[data-equals]`;
      break;
    case "Backspace":
      selector = `button[data-delete]`;
      break;
    case "Escape":
      selector = `button[data-all-clear]`;
      break;
    default:
      return null;
  }
  return selector;
}

document.addEventListener(
  "touchstart",
  function (e) {
    if (e.touches.length > 1) {
      e.preventDefault(); // Prevent zoom
    }
  },
  { passive: false }
);
// Prevent pinch zooming with gestures
document.addEventListener(
  "gesturestart",
  function (e) {
    e.preventDefault(); // Prevent zoom gesture
  },
  { passive: false }
);

document.addEventListener("keydown", (ev) => {
  if (ev.metaKey || ev.ctrlKey || ev.altKey || ev.key === "OS") return;
  if (ev.repeat) return;
  const k = ev.key;
  const selector = getSelector(k);
  if (!selector) return;
  const btn = document.querySelector<HTMLButtonElement>(selector);
  ev.preventDefault();
  btn?.click();
  btn?.focus({ preventScroll: true });
});
document.addEventListener("keyup", (ev) => {
  const k = ev.key;
  const selector = getSelector(k);
  if (!selector) return;
  const btn = document.querySelector<HTMLButtonElement>(selector);
  if (document.activeElement === btn) {
    btn?.blur();
  }
});

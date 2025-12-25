function getSessionId() {
  const key = "shui_session_id";
  let v = sessionStorage.getItem(key);
  if (!v) {
    v = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
    sessionStorage.setItem(key, v);
  }
  return v;
}

function canFire(type) {
  const key = `shui_alert_fired_${type}`;
  if (sessionStorage.getItem(key)) return false;
  sessionStorage.setItem(key, "1");
  return true;
}

async function postAlert(payload) {
  await fetch("/.netlify/functions/engagement-alert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      sessionId: getSessionId(),
      referrer: document.referrer || "",
      userAgent: navigator.userAgent || "",
    }),
  });
}

export function startEngagementTimer(getPath, getRouteCount) {
  let engagedSeconds = 0;
  let hasInteracted = false;

  const onInteract = () => {
    hasInteracted = true;
  };

  window.addEventListener("click", onInteract, true);
  window.addEventListener("keydown", onInteract, true);
  window.addEventListener("scroll", onInteract, { passive: true });

  const timer = setInterval(() => {
    if (!document.hidden) engagedSeconds += 1;

    if (hasInteracted && engagedSeconds >= 120 && canFire("engaged_2min")) {
      postAlert({
        type: "engaged_2min",
        path: getPath(),
        routeCount: getRouteCount(),
        engagedSeconds,
      }).catch(() => {});
    }
  }, 1000);

  return () => {
    clearInterval(timer);
    window.removeEventListener("click", onInteract, true);
    window.removeEventListener("keydown", onInteract, true);
    window.removeEventListener("scroll", onInteract);
  };
}

export function createRouteCounter() {
  let count = 0;
  return {
    inc: () => (count += 1),
    get: () => count,
  };
}

export function maybeFireNavigatedAround(path, routeCount) {
  if (routeCount >= 3 && canFire("navigated_around")) {
    postAlert({
      type: "navigated_around",
      path,
      routeCount,
      engagedSeconds: 0,
    }).catch(() => {});
  }
}

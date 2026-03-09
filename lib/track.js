export function track(eventName) {
  if (typeof window === 'undefined') return;

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: eventName, ts: Date.now(), path: window.location.pathname }),
    keepalive: true,
  }).catch(() => {});
}

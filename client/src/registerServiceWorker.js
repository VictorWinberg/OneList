let refreshing = false;

function clearServiceWorkers() {
  return navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length === 0) {
      return false;
    }

    return Promise.all(
      registrations.map((registration) => registration.unregister())
    ).then(() => true);
  });
}

function clearCaches() {
  if (!('caches' in window)) {
    return Promise.resolve();
  }

  return caches
    .keys()
    .then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
}

export default function register() {
  if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
    return;
  }

  const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
  if (publicUrl.origin !== window.location.origin) {
    return;
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) {
      return;
    }
    refreshing = true;
    window.location.reload();
  });

  // Replace any old worker with a one-time cleanup script, then reload.
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length > 0) {
      registrations.forEach((registration) => {
        registration.update();
      });
      return;
    }

    clearCaches();
  });
}

export function unregister() {
  clearServiceWorkers().then(() => clearCaches());
}

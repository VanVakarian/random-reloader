let reloadTimer;

function startReloading(minTime, maxTime) {
  stopReloading();
  const delay = Math.floor(Math.random() * (maxTime - minTime + 1) + minTime) * 1000;
  reloadTimer = setTimeout(() => {
    location.reload();
  }, delay);
}

function stopReloading() {
  if (reloadTimer) {
    clearTimeout(reloadTimer);
    reloadTimer = null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    startReloading(request.minTime, request.maxTime);
  } else if (request.action === 'stop') {
    stopReloading();
  }
});

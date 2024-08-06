let reloadTimers = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request, 'from sender:', sender);
  const tabId = request.tabId;

  if (tabId) {
    if (request.action === 'start') {
      console.log('Starting reload timer for tab:', tabId, 'with delay:', request.delay);
      const delay = request.delay;

      if (reloadTimers[tabId]) {
        clearTimeout(reloadTimers[tabId].timer);
      }

      const startTime = Date.now();
      const endTime = startTime + delay;

      reloadTimers[tabId] = {
        timer: setTimeout(() => {
          console.log('Reloading tab:', tabId);
          chrome.tabs.reload(tabId);
          delete reloadTimers[tabId];
        }, delay),
        endTime: endTime,
      };

      sendResponse({ endTime: endTime });
    } else if (request.action === 'stop') {
      console.log('Stopping reload timer for tab:', tabId);
      if (reloadTimers[tabId]) {
        clearTimeout(reloadTimers[tabId].timer);
        delete reloadTimers[tabId];
      }

      sendResponse({ status: 'stopped' });
    } else if (request.action === 'getStatus') {
      console.log('Getting status for tab:', tabId);
      const timer = reloadTimers[tabId];

      if (timer) {
        sendResponse({ endTime: timer.endTime });
      } else {
        sendResponse({ endTime: null });
      }
    }
  } else {
    console.log('No tab information');
    sendResponse({ error: 'No tab information' });
  }

  return true;
});

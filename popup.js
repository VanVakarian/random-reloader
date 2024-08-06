document.addEventListener('DOMContentLoaded', () => {
  const reloadBtn = document.getElementById('reloadBtn');
  const stopBtn = document.getElementById('stopBtn');
  const timerDisplay = document.getElementById('timerDisplay');
  let intervalId = null;

  function updateTimerDisplay(endTime) {
    if (intervalId) {
      clearInterval(intervalId);
    }

    if (!endTime) {
      timerDisplay.textContent = 'No timer set';
      return;
    }

    intervalId = setInterval(() => {
      const now = Date.now();
      const remainingTime = Math.max(0, endTime - now);
      timerDisplay.textContent = `Time left: ${Math.ceil(remainingTime / 1000)}s`;

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        timerDisplay.textContent = 'No timer set';
      }
    }, 1000);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.runtime.sendMessage({ action: 'getStatus', tabId: tabs[0].id }, (response) => {
        if (response && response.endTime !== undefined) {
          updateTimerDisplay(response.endTime);
        } else {
          timerDisplay.textContent = 'No timer set';
        }
      });
    }
  });

  reloadBtn.addEventListener('click', () => {
    const delay = 5000; // 5 секунд

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.runtime.sendMessage({ action: 'start', delay: delay, tabId: tabs[0].id }, (response) => {
          if (response && response.endTime !== undefined) {
            updateTimerDisplay(response.endTime);
          } else {
            timerDisplay.textContent = 'No timer set';
          }
        });
      }
    });
  });

  stopBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.runtime.sendMessage({ action: 'stop', tabId: tabs[0].id }, (response) => {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          timerDisplay.textContent = 'No timer set';
        });
      }
    });
  });
});

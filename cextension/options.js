// Save the API key to storage
document.getElementById('saveBtn').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  chrome.storage.sync.set({ 'OPENAI_API_KEY': apiKey }, () => {
    alert('API Key saved.');
  });
});

// Load the API key from storage
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['OPENAI_API_KEY'], (result) => {
    if (result.OPENAI_API_KEY) {
      document.getElementById('apiKeyInput').value = result.OPENAI_API_KEY;
    }
  });
});
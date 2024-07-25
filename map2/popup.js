document.getElementById('scrape-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scrape' }, (response) => {
            if (response && response.data) {
                document.getElementById('output').innerText = response.data;
            } else {
                document.getElementById('output').innerText = 'No data found.';
            }
        });
    });
});

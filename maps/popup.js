document.getElementById('scrape').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeData
      }, (results) => {
        document.getElementById('output').textContent = results[0].result;
      });
    });
  });
  
  function scrapeData() {
    const businesses = document.querySelectorAll('.fontBodyMedium');
    let businessesData = '';
    businesses.forEach(business => {
      businessesData += business.innerText + '\n';
    });
    return businessesData;
  }
  
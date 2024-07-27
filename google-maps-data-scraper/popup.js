document.addEventListener("DOMContentLoaded", function() {
  
  document.getElementById('scrapeButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: scrapeData
      }, (results) => {
        document.getElementById('result').textContent = results[0].result;
      });
    });
  });

// This function will be executed as a content script inside the current page
async function scrapeData() {
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  var links = Array.from(
    document.querySelectorAll('a[href^="https://www.google.com/maps/place"]')
  );
  var results = [];

  for (let link of links) {
    link.click();
    await delay(2000); // Increased delay to allow the page to load

    var h1Text = document.querySelector("h1")
      ? document.querySelector(".DUwDvf").innerText
      : "";
    var fontBodyMediumTexts = Array.from(
      document.querySelectorAll('[role="main"] .Io6YTe')
    )
      .slice(0, 30)
      .map((el) => el.innerText);

    results.push({
      link: link.href,
      h1: h1Text,
      fontBodyMedium: fontBodyMediumTexts,
      address: fontBodyMediumTexts[0],
    });

    await delay(2000);
  }

  function extractPhoneNumber(array) {
    const phoneNumberRegex = /\b\d{11}\b/;

    for (const item of array) {
      if (typeof item === "string") {
        // Remove all whitespace from the string
        const itemWithoutSpaces = item.replace(/\s+/g, "");
        // Match the phone number pattern
        const match = itemWithoutSpaces.match(phoneNumberRegex);
        if (match) {
          return match[0];
        }
      }
    }

    return null;
  }

  function extractWebsite(array) {
    const websiteRegex = /\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\b/;

    for (const item of array) {
      if (typeof item === "string") {
        const match = item.match(websiteRegex);
        if (match) {
          return match[0];
        }
      }
    }

    return null;
  }

  let csvContent = "Name,Phone,Website,Address,Link\n";

  results.forEach((item) => {
    const phone = extractPhoneNumber(item.fontBodyMedium) || "N/A"; 
    const website = extractWebsite(item.fontBodyMedium) || "N/A"; 

    // Escape double quotes for CSV format
    const escapedName = item.h1.replace(/"/g, '""');
    const escapedAddress = item.fontBodyMedium[0].replace(/"/g, '""');

    csvContent += `"${escapedName}","${phone}","${website}","${escapedAddress}","${item.link}"\n`;
  });
  
  console.log(csvContent);

  return csvContent;
}

});


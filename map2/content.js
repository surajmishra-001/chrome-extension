// content.js
const scrapeBusinessDetails = () => {
    const getTextOrNA = (textArray, index) => {
        return textArray[index] ? textArray[index].trim() : 'NA';
    };

    const businesses = document.querySelectorAll('.fontBodyMedium');
    let csvData = 'Name,Rating,Reviews,Category,Address,Status,Phone\n';

    businesses.forEach(business => {
        const text = business.innerText.split('·');
        const name = getTextOrNA(text, 0);
        const ratingAndReviews = getTextOrNA(text, 1).split('(');
        const categoryAndAddress = getTextOrNA(text, 2);
        const status = getTextOrNA(text, 3);
        const phone = getTextOrNA(text, 4);

        const rating = ratingAndReviews[0] ? ratingAndReviews[0].trim() : 'NA';
        const reviews = ratingAndReviews[1] ? ratingAndReviews[1].replace(')', '').trim() : 'NA';

        csvData += `${name},${rating},${reviews},${categoryAndAddress},${status},${phone}\n`;
    });

    return csvData;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scrape') {
        const data = scrapeBusinessDetails();
        sendResponse({ data });
    }
});

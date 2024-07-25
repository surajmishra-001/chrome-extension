const scrapeData = () => {
    const businesses = document.querySelectorAll('.fontBodyMedium');
    let businessesData = '';
    businesses.forEach(business => {
      businessesData += business.innerText + '\n';
    });
    console.log(businessesData);
  };
  
  scrapeData();
  
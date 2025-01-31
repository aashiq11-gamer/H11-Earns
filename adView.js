// Ad view earning function (adView.js)
const earnFromAdView = async (userId) => {
  try {
    const earnings = 0.50; // Earnings per ad view
    // Add earnings to user balance
    console.log("User earned:", earnings);
  } catch (error) {
    console.error("Error earning from ad view:", error.message);
  }
};

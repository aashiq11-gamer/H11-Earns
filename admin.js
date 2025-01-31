// Admin approve deposit/withdrawal (admin.js)
const approveDeposit = async (userId) => {
  try {
    // Update deposit status to approved
    console.log("Deposit approved for user:", userId);
  } catch (error) {
    console.error("Error approving deposit:", error.message);
  }
};

const approveWithdrawal = async (userId) => {
  try {
    // Update withdrawal status to approved
    console.log("Withdrawal approved for user:", userId);
  } catch (error) {
    console.error("Error approving withdrawal:", error.message);
  }
};

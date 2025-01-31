// Withdrawal function (withdrawal.js)
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const withdrawMoney = async (userId, amount) => {
  try {
    const withdrawalData = {
      amount: amount,
      status: "Pending", // Pending status until admin approval
      timestamp: new Date(),
    };
    await setDoc(doc(db, "withdrawals", userId), withdrawalData);
    console.log("Withdrawal request made.");
  } catch (error) {
    console.error("Error making withdrawal:", error.message);
  }
};

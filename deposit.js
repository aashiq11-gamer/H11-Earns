// Deposit function (deposit.js)
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const depositMoney = async (userId, amount) => {
  try {
    const depositData = {
      amount: amount,
      timestamp: new Date(),
    };
    await setDoc(doc(db, "deposits", userId), depositData);
    console.log("Deposit successful.");
  } catch (error) {
    console.error("Error making deposit:", error.message);
  }
};

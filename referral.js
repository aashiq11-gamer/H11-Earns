// Referral function (referral.js)
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const handleReferral = async (referrerId, refereeId) => {
  try {
    // Adding referral to the database
    await setDoc(doc(db, "referrals", referrerId), { refereeId: refereeId });
    console.log("Referral recorded.");
  } catch (error) {
    console.error("Error handling referral:", error.message);
  }
};

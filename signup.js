// SignUp function (signup.js)
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";

const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
};

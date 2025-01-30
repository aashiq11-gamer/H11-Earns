window.logIn = async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    showDashboard(userCredential.user);
  } catch (error) {
    console.error("Error logging in:", error);
    alert(error.message);
  }
};

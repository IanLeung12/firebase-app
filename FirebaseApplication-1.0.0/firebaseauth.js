import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
const firebaseConfig = {

  apiKey: "AIzaSyAtJW18iSNEhp5JJHX_8nWJGadhLYGtX1w",

  authDomain: "test-e8dcf.firebaseapp.com",

  projectId: "test-e8dcf",

  storageBucket: "test-e8dcf.firebasestorage.app",

  messagingSenderId: "342563741181",

  appId: "1:342563741181:web:e2d9bd63d4fa9824e7cd94"

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  // Gather form data
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  // Firebase built-in functions
  const auth = getAuth();
  const db = getFirestore();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      showMessage('Account Created Successfully', 'signUpMessage');
      // Firestore built-in functions
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html'
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        })
    })
    //Optional error handling
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email already in use', 'signUpMessage');
      }
    })
})

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem('loggedinUserId', user.uid);
      window.location.href = 'homepage.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/wrong-password') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else if (errorCode === 'auth/user-not-found') {
        showMessage('User not found', 'signInMessage');
      } else {
        showMessage('Error signing in', 'signInMessage');
      }
    })
})


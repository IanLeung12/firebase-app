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
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}


const signUp = document.getElementById('signUp');
signUp.addEventListener('click',(event) =>{
  event.preventDefault();

  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName
    }
    showMessage('Account created successfully', 'signUpMessage');
    const docRef=doc(db, "users", user.uid);
    setDoc(docRef,userData)
    .then(() => {
      window.location.href='index.html';
    })
    .catch((error) => {
      console.error("error writing document", error);
    })
  })
  .catch((error) => {
    const errorCode = error.code;
    if (errorCode=='auth/email-alread-in-use'){
      showMessage('Email already exists', 'signUpMessage');
    }
  })
})

const signIn = document.getElementById('signIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email=document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    showMessage('Logged in successfully', 'signInMessage');
    const user = userCredential.user;
    localStorage.setItem('loggedInUserId', user.uid);
    window.location.href=homepage.html;
  })
  .catch((error) => {
    const errorCode = error.code;
    if (errorCode == 'auth/invalid-credential') {
      showMessage('Incorrect email or password', 'signInMessage');
    } else if (errorCode== 'auth/user-not-found') {
      showMessage('User not found', 'signInMessage');
    } else {
      showMessage('Error signing in', 'signInMessage')
    }
  })
})


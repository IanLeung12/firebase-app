import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const loggedInUserId = localStorage.getItem('loggedinUserId');
    if (loggedInUserId) {
      const docRef = doc(db, "users", loggedInUserId);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            document.getElementById('loggedUserFName').innerText = userData.firstName;
            document.getElementById('loggedUserEmail').innerText = userData.email;
            document.getElementById('loggedUserLName').innerText = userData.lastName;
          } else {
            console.log('No such document');
          }
        })
        .catch((error) => {
          console.error("Error getting document: ", error);
        });
    }
  } else {
    console.log('User is not signed in');
  }
});

const logoutButton=document.getElementById('logout');

logoutButton.addEventListener('click', (event) => {
    localStorage.removeItem('loggedinUserId');
    signOut(auth)
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.log('Error signing out');
    })
})
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

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserLName').innerText=userData.lastName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
            } else {
                console.log("Error getting document");
            }
        })
    } else {
        console.log("User Id not found in local storage")
    }
});

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', (event) => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(() => {
        window.location.href('index.html');
    })
    .catch((error) => {
        console.log('Error signing out');
    })
})
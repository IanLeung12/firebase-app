import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, addDoc, deleteDoc, updateDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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
            fetchUserProjects(loggedInUserId);
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

const fetchUserProjects = (userId) => {
  // Clear existing projects first
  const userProjects = document.getElementById('userProjects');
  userProjects.innerHTML = '';
  // Query the projects subcollection
  const userProjectsRef = collection(db, "users", userId, "projects");
  getDocs(userProjectsRef)
    .then((querySnapshot) => {
      const projectsContainer = document.createElement('div');
      projectsContainer.style.marginLeft = "0";
      projectsContainer.style.width = "70%";
      querySnapshot.forEach((doc) => {
        const projectData = doc.data();
        const projectDiv = document.createElement('div');
        // Enhanced styling for project cards
        projectDiv.style.backgroundColor = 'rgba(211, 166, 139, 0.4)';
        projectDiv.style.padding = '15px';
        projectDiv.style.margin = '0 0 15px 0';
        projectDiv.style.borderRadius = '8px';
        projectDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        projectDiv.style.border = '1px solid rgba(211, 166, 139, 0.6)';
        projectDiv.style.position = 'relative';
        
        // Content styling
        projectDiv.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">${projectData.title}</h3>
            <p style="margin-bottom: 0;">${projectData.description}</p>
            <div style="position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 5px;">
              <button class="delete-project" style="
                background-color: #d9534f;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 2px 8px;
                cursor: pointer;
                font-size: 14px;
                width: 60px;
              ">Delete</button>
              <button class="edit-project" style="
                background-color: #5cb85c;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 2px 8px;
                cursor: pointer;
                font-size: 14px;
                width: 60px;
              ">Edit</button>
        `;
        projectsContainer.appendChild(projectDiv);
        const deleteButton = projectDiv.querySelector('.delete-project');
          deleteButton.addEventListener('click', () => {
            if(confirm("Are you sure you want to delete this project?")) {
              deleteProject(userId, doc.id);
            }
          });
          
        const editButton = projectDiv.querySelector('.edit-project');
        editButton.addEventListener('click', () => {
          editProject(userId, doc.id, projectData);
        });
      });
     
      userProjects.appendChild(projectsContainer);
   
    })
    .catch((error) => {
      console.error("Error fetching projects: ", error);
    });
};




const addProjectButton = document.getElementById('addProject');
const projectForm = document.getElementById('projectForm');

addProjectButton.addEventListener('click', () => {
  projectForm.style.display = projectForm.style.display === 'none' ? 'block' : 'none';
});

projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const projectTitle = document.getElementById('projectTitle').value;
  const projectDescription = document.getElementById('projectDescription').value;
  if (projectTitle && projectDescription) {
    const userId = localStorage.getItem('loggedinUserId');
    const userProjectsRef = collection(db, "users", userId, "projects");
    addDoc(userProjectsRef, {
      title: projectTitle,
      description: projectDescription
    })
    .then(() => {
      fetchUserProjects(userId);
      projectForm.reset();
      projectForm.style.display = 'none';
    })
    .catch((error) => {
      console.error("Error adding project: ", error);
    });
  }
});

const deleteProject = (userId, projectId) => {
  console.log('Deleting project with ID:', projectId);
  const projectRef = doc(db, "users", userId, "projects", projectId);

  deleteDoc(projectRef)
    .then(() => {
    fetchUserProjects(userId); // Refresh the projects list
    })
    .catch((error) => {
      console.error("Error deleting project: ", error);
    });
};

const editProject = (userId, projectId, projectData) => {
  const title = prompt("Edit project title:", projectData.title);
  const description = prompt("Edit project description:", projectData.description);
  
  if (title !== null && description !== null) {
    const projectRef = doc(db, "users", userId, "projects", projectId);
    updateDoc(projectRef, {
      title: title,
      description: description,
    })
    .then(() => {
      fetchUserProjects(userId); // Refresh the projects list
    })
    .catch((error) => {
      console.error("Error updating project: ", error);
    });
  }
};

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
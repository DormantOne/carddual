// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwsdgIZ1hpEmsQg7sZY0A2vEo71jyhwbY",
    authDomain: "carddual-b13da.firebaseapp.com",
    projectId: "carddual-b13da",
    storageBucket: "carddual-b13da.appspot.com",
    messagingSenderId: "280023498180",
    appId: "1:280023498180:web:940612b32d85e5a08c7891",
    measurementId: "G-KF6XZ6F2MS"
};

// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps.length) {
    initializeApp(firebaseConfig);
}

const database = getDatabase();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('resetButton').addEventListener('click', triggerReset);
    listenForReset();
});

function triggerReset() {
    // Clear all data in Firebase
    set(ref(database), {})
        .then(() => console.log("Firebase data cleared."))
        .catch((error) => console.error("Error clearing Firebase data: ", error));
}

function listenForReset() {
    // Listen for changes at the root of your Firebase database
    onValue(ref(database), (snapshot) => {
        const data = snapshot.val();
        if (data === null) { // Data is cleared
            console.log("Reset detected. Clearing local storage and redirecting.");
            localStorage.clear();
            window.location.href = 'index.html';
        }
    });
}

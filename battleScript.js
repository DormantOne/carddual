// Import Firebase modules
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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
if (!getApps().length) {
    initializeApp(firebaseConfig);
}
const database = getDatabase();

document.addEventListener('DOMContentLoaded', () => {
    listenForReset();

    const resetButton = document.getElementById('resetEverything');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            triggerReset();
        });
    }
});

function triggerReset() {
    set(ref(database, 'resetSignal'), {})
        .then(() => console.log("Reset signal triggered in Firebase."))
        .catch((error) => console.error("Error triggering reset signal: ", error));
}

function listenForReset() {
    const resetRef = ref(database, 'resetSignal');
    onValue(resetRef, (snapshot) => {
        if (snapshot.exists() && Object.keys(snapshot.val()).length === 0) {
            console.log("Reset detected, performing reset actions.");
            localStorage.clear();
            window.location.href = 'index.html'; // Redirect to the initial setup page
        }
    });
}


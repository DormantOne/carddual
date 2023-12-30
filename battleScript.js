// Import necessary Firebase modules
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

// Initialize Firebase only if no instances have been initialized yet
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const database = getDatabase();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('resetButton').addEventListener('click', triggerReset);
    displayPlayerInfo();
    listenForReset();
});

function displayPlayerInfo() {
    const playerName = localStorage.getItem('playerName');
    const playerTeam = localStorage.getItem('team');

    if (playerName && playerTeam) {
        const playerInfoDiv = document.getElementById('playerInfo');
        playerInfoDiv.innerHTML = `Player: ${playerName}, Team: ${playerTeam}`;
    } else {
        // Redirect to team selection page or show a message if player info is missing
        window.location.href = 'index.html'; // Redirect to the initial page
    }
}

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

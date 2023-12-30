// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    // Your Firebase configuration
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    listenForReset();

    document.getElementById('resetEverything').addEventListener('click', () => {
        triggerReset();
    });
});

function triggerReset() {
    // Clear a specific node in Firebase to signal a reset
    set(ref(database, 'resetSignal'), {})
        .then(() => console.log("Reset signal triggered in Firebase."))
        .catch((error) => console.error("Error triggering reset signal: ", error));
}

function listenForReset() {
    const resetRef = ref(database, 'resetSignal');
    onValue(resetRef, (snapshot) => {
        if (snapshot.exists() && Object.keys(snapshot.val()).length === 0) {
            // Detected an empty set, perform reset actions
            console.log("Reset detected, performing reset actions.");
            localStorage.clear();
            window.location.href = 'index.html'; // Redirect to the initial setup page
        }
    });
}

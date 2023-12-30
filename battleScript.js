import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "your_auth_domain",
    projectId: "your_project_id",
    storageBucket: "your_storage_bucket",
    messagingSenderId: "your_messaging_sender_id",
    appId: "your_app_id",
    measurementId: "your_measurement_id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('resetEverything').addEventListener('click', resetEverything);
});

function resetEverything() {
    // Clear local storage
    localStorage.clear();

    // Reset Firebase Database
    const initialData = {
        teams: {
            teamA: {},
            teamB: {}
        },
        // Include any other initial data structure you need
    };

    set(ref(database), initialData)
        .then(() => {
            alert("Everything has been reset.");
            // Redirect to the original HTML page
            window.location.href = 'index.html'; // Change 'index.html' to your original page
        })
        .catch((error) => console.error("Error resetting Firebase: ", error));
}

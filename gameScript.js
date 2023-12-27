import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    fetchPlayerNames();
});

function fetchPlayerNames() {
    const playerNamesRef = ref(database, 'players/name'); // Adjusted path to match Firebase structure
    onValue(playerNamesRef, (snapshot) => {
        const players = snapshot.val();
        console.log("Fetched players:", players); // Debugging line
        if (players) {
            // Assuming players are stored as an object, and we want to get their values
            displayPlayerTeamChoices(Object.values(players));
        }
    }, (error) => {
        console.error("Error fetching player names: ", error);
    });
}


function displayPlayerTeamChoices(players) {
    const playerTeamChoices = document.getElementById('playerTeamChoices');
    playerTeamChoices.innerHTML = '';

    players.forEach(player => {
        let playerRow = document.createElement('div');
        playerRow.innerHTML = `
            <span>${player}</span>
            <select>
                <option value="teamA">Team A</option>
                <option value="teamB">Team B</option>
            </select>
        `;
        playerTeamChoices.appendChild(playerRow);
    });
}

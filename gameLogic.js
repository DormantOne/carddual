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


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const playerName = localStorage.getItem('playerName');
    const playerTeam = localStorage.getItem('team');

    if (!playerName || !playerTeam) {
        alert("Please join a team first.");
        window.location.href = 'index.html'; // Redirect to team selection page
        return;
    }

    document.getElementById('lockInCards').addEventListener('click', () => {
        const card1 = document.getElementById('card1').value;
        const card2 = document.getElementById('card2').value;
        lockInCards(playerName, playerTeam, [card1, card2]);
    });

    startListeningForTeamChoices(playerTeam);
});

function lockInCards(playerName, team, cards) {
    set(ref(database, `game/${team}/${playerName}`), { cards: cards, locked: true })
        .then(() => alert("Your cards have been locked in."))
        .catch((error) => console.error('Error locking in cards:', error));
}

function startListeningForTeamChoices(playerTeam) {
    onValue(ref(database, `game/${playerTeam}`), (snapshot) => {
        const teamChoices = snapshot.val() || {};
        updateTeamChoicesDisplay(playerTeam, teamChoices);
    });
}

function updateTeamChoicesDisplay(teamName, teamChoices) {
    const teamDiv = document.getElementById(`${teamName}Choices`);
    teamDiv.innerHTML = '';

    Object.entries(teamChoices).forEach(([player, {cards, locked}]) => {
        const playerChoices = document.createElement('div');
        playerChoices.textContent = `${player}: ${cards.join(', ')} ${locked ? '(Locked)' : ''}`;
        teamDiv.appendChild(playerChoices);
    });
}

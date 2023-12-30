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
const MAX_PLAYERS_PER_TEAM = 2;

document.addEventListener('DOMContentLoaded', () => {
    checkExistingPlayer();
    displayTeamStatus();
    document.getElementById('joinTeam').addEventListener('click', joinTeam);
    checkIfGameCanStart();
});

function checkExistingPlayer() {
    const playerName = localStorage.getItem('playerName');
    const team = localStorage.getItem('team');
    if (playerName && team) {
        alert(`You are ${playerName}. You have already joined ${team}.`);
        document.getElementById('teamSelection').style.display = 'none';
        displayTeamStatus();
        checkIfGameCanStart();
    }
}

function joinTeam() {
    const playerName = document.getElementById('playerName').value.trim();
    const teamChoice = document.getElementById('teamChoice').value;

    if (!playerName) {
        alert('Please enter your name.');
        return;
    }

    if (localStorage.getItem('playerName')) {
        alert('Only one player per browser is allowed.');
        return;
    }

    const teamRef = ref(database, `teams/${teamChoice}`);
    onValue(teamRef, (snapshot) => {
        const team = snapshot.val() || {};
        if (Object.keys(team).length < MAX_PLAYERS_PER_TEAM) {
            team[playerName] = true;
            set(teamRef, team)
                .then(() => {
                    localStorage.setItem('playerName', playerName);
                    localStorage.setItem('team', teamChoice);
                    alert(`You are ${playerName}. You have successfully joined ${teamChoice}.`);
                    checkExistingPlayer();
                    checkIfGameCanStart();
                }).catch((error) => {
                    console.error('Error joining team:', error);
                });
        } else {
            alert(`${teamChoice} is full. Please choose the other team.`);
        }
    }, {
        onlyOnce: true
    });
}

function displayTeamStatus() {
    ['teamA', 'teamB'].forEach(teamName => {
        const teamRef = ref(database, `teams/${teamName}`);
        onValue(teamRef, (snapshot) => {
            const team = snapshot.val() || {};
            const teamStatusDiv = document.getElementById(`${teamName}Status`);
            teamStatusDiv.textContent = `${teamName}: ${Object.keys(team).join(', ')}`;
        });
    });
}

function checkIfGameCanStart() {
    onValue(ref(database, 'teams'), (snapshot) => {
        const teams = snapshot.val() || {};
        const canStart = Object.values(teams).every(team => Object.keys(team).length >= MAX_PLAYERS_PER_TEAM);

        if (canStart) {
            displayLaunchGameButton();
        }
    });
}

function displayLaunchGameButton() {
    const launchButton = document.createElement('button');
    launchButton.textContent = 'Launch Game';
    launchButton.addEventListener('click', () => {
        window.location.href = 'game.html'; // Redirect to the game page
    });

    const container = document.getElementById('launchGameContainer');
    container.appendChild(launchButton);
}

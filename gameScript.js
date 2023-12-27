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
    startListeningToPlayerChanges();
    fetchAndDisplayTeamAssignments();
    document.getElementById('submitUpdate').addEventListener('click', submitTeamUpdates);
    document.getElementById('finalizeTeams').addEventListener('click', finalizeSelections);
});

function fetchAndDisplayTeamAssignments() {
    onValue(ref(database, 'teamAssignments/'), (snapshot) => {
        const teamAssignments = snapshot.val();
        if (teamAssignments) {
            displayTeamAssignments(teamAssignments);
        }
    }, (error) => {
        console.error("Error fetching team assignments: ", error);
    });
}

function startListeningToPlayerChanges() {
    onValue(ref(database, 'players/'), (snapshot) => {
        const players = snapshot.val();
        if (players) {
            updatePlayerList(players);
        }
    }, (error) => {
        console.error("Error fetching player names: ", error);
    });
}

function updatePlayerList(players) {
    const playerTeamChoices = document.getElementById('playerTeamChoices');
    playerTeamChoices.innerHTML = '';

    for (const key in players) {
        if (players.hasOwnProperty(key)) {
            const playerRow = document.createElement('div');
            playerRow.innerHTML = `
                <span>${players[key].name}</span>
                <select>
                    <option value="teamA">Team A</option>
                    <option value="teamB">Team B</option>
                </select>
            `;
            playerTeamChoices.appendChild(playerRow);
        }
    }
}

function submitTeamUpdates() {
    const playerTeamAssignments = {};
    const playerElements = document.querySelectorAll('#playerTeamChoices div');
    
    playerElements.forEach(el => {
        const playerName = el.querySelector('span').textContent;
        const team = el.querySelector('select').value;
        playerTeamAssignments[playerName] = { team: team, status: 'pre-final' };
    });

    set(ref(database, 'teamAssignments/'), playerTeamAssignments)
        .then(() => console.log("Pre-final team assignments saved to Firebase."))
        .catch((error) => console.error("Error saving pre-final team assignments: ", error));

    document.getElementById('finalizeTeams').disabled = false;
}

function displayTeamAssignments(assignments) {
    const displayDiv = document.getElementById('teamAssignmentsDisplay');
    displayDiv.innerHTML = '';

    Object.entries(assignments).forEach(([player, data]) => {
        const assignment = document.createElement('p');
        assignment.textContent = `${player}: ${data.team} (${data.status})`;
        displayDiv.appendChild(assignment);
    });
}

function finalizeSelections() {
    const currentAssignmentsRef = ref(database, 'teamAssignments/');
    onValue(currentAssignmentsRef, (snapshot) => {
        const currentAssignments = snapshot.val();
        Object.keys(currentAssignments).forEach(key => {
            currentAssignments[key].status = 'final';
        });

        set(currentAssignmentsRef, currentAssignments)
            .then(() => console.log("Final team assignments saved."))
            .catch((error) => console.error("Error finalizing team assignments: ", error));

        // Additional UI changes to indicate finalization
        document.querySelectorAll('#playerTeamChoices select').forEach(select => {
            select.disabled = true;
        });
        document.getElementById('submitUpdate').disabled = true;
        document.getElementById('finalizeTeams').disabled = true;
    }, {
        onlyOnce: true // Fetch data only once
    });
}

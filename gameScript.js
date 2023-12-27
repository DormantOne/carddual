import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration (use the same configuration as your sign-in page)
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
    try {
        let selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers') || '[]');
        displayPlayerTeamChoices(selectedPlayers);
        listenToTeamSelectionChanges();
    } catch (error) {
        console.error("Error during DOMContentLoaded: ", error);
    }
});

function displayPlayerTeamChoices(players) {
    try {
        const playerTeamChoices = document.getElementById('playerTeamChoices');
        playerTeamChoices.innerHTML = '';

        players.forEach(player => {
            let playerRow = document.createElement('div');
            playerRow.innerHTML = `
                <span>${player}</span>
                <select class="teamSelect" data-player="${player}" onchange="updateTeamCount()">
                    <option value="">Select Team</option>
                    <option value="team1">Team 1</option>
                    <option value="team2">Team 2</option>
                </select>
            `;
            playerTeamChoices.appendChild(playerRow);
        });
    } catch (error) {
        console.error("Error displaying player team choices: ", error);
    }
}

function updateTeamCount() {
    try {
        let teamCounts = { team1: 0, team2: 0 };
        document.querySelectorAll('.teamSelect').forEach(select => {
            if (select.value) {
                teamCounts[select.value]++;
            }
        });
        document.getElementById('team1Count').innerText = teamCounts.team1;
        document.getElementById('team2Count').innerText = teamCounts.team2;
    } catch (error) {
        console.error("Error updating team counts: ", error);
    }
}

document.getElementById('finalizeTeamSelection').addEventListener('click', () => {
    try {
        let playerTeams = {};
        let teamCounts = { team1: 0, team2: 0 };

        document.querySelectorAll('.teamSelect').forEach(select => {
            let playerName = select.getAttribute('data-player');
            let team = select.value;
            if (team) {
                playerTeams[playerName] = team;
                teamCounts[team]++;
            }
        });

        if (Object.values(teamCounts).some(count => count === 0)) {
            alert('Each team must have at least one player.');
            return;
        }

        set(ref(database, 'teamSelections/'), playerTeams)
            .then(() => console.log("Teams have been finalized."))
            .catch((error) => console.error("Error finalizing team selection: ", error));
    } catch (error) {
        console.error("Error in finalizeTeamSelection event listener: ", error);
    }
});

function listenToTeamSelectionChanges() {
    try {
        onValue(ref(database, 'teamSelections/'), (snapshot) => {
            const selections = snapshot.val();
            if (selections) {
                updateUIWithTeamSelections(selections);
                updateTeamCount(); // Update team count when Firebase data changes
            }
        }, (error) => {
            console.error("Error listening to team selections: ", error);
        });
    } catch (error) {
        console.error("Error in listenToTeamSelectionChanges function: ", error);
    }
}


function updateUIWithTeamSelections(selections) {
    try {
        document.querySelectorAll('.teamSelect').forEach(select => {
            const playerName = select.getAttribute('data-player');
            if (selections[playerName]) {
                select.value = selections[playerName];
            }
        });
    } catch (error) {
        console.error("Error updating UI with team selections: ", error);
    }
}

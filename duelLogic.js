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
const cardValues = { 'Robot': 4, 'Tiger': 3, 'Mouse': 2, 'Quark': 1 };

document.addEventListener('DOMContentLoaded', () => {
    checkLockStatusAndEnableDuel();
    document.getElementById('duel').addEventListener('click', initiateDuel);
    document.getElementById('rematch').addEventListener('click', startRematch);

    // Set up periodic update (every second)
    setInterval(checkForUpdates, 1000);
});

function checkForUpdates() {
    onValue(ref(database, 'game'), (snapshot) => {
        const gameData = snapshot.val();
        if (gameData) {
            updateUI(gameData);
        }
    }, {
        onlyOnce: true
    });
}

function updateUI(gameData) {
    // Implement the update logic as described
    const allLockedIn = isEveryoneLockedIn(gameData);
    document.getElementById('duel').disabled = !allLockedIn;

    if (gameData.duelCompleted) {
        displayDuelResults(gameData.lastRoundResult, gameData);
        disableCardSelection();
    } else {
        enableCardSelection();
    }

    if (gameData.rematchInitiated) {
        resetUIForNewRound();
    }
}



function isEveryoneLockedIn(gameData) {
    // Check if all players have locked in their cards
    return Object.values(gameData.teamA).every(player => player.locked) &&
           Object.values(gameData.teamB).every(player => player.locked);
}

function resetUIForNewRound() {
    // Reset UI elements for a new round, including clearing round results
    document.getElementById('roundResult').innerHTML = '';
}

function checkLockStatusAndEnableDuel() {
    onValue(ref(database, 'game'), (snapshot) => {
        const gameData = snapshot.val();
        if (isEveryoneLockedIn(gameData)) {
            document.getElementById('duel').disabled = false;
        } else {
            document.getElementById('duel').disabled = true;
        }
    });
}

function initiateDuel() {
    onValue(ref(database, 'game'), (snapshot) => {
        const gameData = snapshot.val();
        if (isEveryoneLockedIn(gameData)) {
            const roundResult = calculateRoundResult(gameData);
            displayRoundResults(roundResult, gameData); // Display round results including all players' cards
            updateScores(roundResult.winner);
            clearCurrentCards(); // Clear the current card selections
            document.getElementById('duel').disabled = true; // Disable duel button
        } else {
            alert('Not everyone has locked in their cards.');
        }
    }, {
        onlyOnce: true
    });
}

function displayRoundResults(roundResult, gameData) {
    // Display winner and all players' cards
    const resultDiv = document.getElementById('roundResult');
    resultDiv.innerHTML = `Winner: ${roundResult.winner}<br>`;

    // Display Team A's player cards
    if (gameData.teamA) {
        resultDiv.innerHTML += '<strong>Team A:</strong><br>';
        Object.entries(gameData.teamA).forEach(([player, data]) => {
            resultDiv.innerHTML += `${player}: ${data.cards.join(', ')}<br>`;
        });
    }

    // Display Team B's player cards
    if (gameData.teamB) {
        resultDiv.innerHTML += '<strong>Team B:</strong><br>';
        Object.entries(gameData.teamB).forEach(([player, data]) => {
            resultDiv.innerHTML += `${player}: ${data.cards.join(', ')}<br>`;
        });
    }
}

function resetCardSelections() {
    // Fetch the current game data
    onValue(ref(database, 'game'), (snapshot) => {
        const gameData = snapshot.val();
        Object.keys(gameData.teamA).forEach(player => {
            gameData.teamA[player].locked = false;
        });
        Object.keys(gameData.teamB).forEach(player => {
            gameData.teamB[player].locked = false;
        });
        set(ref(database, 'game'), gameData)
            .then(() => console.log("Card selections have been reset for a new round."))
            .catch((error) => console.error("Error resetting card selections: ", error));
    }, {
        onlyOnce: true
    });
}

function clearCurrentCards() {
    // Clear the card selections in Firebase
    const gameRef = ref(database, 'game');
    onValue(gameRef, (snapshot) => {
        const gameData = snapshot.val();
        ['teamA', 'teamB'].forEach(team => {
            Object.keys(gameData[team]).forEach(player => {
                gameData[team][player].cards = []; // Clear cards
            });
        });
        set(gameRef, gameData)
            .then(() => console.log("Card selections cleared."))
            .catch((error) => console.error("Error clearing card selections: ", error));
    }, {
        onlyOnce: true
    });
}




function startRematch() {
    // Reset the game state for a new round
    resetCardSelections();
    document.getElementById('duel').disabled = false; // Re-enable the duel button
    document.getElementById('rematch').disabled = true; // Disable rematch button
    // Clear the round result display
    document.getElementById('roundResult').innerHTML = '';
}

function calculateRoundResult(gameData) {
    let teamAScore = calculateTeamScore(gameData.teamA);
    let teamBScore = calculateTeamScore(gameData.teamB);
    let winner = '';

    if (teamAScore === teamBScore) {
        winner = 'Draw';
    } else {
        winner = teamAScore > teamBScore ? 'Team A' : 'Team B';
    }

    return { winner, teamAScore, teamBScore };
}

function calculateTeamScore(teamData) {
    // Calculate the team score based on card values
    let score = 0;
    for (let player in teamData) {
        if (teamData.hasOwnProperty(player)) {
            teamData[player].cards.forEach(card => {
                score += cardValues[card];
            });
        }
    }
    return score;
}

function updateScores(winner) {
    // Update scores in Firebase or locally
    // This function needs to be implemented based on your scoring system
}


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
    document.getElementById('lockInCards').addEventListener('click', lockInCards);
    document.getElementById('duel').addEventListener('click', initiateDuel); // Add event li
    document.getElementById('rematch').addEventListener('click', startRematch);

    displayPlayerInfo();
    listenForReset();
    listenForGameUpdates();
    // Disable the duel button initially
    document.getElementById('duel').disabled = true;

});

const cardValues = { 'Robot': 4, 'Tiger': 3, 'Mouse': 2, 'Quark': 1 };

function initiateDuel() {
    onValue(ref(database, 'game'), (snapshot) => {
        const gameData = snapshot.val();
        if (isEveryoneLockedIn(gameData)) {
            const roundResult = calculateRoundResult(gameData);

            // Update Firebase with duel results and game status
            const updatedGameState = {
                ...gameData,
                lastRoundResult: roundResult,
                status: {
                    duelCompleted: true,
                    rematchInitiated: false
                }
            };

            set(ref(database, 'game'), updatedGameState)
                .then(() => {
                    console.log("Duel results and game status updated in Firebase.");
                    displayDuelResults(roundResult); // Display duel results on the UI
                    // Update button states after duel
                    document.getElementById('duel').disabled = true; // Disable duel button
                    document.getElementById('rematch').disabled = false; // Enable rematch button
                })
                .catch((error) => console.error("Error updating duel results and game status: ", error));
        } else {
            alert('Not everyone has locked in their cards.');
        }
    }, { onlyOnce: true });
}


function calculateRoundResult(gameData) {
    let teamAScore = 0, teamBScore = 0;
    const cardCounts = { teamA: {}, teamB: {} };

    // Function to count cards for each team
    const countCards = (teamData, team) => {
        for (const playerName in teamData) {
            teamData[playerName].cards.forEach(card => {
                cardCounts[team][card] = (cardCounts[team][card] || 0) + 1;
            });
        }
    };

    // Count cards for each team
    countCards(gameData.teamA || {}, 'teamA');
    countCards(gameData.teamB || {}, 'teamB');

    // Apply Quark effect on Robot cards
    if (cardCounts.teamA['Quark']) {
        teamBScore -= cardCounts.teamB['Robot'] * 3;
    }
    if (cardCounts.teamB['Quark']) {
        teamAScore -= cardCounts.teamA['Robot'] * 3;
    }

    // Function to calculate score based on card values and special rules
    const calculateScore = (team, opposingTeam) => {
        let score = 0;
        for (const card in cardValues) {
            const count = cardCounts[team][card] || 0;
            const opposingCount = cardCounts[opposingTeam][card] || 0;

            if (count > 0) {
                if (opposingCount === 0 || count < opposingCount) {
                    score += cardValues[card] * count;
                }
            }
        }
        return score;
    };

    // Calculate scores for each team
    teamAScore += calculateScore('teamA', 'teamB');
    teamBScore += calculateScore('teamB', 'teamA');

    let winner = '';
    if (teamAScore > teamBScore) {
        winner = 'Team A';
    } else if (teamAScore < teamBScore) {
        winner = 'Team B';
    } else {
        winner = 'Draw';
    }

    return {
        winner,
        teamAScore,
        teamBScore
    };
}

function displayDuelResults(roundResult) {
    const resultDiv = document.getElementById('roundResult');
    resultDiv.innerHTML = `Winner: ${roundResult.winner}<br>Team A Score: ${roundResult.teamAScore}, Team B Score: ${roundResult.teamBScore}`;
}

function lockInCards() {
    const playerName = localStorage.getItem('playerName');
    const playerTeam = localStorage.getItem('team');
    const card1 = document.getElementById('card1').value;
    const card2 = document.getElementById('card2').value;

    // Update Firebase with selected cards
    const playerRef = ref(database, `game/${playerTeam}/${playerName}`);
    set(playerRef, {
        cards: [card1, card2],
        locked: true
    });
}



function listenForGameUpdates() {
    const gameRef = ref(database, 'game');
    onValue(gameRef, (snapshot) => {
        const gameData = snapshot.val();
        if (gameData) {
            updateTeamChoicesUI(gameData);
            checkAndToggleDuelButton(gameData);
            // Update buttons based on game status
            updateGameButtons(gameData.status);
            // Check for duel results and display them
            if (gameData.lastRoundResult) {
                displayDuelResults(gameData.lastRoundResult);
            }
        }
    });
}


// Insert this
//function updateGameButtons(status) {
//    const duelButton = document.getElementById('duel');
//    const rematchButton = document.getElementById('rematch');

    // Update button states based on the current game status in Firebase
//    if (status) {
//        duelButton.disabled = status.duelCompleted; // Disable duel button if duel is completed
//        rematchButton.disabled = !status.rematchInitiated; // Enable rematch button if rematch is initiated
//    }
// }

//function updateGameButtons(status) {
//    const duelButton = document.getElementById('duel');
//    const rematchButton = document.getElementById('rematch');

    // Disable duel button if duel is completed
//    if (status && status.duelCompleted) {
//        duelButton.disabled = true;
 //   }
//
    // Enable rematch button once the duel is completed
  //  if (status && status.duelCompleted) {
 //       rematchButton.disabled = false;
//    }

   // Enable duel button if rematch is initiated and disable it otherwise
 //   duelButton.disabled = !(status && status.rematchInitiated);

        // Enable rematch button only if duel is completed and all players have locked in again
//    const allLockedIn = isEveryoneLockedIn(gameData);
 //   rematchButton.disabled = !(status && status.duelCompleted && allLockedIn);
// }

//function updateGameButtons(gameData) {
//    const duelButton = document.getElementById('duel');
 //   const rematchButton = document.getElementById('rematch');
//    const status = gameData.status || {};

    // Enable duel button if all players have locked in and the duel has not been completed yet
//    const allLockedIn = isEveryoneLockedIn(gameData);
 //   duelButton.disabled = !allLockedIn || status.duelCompleted;

    // Enable rematch button only if the duel has been completed
  //  rematchButton.disabled = !status.duelCompleted;
//}

function updateGameButtons(gameData) {
    const duelButton = document.getElementById('duel');
    const rematchButton = document.getElementById('rematch');
    const status = gameData.status || {};

    // Enable duel button if all players have locked in and the duel has not been completed yet
    const allLockedIn = isEveryoneLockedIn(gameData);
    duelButton.disabled = !allLockedIn || status.duelCompleted;

    // Enable rematch button only if the duel has been completed and rematch is not initiated
    // Disable it once rematch is initiated and waiting for players to lock in again
    rematchButton.disabled = status.duelCompleted || status.rematchInitiated;
}

function checkAndToggleDuelButton(gameData) {
    const allLockedIn = isEveryoneLockedIn(gameData);
    document.getElementById('duel').disabled = !allLockedIn;
}

function isEveryoneLockedIn(gameData) {
    const teamAPlayers = Object.values(gameData.teamA || {});
    const teamBPlayers = Object.values(gameData.teamB || {});
    return teamAPlayers.length === 2 && teamBPlayers.length === 2 &&
           teamAPlayers.every(player => player.locked) &&
           teamBPlayers.every(player => player.locked);
}


function updateTeamChoicesUI(gameData) {
    const playerTeam = localStorage.getItem('team');
    const opposingTeam = playerTeam === 'teamA' ? 'teamB' : 'teamA';

    displayChoices('teamAChoices', gameData.teamA, playerTeam === 'teamA');
    displayChoices('teamBChoices', gameData.teamB, playerTeam === 'teamB');

    // Function to display choices or lock-in status
    function displayChoices(elementId, teamData, isOwnTeam) {
        const container = document.getElementById(elementId);
        container.innerHTML = ''; // Clear previous content

        for (const playerName in teamData) {
            const playerData = teamData[playerName];
            const displayText = isOwnTeam ? playerData.cards.join(', ') : (playerData.locked ? 'Locked' : 'Not Locked');
            container.innerHTML += `<div>${playerName}: ${displayText}</div>`;
        }
    }
}

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
    set(ref(database, 'game'), {}) // specify the 'game' node to clear
        .then(() => {
            console.log("Firebase game data cleared.");
            // Clear local storage and redirect to index.html
            localStorage.clear();
            window.location.href = 'index.html';
        })
        .catch((error) => console.error("Error clearing Firebase game data: ", error));
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

function startRematch() {
    onValue(ref(database, 'game'), (snapshot) => {
        const gameData = snapshot.val();
        if (gameData) {
            // Reset card selections and locked status for each player
            for (const team in gameData) {
                if (team === 'teamA' || team === 'teamB') {
                    for (const player in gameData[team]) {
                        gameData[team][player].cards = [];
                        gameData[team][player].locked = false;
                    }
                }
            }

            // Update game status
            const updatedGameState = {
                ...gameData,
                status: {
                    duelCompleted: false,
                    rematchInitiated: true
                }
            };

            set(ref(database, 'game'), updatedGameState)
                .then(() => console.log("Game reset for rematch."))
                .catch((error) => console.error("Error resetting game for rematch: ", error));
        }
    }, { onlyOnce: true });
}


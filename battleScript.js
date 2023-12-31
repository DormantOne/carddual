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

            // Update Firebase with duel results
            set(ref(database, 'game/lastRoundResult'), roundResult)
                .then(() => {
                    console.log("Duel results updated in Firebase.");
                    displayDuelResults(roundResult);
                    document.getElementById('duel').disabled = true; // Disable duel button after duel
                    document.getElementById('rematch').disabled = false; // Enable rematch button
                })
                .catch((error) => console.error("Error updating duel results: ", error));
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
        }
    });
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

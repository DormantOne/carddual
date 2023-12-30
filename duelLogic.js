import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
    document.getElementById('duel').addEventListener('click', initiateDuel);
});

function initiateDuel() {
    onValue(ref(database, 'game'), (snapshot) => {
        const gameData = snapshot.val();
        if (isEveryoneLockedIn(gameData)) {
            const roundResult = calculateRoundResult(gameData);
            alert(`Winner: ${roundResult.winner}`);
            updateScores(roundResult.winner);
            resetCardSelections();
        } else {
            alert('Not everyone has locked in their cards.');
        }
    }, {
        onlyOnce: true
    });
}

function isEveryoneLockedIn(gameData) {
    return Object.values(gameData.teamA).every(player => player.locked) &&
           Object.values(gameData.teamB).every(player => player.locked);
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

function resetCardSelections() {
    // Reset the card selections in Firebase to allow for a new round
    // This function needs to be implemented based on your game's logic
}

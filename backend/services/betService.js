// File: /services/betService.js

const fetch = require('node-fetch');

const fetchMatchResults = async () => {
    try {
        const response = await fetch('https://api.football-data.org/v2/competitions/PL/matches', {
            headers: { 'X-Auth-Token': 'YOUR_API_KEY' }
        });
        const data = await response.json();
        return data.matches; // Return match results
    } catch (error) {
        console.error('Error fetching match results:', error);
        return [];
    }
};

const calculateWinnings = (bet, matchResult) => {
    const outcome = matchResult.score.winner;
    
    if (outcome === 'HOME_TEAM' && bet.betType === 'homeWin') return true;
    if (outcome === 'AWAY_TEAM' && bet.betType === 'awayWin') return true;
    if (outcome === 'DRAW' && bet.betType === 'draw') return true;

    return false;
};

module.exports = { fetchMatchResults, calculateWinnings };

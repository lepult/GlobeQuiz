import { createSlice } from "@reduxjs/toolkit";
import { locationsList } from "../../constants/locations";

const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }
  
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

const getScoreFromDistanceInKm = (distance) => {
    if (distance < 5) return 5000;
    if (distance > 15000) return 0;
    return 5000 - Math.round(distance / 3)
}

const initialState = {
    guessedLocation: null,
    locations: [],

    score: 0,
    roundScore: 0,
    roundDistance: 0,

    difficulty: 'easy',

    gameFinished: false,
    roundFinished: false,

    roundNumber: -1,
    roundLocation: null,

    locationsPool: locationsList,
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setDifficulty: (state, { payload }) => {
            state.difficulty = payload;
        },
        startGame: (state) => {
            state.roundNumber = 0;
        },
        makeGuess: (state, { payload }) => {
            const distance = getDistanceFromLatLonInKm(
                payload[1],
                payload[0],
                state.roundLocation[1],
                state.roundLocation[0],
            );

            const score = getScoreFromDistanceInKm(distance);
            
            state.score += score;
            state.roundScore = score;
            state.roundDistance = distance;
            
            state.guessedLocation = payload;
            state.locations = [
                ...state.locations,
                {
                    guessedLocation: payload,
                    realLocation: state.roundLocation,
                },
            ];

            state.roundFinished = true;
        },
        startNextRound: (state) => {
            if (state.roundNumber === 4) {
                state.gameFinished = true;
            } else {
                state.roundNumber += 1;
                state.roundFinished = false;

                const locationIndex = Math.floor(Math.random() * state.locationsPool.length);
                state.roundLocation = state.locationsPool[locationIndex];
                state.locationsPool.splice(locationIndex, 1);
            }
        },
        goToMainMenu: () => initialState,
    },
})

// Action creators are generated for each case reducer function
export const {
    setDifficulty,
    startGame,
    makeGuess,
    startNextRound,
    goToMainMenu
} = gameSlice.actions

export default gameSlice.reducer;
import logo from './logo.svg';
import './App.css';
import Map from './map/round/Map';
import MiniMap from './map/round/Minimap';
import { useState } from 'react';
import { Button } from '@mui/material';
import { useMemo } from 'react';
import { locationsList } from './constants/locations';
import StartGame from './map/start-game/StartGame';
import RoundFinished from './map/round-finished/RoundFinished';
import Score from './map/Score';
import GameFinished from './map/game-finished/GameFinished';

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
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

const getScoreFromDistanceInKm = (distance) => {
  if (distance < 5) return 5000;
  if (distance > 15000) return 0;
  return 5000 - Math.round(distance / 3)
}

const App = () => {
  console.log(window.innerHeight);
  console.log(window.innerHeight / 0.8 - 20);

  const [guessedLocation, setGuessedLocation] = useState();
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(null);
  const [roundDistance, setRoundDistance] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);

  const [locations, setLocations] = useState([]);

  const [difficulty, setDifficulty] = useState('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [roundFinished, setRoundFinished] = useState(false);
  const [roundNumber, setRoundNumber] = useState(-1);

  const roundCoordinates = useMemo(() => roundNumber >= 0 && roundNumber < 5 ? ({
    longitude: locationsList[roundNumber][0],
    latitude: locationsList[roundNumber][1],
    height: locationsList[roundNumber][2]
  }) : null, [roundNumber]);

  const handleFinishRound = (guess) => {
    const distance = getDistanceFromLatLonInKm(
      guess[1],
      guess[0],
      locationsList[roundNumber][1],
      locationsList[roundNumber][0],
    );
    const score = getScoreFromDistanceInKm(distance);
    setRoundDistance(distance);
    setRoundScore(score);
    setScore((param) => param + score);

    setLocations(param => [
      ...param,
      { guessedLocation: guess, realLocation: locationsList[roundNumber] },
    ])

    setGuessedLocation(guess);
    setRoundFinished(true);
  }

  const handleNextRound = () => {
    if (roundNumber === 4) {
      setRoundNumber(-1);
      setRoundFinished(false);
      setRoundScore(null);
      setRoundDistance(null);
      setGameFinished(true);
    } else {
      setRoundNumber(param => param + 1);
      setRoundFinished(false);
      setRoundScore(null);
      setRoundDistance(null);
    }
  }

  const handleStartGame = () => {
    setRoundNumber(3);
    setRoundFinished(false);
    setScore(0);
    setRoundScore(null);
    setRoundDistance(null);
    setLocations([]);
  }

  if (roundNumber === -1) return (
    <StartGame
      onStartGame={handleStartGame}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
    />
  );

  if (gameFinished) {
    return (
      <GameFinished/>
    )
  }

  if (roundNumber === 4 && roundFinished) return (
    <GameFinished
      onGoToMainMenu={() => setRoundNumber(-1)}
      locations={locations}
      score={score}
    />
  );
  
  if (roundFinished) return (
    <RoundFinished
      onStartNextRound={handleNextRound}
      roundNumber={roundNumber}
      guessedLocation={guessedLocation}
      realLocation={locationsList[roundNumber]}
      roundScore={roundScore}
      score={score}
      distance={roundDistance}
    />
  )

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
      }}
    >
      <Score
        score={score}
        roundNumber={roundNumber}
      />
      <Map
        initialCoordinates={roundCoordinates}
      />
      <MiniMap
        onFinishRound={handleFinishRound}
      />
    </div>
  )
}

export default App;

import './App.css';
import StartGame from './map/start-game/StartGame';
import RoundFinished from './map/round-finished/RoundFinished';
import GameFinished from './map/game-finished/GameFinished';
import { useSelector } from 'react-redux';
import { selectGameFinished, selectRoundFinished, selectRoundNumber } from './redux-modules/game/gameSelector';
import Round from './map/round/Round';

const App = () => {
  const gameFinished = useSelector(selectGameFinished);
  const roundFinished = useSelector(selectRoundFinished);
  const roundNumber = useSelector(selectRoundNumber);

  if (gameFinished) return <GameFinished/>;

  if (roundNumber === -1) return <StartGame/>;
  
  if (roundFinished) return <RoundFinished/>;

  return <Round/>;
}

export default App;

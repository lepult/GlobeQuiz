import './App.css';
import StartGame from './map/start-game/StartGame';
import RoundFinished from './map/round-finished/RoundFinished';
import GameFinished from './map/game-finished/GameFinished';
import { useSelector } from 'react-redux';
import { selectGameFinished, selectRoundFinished, selectRoundNumber } from './redux-modules/game/gameSelector';
import Round from './map/round/Round';
import CoverageMap from './map/coverage-map/CoverageMap';

const App = () => {
  const gameFinished = useSelector(selectGameFinished);
  const roundFinished = useSelector(selectRoundFinished);
  const roundNumber = useSelector(selectRoundNumber);

  // return <CoverageMap/>

  if (gameFinished) return <GameFinished/>;

  if (roundNumber === -1) return <StartGame/>;
  
  if (roundFinished) return <RoundFinished/>;

  return <Round/>;
}

export default App;

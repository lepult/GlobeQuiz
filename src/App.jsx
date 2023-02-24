import logo from './logo.svg';
import './App.css';
import Map from './map/round/Map';
import MiniMap from './map/round/Minimap';
import StartGame from './map/start-game/StartGame';
import RoundFinished from './map/round-finished/RoundFinished';
import Score from './map/Score';
import GameFinished from './map/game-finished/GameFinished';
import { useSelector } from 'react-redux';
import { selectGameFinished, selectRoundFinished, selectRoundNumber } from './redux-modules/game/gameSelector';




const App = () => {
  const gameFinished = useSelector(selectGameFinished);
  const roundFinished = useSelector(selectRoundFinished);
  const roundNumber = useSelector(selectRoundNumber);

  if (gameFinished) return <GameFinished/>;

  if (roundNumber === -1) return <StartGame/>;
  
  if (roundFinished) return <RoundFinished/>;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
      }}
    >
      <Score/>
      <Map/>
      <MiniMap/>
    </div>
  )
}

export default App;

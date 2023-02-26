import React from 'react';
import { useSelector } from 'react-redux';
import { selectRoundNumber, selectScore } from '../redux-modules/game/gameSelector';

const Score = () => {
    const score = useSelector(selectScore);
    const roundNumber = useSelector(selectRoundNumber);

    return (
        <div className='game-info'>
            <div style={{
                borderRight: 'solid 3px darkgray',
                paddingRight: '10px'
            }}>
                {score} Punkte
            </div>
            <div style={{
                paddingLeft: '10px'
            }}>
                Runde {roundNumber + 1}/5
            </div>
        </div>
    )
}

export default Score;
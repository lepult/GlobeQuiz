import React from 'react';

const Score = ({ score, roundNumber }) => {

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
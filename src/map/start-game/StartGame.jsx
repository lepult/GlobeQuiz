import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDifficulty } from "../../redux-modules/game/gameSelector";
import { setDifficulty, startGame } from "../../redux-modules/game/gameSlice";

const radioColor ={
    color: 'white',
}

const StartGame = () => {
    const dispatch = useDispatch();
    const difficulty = useSelector(selectDifficulty);

    const handleChange = (_, newDifficulty) => dispatch(setDifficulty(newDifficulty));

    return (
        <div
            className="game-menu"
        >
            <div className="game-menu__options">
                <h1 style={{ margin: '0 0 10px' }}>
                    GlobeQuizz
                </h1>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={handleChange}
                    value={difficulty}
                >
                    <FormControlLabel value="easy" control={<Radio sx={radioColor}/>} label="Einfach" />
                    <FormControlLabel value="medium" control={<Radio  sx={radioColor}/>} label="Mittel" />
                    <FormControlLabel value="difficult" control={<Radio  sx={radioColor}/>} label="Schwer" />
                </RadioGroup>
                <Button
                    variant="contained" 
                    onClick={() => dispatch(startGame())}
                    style={{
                        marginTop: '20px'
                    }}
                >
                    Starten
                </Button>
            </div>
        </div>
    )
}

export default StartGame;
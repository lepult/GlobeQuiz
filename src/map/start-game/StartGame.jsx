import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDifficulty } from "../../redux-modules/game/gameSelector";
import { setDifficulty, startNextRound } from "../../redux-modules/game/gameSlice";

const radioColor ={
    color: 'white',
}

const StartGame = () => {
    const dispatch = useDispatch();

    const difficulty = useSelector(selectDifficulty);

    const handleChange = useCallback((_, newDifficulty) => dispatch(setDifficulty(newDifficulty)),
        [dispatch]);

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
                    <FormControlLabel value="expert" control={<Radio  sx={radioColor}/>} label="Experte" />
                </RadioGroup>
                <Button
                    variant="contained" 
                    onClick={() => dispatch(startNextRound())}
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
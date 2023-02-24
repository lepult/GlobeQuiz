import { Button, LinearProgress } from "@mui/material";
import React, { useMemo } from "react";
import { IconLayer, LineLayer} from '@deck.gl/layers';
import { ICON_MAPPING, getMarkerColor } from '../../constants/map';
import { TileLayer } from "deck.gl";
import DeckGL from '@deck.gl/react';
import { renderSubLayers } from "../round/Minimap";
import Score from "../Score";
import { useDispatch, useSelector } from "react-redux";
import { startNextRound } from "../../redux-modules/game/gameSlice";
import { selectGuessedLocation, selectRoundDistance, selectRoundNumber, selectRoundScore, selectScore } from "../../redux-modules/game/gameSelector";
import { locationsList } from "../../constants/locations";

const INITIAL_VIEW_STATE = {
    zoom: 4,
    maxPitch: 0,
    bearing: 0,
    maxZoom: 14,
    minZoom: 1,
};

const MINIMAP_CONTROLLER = {
    scrollZoom: true,
    dragPan: true,
    dragRotate: false,
    doubleClickZoom: false,
    touchZoom: false,
    touchRotate: false,
    keyboard: false,
}

const RoundFinished = () => {
    const dispatch = useDispatch();

    const score = useSelector(selectScore);
    const roundScore = useSelector(selectRoundScore);
    const distance = useSelector(selectRoundDistance);
    const roundNumber = useSelector(selectRoundNumber);
    const guessedLocation = useSelector(selectGuessedLocation);
    const realLocation = locationsList[roundNumber];
    
    const iconData = useMemo(() => [{
        marker: 'guessMarker',
        coordinates: guessedLocation,
    }, {
        marker: 'locationMarker',
        coordinates: realLocation,
    }], [guessedLocation, realLocation])

    const iconLayer = new IconLayer({
        id: 'minimap-icon-layer',
        data: iconData,
        getPosition: o => o.coordinates,
        getIcon: o => o.marker,
        getColor: o => getMarkerColor(o.marker),
        getSize: 5,
        sizeScale: 7,
        pickable: false,
        iconAtlas: require("../../assets/Markers.png"),
        iconMapping: ICON_MAPPING,
    });
 
    const tileLayer = new TileLayer({
        data: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        renderSubLayers,
        pickable: false,
        maxRequests: 20,
        tileSize: 256,
    });

    const lineLayer = new LineLayer({
        data: [{
            from: guessedLocation,
            to: realLocation,
        }],
        getSourcePosition: d => d.from,
        getTargetPosition: d => d.to,
        getColor: [21, 101, 192],
        pickable: false,
        getWidth: 2,
    });
    
    return (
        <div
            className="round-finished"
        >
            <Score
            score={score}
            roundNumber={roundNumber}
            />
            <div className="round-finished__map">
                <DeckGL
                    initialViewState={{
                        ...INITIAL_VIEW_STATE,
                        longitude: realLocation[0],
                        latitude: realLocation[1],
                    }}
                    controller={MINIMAP_CONTROLLER}
                    layers={[tileLayer, iconLayer, lineLayer]}
                    // Prevents wrapping of map when going out of bounds
                    onViewStateChange={({viewState, oldViewState}) => {
                        if (Math.abs(viewState.longitude - oldViewState.longitude) > 180) {
                        viewState.longitude = Math.sign(oldViewState.longitude) * 180;
                        }
                        return viewState;
                    }}
                />
            </div>
            <div className="round-finished__info">
                <h1 style={{ margin: '20 0 30px' }}>
                    Runde {roundNumber + 1}
                </h1>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '80%'
                }}>
                    <LinearProgress
                        variant="determinate"
                        value={roundScore / 5000 * 100}
                        style={{ width: '80%' }}
                    />
                    <div style={{ marginTop: '8px' }}>
                        {roundScore} Punkte ({Math.round(distance * 10) / 10} Kilometer)
                    </div>
                    <Button
                        variant="contained" 
                        onClick={() => dispatch(startNextRound())}
                        style={{
                            marginTop: '30px'
                        }}
                    >
                        {roundNumber === 4 ? 'Endergebnis' : 'Nächste Runde'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default RoundFinished;
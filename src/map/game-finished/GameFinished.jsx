import { Button, FormControlLabel, LinearProgress, Radio, RadioGroup } from "@mui/material";
import React, { useMemo } from "react";
import {IconLayer, LineLayer} from '@deck.gl/layers';
import { ICON_MAPPING, getMarkerColor } from '../../constants/map';
import { TileLayer } from "deck.gl";
import DeckGL from '@deck.gl/react';
import { renderSubLayers } from "../round/Minimap";
import { restrictViewBounds } from "../../utils/mapHelper";
import { useDispatch, useSelector } from "react-redux";
import { goToMainMenu } from "../../redux-modules/game/gameSlice";
import { selectLocations, selectScore } from "../../redux-modules/game/gameSelector";

const INITIAL_VIEW_STATE = {
    longitude: 0,
    latitude: 25,
    zoom: 1,
    maxPitch: 0,
    bearing: 0,
    maxZoom: 14,
    minZoom: 1,
};

const MINIMAP_CONTROLLER = {
    scrollZoom: true,
    dragPan: true,
    dragRotate: false,
    doubleClickZoom: true,
    touchZoom: true,
    touchRotate: false,
    keyboard: false,
}

const GameFinished = () => {
    const dispatch = useDispatch();

    const score = useSelector(selectScore);
    const locations = useSelector(selectLocations);

    const iconData = useMemo(() => [
        ...locations.map((l) => ({
            marker: 'guessMarker',
            coordinates: l.guessedLocation,
        })),
        ...locations.map((l) => ({
            marker: 'locationMarker',
            coordinates: l.realLocation,
        }))
    ], [locations]);

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
        pickable: true,
        maxRequests: 20,
        tileSize: 256,
    });

    const lineLayer = new LineLayer({
        data: locations,
        getSourcePosition: d => d.guessedLocation,
        getTargetPosition: d => d.realLocation,
        getColor: [0, 0, 0],
        pickable: true,
        getWidth: 2,
    });
    
    return (
        <div
            className="round-finished"
        >
            <div className="round-finished__map">
                <DeckGL
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={MINIMAP_CONTROLLER}
                    layers={[tileLayer, lineLayer, iconLayer]}
                    onViewStateChange={restrictViewBounds}

                />
            </div>
            <div className="round-finished__info">
                <h1 style={{ margin: '20 0 30px' }}>
                    Spiel beendet
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
                        value={score / 25000 * 100}
                        style={{ width: '80%' }}
                    />
                    <div style={{ marginTop: '8px' }}>
                        {score} Punkte
                    </div>
                    <Button
                        variant="contained" 
                        onClick={() => dispatch(goToMainMenu())}
                        style={{
                            marginTop: '30px'
                        }}
                    >
                        Zum Hauptmenü
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default GameFinished;
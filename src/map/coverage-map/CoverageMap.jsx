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
import { selectGuessedLocation, selectRoundDistance, selectRoundLocation, selectRoundNumber, selectRoundScore, selectScore } from "../../redux-modules/game/gameSelector";
import { locationsList } from "../../constants/locations";

const INITIAL_VIEW_STATE = {
    longitude: 0,
    latitude: 25,
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

const CoverageMap = () => {    
    const iconData = useMemo(() => locationsList.map((l) => ({
        marker: 'locationMarker',
        coordinates: [l[0], l[1]],
    })), []);

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

    return (
        <div>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={MINIMAP_CONTROLLER}
                layers={[tileLayer, iconLayer]}
                // Prevents wrapping of map when going out of bounds
                onViewStateChange={({viewState, oldViewState}) => {
                    if (Math.abs(viewState.longitude - oldViewState.longitude) > 180) {
                    viewState.longitude = Math.sign(oldViewState.longitude) * 180;
                    }
                    return viewState;
                }}
            />
        </div>
    )
}

export default CoverageMap;
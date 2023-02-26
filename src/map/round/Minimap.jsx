import { TileLayer } from "deck.gl";
import DeckGL from '@deck.gl/react';
import React from "react";
import {BitmapLayer, PathLayer, IconLayer} from '@deck.gl/layers';
import { MINIMAP_WIDTH, MINIMAP_HEIGHT, ICON_MAPPING, getMarkerColor } from '../../constants/map';
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { restrictViewBounds } from "../../utils/mapHelper";
import { useDispatch } from "react-redux";
import { makeGuess } from "../../redux-modules/game/gameSlice";

const INITIAL_VIEW_STATE = {
    latitude: 30,
    longitude: 0,
    zoom: 0,
    maxPitch: 0,
    bearing: 0,
    maxZoom: 14,
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

export const renderSubLayers = (props) => {
  const {
    bbox: {west, south, east, north}
  } = props.tile;

  return [
    new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north]
    }),
    true &&
      new PathLayer({
        id: `${props.id}-border`,
        visible: props.visible,
        data: [
          [
            [west, north],
            [west, south],
            [east, south],
            [east, north],
            [west, north]
          ]
        ],
        getPath: d => d,
        getColor: [255, 0, 0],
        widthMinPixels: 4
      })
  ];
}

const MiniMap = () => {
  const dispatch = useDispatch(); 

  const [guessedLocation, setGuessedLocation] = useState(null);
 
  const iconData = useMemo(() => guessedLocation
    ? [guessedLocation]
    : [], [guessedLocation]);

  const iconLayer = new IconLayer({
    id: 'minimap-icon-layer',
    data: iconData,
    getPosition: coordinates => coordinates,
    getIcon: () => 'guessMarker',
    getColor: getMarkerColor('guessMarker'),
    getSize: 5,
    sizeScale: 7,
    pickable: false,
    iconAtlas: require("../../assets/Markers.png"),
    iconMapping: ICON_MAPPING,
  });

  const tileLayer = new TileLayer({
    onClick: (data) => setGuessedLocation(data.coordinate),
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

  return (
    <div
      className='bottom-right-wrapper'
      style={{
        marginLeft: `calc(100% - 20px - ${MINIMAP_WIDTH}px)`,
        marginTop: `calc(${window.innerHeight}px - 20px - 36.5px - ${MINIMAP_HEIGHT}px)`,
        width: `${MINIMAP_WIDTH}px`,
        height: `${MINIMAP_HEIGHT + 36.5}px`,
      }}
    >
      <div
        className="minimap-wrapper"
        style={{ height: `${MINIMAP_HEIGHT}px` }}
      >
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={MINIMAP_CONTROLLER}
          layers={[tileLayer, iconLayer]}
          onViewStateChange={restrictViewBounds}
        />
      </div>
      <Button
        variant="contained"
        disabled={!guessedLocation}
        disableElevation
        onClick={() => dispatch(makeGuess(guessedLocation))}
        style={{
          width: '100%',
          borderRadius: '0 0 4px 4px',
        }}
      >
        Tipp Abgeben
      </Button>
    </div>
  );
};

export default MiniMap;
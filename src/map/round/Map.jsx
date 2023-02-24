import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';

import {TerrainLayer} from '@deck.gl/geo-layers';
import {IconLayer} from '@deck.gl/layers';
import { getMarkerColor, ICON_MAPPING } from '../../constants/map';
import { useSelector } from 'react-redux';
import { selectDifficulty, selectRoundLocation, selectRoundNumber } from '../../redux-modules/game/gameSelector';
import { useMemo } from 'react';

const INITIAL_VIEW_STATE = {
  zoom: 11.5,
  bearing: 140,
  pitch: 65,
  maxPitch: 65
};

const MAP_CONTROLLER_EASY = {
  scrollZoom: true,
  dragPan: true,
  dragRotate: true,
  doubleClickZoom: false,
  touchZoom: false,
  touchRotate: false,
  keyboard: false,
};

const MAP_CONTROLLER_MEDIUM = {
  ...MAP_CONTROLLER_EASY,
  dragPan: false,
}

const MAP_CONTROLLER_DIFFICULT = {
  ...MAP_CONTROLLER_MEDIUM,
  scrollZoom: false,
}

const MAP_CONTROLLER_EXPERT = {
  ...MAP_CONTROLLER_DIFFICULT,
  dragRotate: false,
}

const TERRAIN_IMAGE = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;
const SURFACE_IMAGE = `https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=AAPK9dfa6f1a0763456085fd0acb3071609cvpkOU98nmTK9fCHX8pTppMkOBZ5cczlN5i1NH1QOrH3xhW0hvpW9L0_WZjZ88IX1`;

const ELEVATION_DECODER = {
  rScaler: 256,
  gScaler: 1,
  bScaler: 1 / 256,
  offset: -32768
};

const Map = () => {
  const roundNumber = useSelector(selectRoundNumber);
  const difficulty = useSelector(selectDifficulty);
  const roundLocation = useSelector(selectRoundLocation);
  
  const viewController = useMemo(() => {
    switch (difficulty) {
      case 'expert': return MAP_CONTROLLER_EXPERT;
      case 'difficult': return MAP_CONTROLLER_DIFFICULT;
      case 'medium': return MAP_CONTROLLER_MEDIUM;
      default: return MAP_CONTROLLER_EASY;
    }
  }, [difficulty])

  const [initialCoordinates] = useState(() => roundNumber >= 0 && roundNumber < 5
    ? ({
      longitude: roundLocation[0],
      latitude: roundLocation[1],
      height: roundLocation[2]
    }) : null);

  const [iconData] = useState([[
    initialCoordinates.longitude,
    initialCoordinates.latitude,
    initialCoordinates.height,
  ]]);

  const terrainLayer = new TerrainLayer({
    id: 'main-map-terrain',
    minZoom: 0,
    maxZoom: 23,
    strategy: 'no-overlap',
    elevationDecoder: ELEVATION_DECODER,
    elevationData: TERRAIN_IMAGE,
    texture: SURFACE_IMAGE,
    wireframe: false,
    color: [255, 255, 255]
  });

  const iconLayer = new IconLayer({
    id: 'main-map-icon-layer',
    data: iconData,
    getPosition: coordinates => coordinates,
    getIcon: () => 'locationMarker',
    getColor: getMarkerColor('locationMarker'),
    getSize: 5,
    sizeScale: 15,
    pickable: false,
    iconAtlas: require("../../assets/Markers.png"),
    iconMapping: ICON_MAPPING,
  });

  return (
    <DeckGL
      initialViewState={{
        ...INITIAL_VIEW_STATE,
        longitude: initialCoordinates.longitude,
        latitude: initialCoordinates.latitude,
      }}
      controller={viewController}
      layers={[terrainLayer, iconLayer]}
    />
  );
};

export default Map;
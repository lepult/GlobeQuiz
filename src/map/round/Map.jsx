import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';

import {TerrainLayer} from '@deck.gl/geo-layers';
import {IconLayer} from '@deck.gl/layers';
import { getMarkerColor, ICON_MAPPING } from '../../constants/map';
import { useSelector } from 'react-redux';
import { selectDifficulty, selectRoundLocation, selectRoundNumber } from '../../redux-modules/game/gameSelector';
import { useMemo } from 'react';
import { useCallback } from 'react';

const MIN_ZOOM = 11;
const MAX_ZOOM = 15

const INITIAL_VIEW_STATE = {
  zoom: 11.5,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  bearing: 0,
  pitch: 60,
  maxPitch: 70,
};

const MAP_CONTROLLER_EASY = {
  scrollZoom: true,
  dragPan: true,
  dragRotate: true,
  doubleClickZoom: true,
  touchZoom: true,
  touchRotate: true,
  keyboard: false,
};

const MAP_CONTROLLER_MEDIUM = {
  ...MAP_CONTROLLER_EASY,
  dragPan: false,
}

const MAP_CONTROLLER_DIFFICULT = {
  ...MAP_CONTROLLER_MEDIUM,
  scrollZoom: false,
  doubleClickZoom: false,
  touchZoom: false,
}

const MAP_CONTROLLER_EXPERT = {
  ...MAP_CONTROLLER_DIFFICULT,
  dragRotate: false,
  touchRotate: false,
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

  const restrictMainMapViewBounds = useCallback(({ viewState }) => {
    const longitude = roundLocation[0];
    const latitude = roundLocation[1];
    const tollerance = 0.15;
    if (viewState.longitude > longitude + tollerance) {
      viewState.longitude = longitude + tollerance;
    } else if (viewState.longitude < longitude - + tollerance) {
      viewState.longitude = longitude - + tollerance;
    }
    if (viewState.latitude > latitude + + tollerance) {
      viewState.latitude = latitude + + tollerance;
    } else if (viewState.latitude < latitude - + tollerance) {
      viewState.latitude = latitude - + tollerance;
    }

    return viewState;
  }, [roundLocation])
  
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
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
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
      onViewStateChange={restrictMainMapViewBounds}
    />
  );
};

export default Map;
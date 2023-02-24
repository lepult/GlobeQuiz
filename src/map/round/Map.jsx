import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';

import {TerrainLayer} from '@deck.gl/geo-layers';
import {IconLayer} from '@deck.gl/layers';
import { getMarkerColor, ICON_MAPPING } from '../../constants/map';
import { useSelector } from 'react-redux';
import { selectRoundNumber } from '../../redux-modules/game/gameSelector';
import { locationsList } from '../../constants/locations';

const INITIAL_VIEW_STATE = {
  longitude: -122.18,
  latitude: 46.199444,
  zoom: 11.5,
  bearing: 140,
  pitch: 60,
  maxPitch: 89
};

const MAP_CONTROLLER = {
  scrollZoom: true,
  dragPan: true,
  dragRotate: true,
  doubleClickZoom: false,
  touchZoom: false,
  touchRotate: false,
  keyboard: false,
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

  const [initialCoordinates] = useState(() => roundNumber >= 0 && roundNumber < 5
    ? ({
      longitude: locationsList[roundNumber][0],
      latitude: locationsList[roundNumber][1],
      height: locationsList[roundNumber][2]
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
      controller={MAP_CONTROLLER}
      layers={[terrainLayer, iconLayer]}
    />
  );
};

export default Map;
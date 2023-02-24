import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';

import {TerrainLayer} from '@deck.gl/geo-layers';
import {IconLayer} from '@deck.gl/layers';
import { useEffect } from 'react';
import { ICON_MAPPING } from '../../constants/map';

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

const MINIMAP_CONTROLLER = {
  scrollZoom: true,
  dragPan: true,
  dragRotate: false,
  doubleClickZoom: false,
  touchZoom: false,
  touchRotate: false,
  keyboard: false,
}

const data = [{ coordinates: [-122.18, 46.199444, 2549] }];


const TERRAIN_IMAGE = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;
const SURFACE_IMAGE = `https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=AAPK9dfa6f1a0763456085fd0acb3071609cvpkOU98nmTK9fCHX8pTppMkOBZ5cczlN5i1NH1QOrH3xhW0hvpW9L0_WZjZ88IX1`;

// https://docs.mapbox.com/help/troubleshooting/access-elevation-data/#mapbox-terrain-rgb
// Note - the elevation rendered by this example is greatly exagerated!
const ELEVATION_DECODER = {
  rScaler: 256,
  gScaler: 1,
  bScaler: 1 / 256,
  offset: -32768
};



const Map = ({ initialCoordinates }) => {
  const [iconData] = useState([{
    coordinates: [
      initialCoordinates.longitude,
      initialCoordinates.latitude,
      initialCoordinates.height,
    ]
  }]);

  console.log('iconData', iconData)

  /*
  useEffect(() => {
    setInterval(() => {
      console.log('NEU');
      setInitialView((prev) => {
        const newView = { ...prev };
        newView.zoom -= 1;
        console.log('newView', newView);
        return newView;
      })
    }, [5000])
  }, [])
  */

  const layers = [
    new TerrainLayer({
      id: 'terrain',
      minZoom: 0,
      maxZoom: 23,
      strategy: 'no-overlap',
      //
      elevationDecoder: ELEVATION_DECODER,
      elevationData: TERRAIN_IMAGE,
      texture: SURFACE_IMAGE,
      wireframe: false,
      color: [255, 255, 255]
    }),

    new IconLayer({
      id: 'icon-layer',
      data: iconData,
      pickable: false,
      // iconAtlas and iconMapping are required
      // getIcon: return a string
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      sizeScale: 15,
      getPosition: d => d.coordinates,
      getSize: d => 5,
    })
  ];

  const mainView = new MapView({
    id: 'main',
    controller: MAP_CONTROLLER
  });
  const minimapView = new MapView({
    id: 'minimap',
    controller: MINIMAP_CONTROLLER,
    x: 20,
    y: 20,
    width: '20%',
    height: '20%',
    clear: false
  });

  const minimapBackgroundStyle = {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '100%',
    background: '#fefeff',
    boxShadow: '0 0 8px 2px rgba(0,0,0,0.15)'
  };

  return (
    <DeckGL
      initialViewState={{
        ...INITIAL_VIEW_STATE,
        longitude: initialCoordinates.longitude,
        latitude: initialCoordinates.latitude,
      }}
      controller={MAP_CONTROLLER}
      layers={layers}
    />
  );
};

export default Map;
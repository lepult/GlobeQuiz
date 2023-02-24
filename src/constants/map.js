export const MINIMAP_WIDTH = 396;
export const MINIMAP_HEIGHT = 240;

export const ICON_MAPPING = {
    guessMarker: {x: 0, y: 0, width: 512, height: 512, mask: true, anchorY: 512, anchorX: 256},
    locationMarker: {x: 512, y: 0, width: 512, height: 512, mask: true, anchorY: 512, anchorX: 256}
};

export const getMarkerColor = (markerType) => markerType === 'guessMarker'
    ? [21, 101, 192]
    : [57, 192, 21];
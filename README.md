# GlobeQuiz

Welcome to *GlobeQuiz*, a small project developed as part of a university module. This game is inspired by [GeoGuessr](https://www.geoguessr.com/) but uses 3D satellite views instead of Streetview images. The project was bootstrapped with Create React App and leverages [React](https://github.com/facebook/react), [Material UI](https://github.com/mui/material-ui), [Redux](https://github.com/reduxjs/redux), and [deck.gl](https://github.com/visgl/deck.gl) for its development.

## Overview

In *GlobeQuiz*, players are presented with five different locations they must identify on a world map. The game features four difficulty levels, which progressively restrict the camera's movement, making it more challenging to pinpoint each location accurately.

## Technologies Used

-  **[React](https://github.com/facebook/react)**: For building the user interface.
-  **[Material UI](https://github.com/mui/material-ui)**: For styling components.
-  **[Redux](https://github.com/reduxjs/redux)**: For state management.
-  **[deck.gl](https://github.com/visgl/deck.gl)**: For displaying and controlling the maps.
-  **[Mapzen Terrain Tiles](https://www.mapzen.com/blog/terrain-tile-service/)**: For terrain data visualization.
-  **[Arcgis World Imagery Tile Layer](https://www.arcgis.com/home/item.html?id=974d45be315c4c87b2ac32be59af9a0b)**: For satellite imagery.

## Play the Game

You can play *GlobeQuiz* directly via GitHub Pages at [https://lepult.github.io/GlobeQuiz/](https://lepult.github.io/GlobeQuiz/).

## Limitations

Currently, the game relies on APIs that have usage limitations:

- The Mapzen Terrain Tiles API is free to use for terrain data.
- The World Imagery Tile Layer API from Arcgis has restricted free usage, allowing approximately 200 games per month. After exceeding this limit, satellite images will no longer be displayed due to API constraints.

If there were a completely free API for satellite images available, the operation of *GlobeQuiz* would be unrestrictedly free. However, under current conditions, gameplay is limited by the Arcgis API's usage cap.

Enjoy exploring the world with *GlobeQuiz*!

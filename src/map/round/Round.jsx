import React from "react";
import Score from "../Score";
import Map from "./Map";
import MiniMap from "./Minimap";

const Round = () => (
    <div
        style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
        }}
    >
        <Score/>
        <Map/>
        <MiniMap/>
    </div>
);

export default Round;
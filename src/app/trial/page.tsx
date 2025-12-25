import React from "react";
import "../css/index.css";
import CircularText from "../Components/spinning_text";

export default function Trial() {
  return (
    <div className="trial_animations">
      <svg width="250" height="250" viewBox="150 50 100 150">
        {/* Right side */}
        <path
          style={{
            fill: "none",
            stroke: "rgb(255, 255, 255)",
            strokeWidth: "4px",
            strokeLinejoin: "round",
          }}
          d="M 200 100 L 200 200 C 200.149 181.438 215.26 162.499 220 170"
        />

        {/* Left side (mirrored) */}
        <path
          style={{
            fill: "none",
            stroke: "rgb(255, 255, 255)",
            strokeWidth: "4px",
            strokeLinejoin: "round",
          }}
          d="M 200 100 L 200 200 C 199.851 181.438 184.74 162.499 180 170"
        />
      </svg>
    </div>
  );
}

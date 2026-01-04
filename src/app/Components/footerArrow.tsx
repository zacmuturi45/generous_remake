import React from "react";
import "../css/index.css";

interface AnimatedLinkProps {
  text: string;
  svgFill?: string;
  svgStroke?: string;
  hoverTransform?: string;
  regTransform?: string;
  hoverColor?: string;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedLink({
  text,
  svgFill = "rgb(255, 255, 255)",
  svgStroke = "#878787",
  regTransform = "rotate(0deg)",
  className = "",
  onClick,
}: AnimatedLinkProps) {
  return (
    <div className="animated-link" onClick={onClick}>
      <svg
        className={`animated-link__icon ${className}`}
        fill={svgFill}
        width={24}
        height={24}
        viewBox="0 0 32 32"
        stroke={svgStroke}
        strokeWidth={0}
        // style={{ transform: regTransform }}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M5.975 17.504l14.287.001-6.367 6.366L16.021 26l10.004-10.003L16.029 6l-2.128 2.129 6.367 6.366H5.977z"></path>
        </g>
      </svg>
      <p className="animated-link__text">{text}</p>
    </div>
  );
}

// Example usage in another component:
// <AnimatedLink text="Contact" />
// <AnimatedLink text="Work" hoverTransform="translateY(-4px)" />
// <AnimatedLink text="About" svgFill="#000" hoverColor="#ff6b6b" />
// <AnimatedLink text="Services" hoverTransform="scale(1.2)" />

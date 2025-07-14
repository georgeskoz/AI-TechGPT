import React from 'react';

interface TechGPTLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function TechGPTLogo({ className, width = 200, height = 60 }: TechGPTLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main logo container with rounded rectangle */}
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      
      {/* Green rounded rectangle background */}
      <rect
        x="5"
        y="10"
        width="40"
        height="40"
        rx="8"
        ry="8"
        fill="url(#greenGradient)"
      />
      
      {/* Inner square with border */}
      <rect
        x="12"
        y="17"
        width="26"
        height="26"
        rx="2"
        ry="2"
        fill="none"
        stroke="#000"
        strokeWidth="2"
      />
      
      {/* Small yellow/orange square accent */}
      <rect
        x="28"
        y="25"
        width="6"
        height="6"
        rx="1"
        ry="1"
        fill="#fbbf24"
      />
      
      {/* TechGPT Text */}
      <text x="55" y="37" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#fbbf24">
        Tech
      </text>
      <text x="108" y="37" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#22c55e">
        GPT
      </text>
      
      {/* Small tech icon in top right */}
      <g transform="translate(175, 15)">
        <rect x="0" y="0" width="12" height="8" rx="1" fill="#22c55e" />
        <rect x="2" y="2" width="8" height="1" fill="#fff" />
        <rect x="2" y="4" width="6" height="1" fill="#fff" />
        <rect x="2" y="6" width="4" height="1" fill="#fff" />
        <circle cx="14" cy="4" r="2" fill="#22c55e" />
      </g>
    </svg>
  );
}
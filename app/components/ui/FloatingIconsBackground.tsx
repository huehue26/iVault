"use client";

import { useEffect, useRef } from "react";

export default function FloatingIconsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Insurance-related animated GIF icons
    const icons = [
      '/icons/car-insurance.gif',      // Car (Auto)
      '/icons/home-insurance.gif',     // Home
      '/icons/health-insurance.gif',    // Heart (Health/Life)
      '/icons/shield-bg.gif',   // Shield (Protection)
      '/icons/life-insurance.gif', // Life (Coverage)
      '/icons/travel-insurance.gif', // Travel
      '/icons/file-invoice.gif' // Other
    ];

    const numberOfIcons = 30;

    for (let i = 0; i < numberOfIcons; i++) {
      const iconWrapper = document.createElement('div');
      iconWrapper.classList.add('floating-icon');
      
      // Create img element for GIF
      const img = document.createElement('img');
      img.src = icons[i % icons.length];
      img.alt = 'Insurance Icon';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      
      iconWrapper.appendChild(img);
      
      // Randomize properties
      iconWrapper.style.left = `${Math.random() * 100}vw`;
      iconWrapper.style.animationDuration = `${20 + Math.random() * 20}s`; // 20-40s duration
      iconWrapper.style.animationDelay = `${Math.random() * 15}s`;
      // Larger size for better visibility
      const size = 40 + Math.random() * 60; // 40px-100px
      iconWrapper.style.width = `${size}px`;
      iconWrapper.style.height = `${size}px`;
      
      container.appendChild(iconWrapper);
    }

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="background-container"
    />
  );
}
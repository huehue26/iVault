"use client";

import React, { memo, useCallback } from "react";
import { useInsure } from "../../store/insureStore";

function Header() {
  const { setActivePage } = useInsure();

  const handleBackToHome = useCallback(() => {
    setActivePage("homePage");
  }, [setActivePage]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10 animate-fade-in">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleBackToHome}
          >
            <div className="flex items-center space-x-3">  
              <img src="/icons/shield.gif" alt="Shield" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">iVault</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);



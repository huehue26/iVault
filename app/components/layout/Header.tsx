"use client";

import React, { memo, useCallback } from "react";
import Image from "next/image";
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

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
              <Image src="https://placehold.co/32x32/E2E8F0/475569?text=S" alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">Sarah Johnson</p>
                <p className="text-xs text-gray-700">Premium Member</p>
              </div>
              <i className="fa-solid fa-chevron-down text-gray-600 text-xs" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);



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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-insurance-light to-insurance-blue flex items-center justify-center">
              <img src="/icons/shield.gif" alt="Shield" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-insurance-blue">InsureVault</h1>
              <p className="text-xs text-gray-700">Policy Management</p>
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



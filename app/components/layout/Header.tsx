"use client";

import React, { memo, useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useInsure } from "../../store/insureStore";

function Header() {
  const { setActivePage, logout } = useInsure();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleBackToHome = useCallback(() => {
    setActivePage("homePage");
  }, [setActivePage]);

  const handleProfileClick = useCallback(() => {
    setActivePage("profilePage");
    setIsDropdownOpen(false);
  }, [setActivePage]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity rounded-md p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={toggleDropdown}
                type="button"
              >
                <Image src="/icons/user-profile.png" alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full" />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Premium Member</p>
                </div>
                <i className={`fa-solid fa-chevron-down text-gray-600 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-2">
                    {/* Header Section */}
                    <div className="flex items-center p-3">
                      <Image src="/icons/user-profile.png" alt="User Avatar" width={48} height={48} className="w-12 h-12 rounded-full" />
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-900">Sarah Johnson</p>
                        <p className="text-sm text-gray-500">sarah.johnson@email.com</p>
                      </div>
                    </div>

                    {/* Menu Items Section */}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleProfileClick}
                        className="text-orange-500 font-semibold bg-orange-50 block w-full text-left px-4 py-2.5 text-sm rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        My Profile
                      </button>
                    </div>

                    {/* Logout Button Section */}
                    <div className="border-t border-gray-100 mt-2 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-red-600 hover:bg-red-600 hover:text-white bg-red-50 transition-colors cursor-pointer"
                      >
                        <img src="/icons/logout.gif" alt="Logout" className="w-7 h-7 mix-blend-multiply" />
                        <span className="text-sm font-medium">Log out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);



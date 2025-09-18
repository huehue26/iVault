"use client";

import React, { memo, useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useInsure } from "../../store/insureStore";

type PageKey = "homePage" | "loginPage" | "policyBankPage" | "claimsPage" | "claimDetailsPage" | "policyDetailsPage" | "claimAssistancePage" | "policyManagementPage" | "claimsManagementPage" | "claimManagementDetailsPage" | "agentManagementPage" | "policyDashboardPage" | "queryManagementPage" | "ruleManagementPage" | "claimManagementPage";

function Sidebar() {
  const { activePage, setActivePage, userRole, logout } = useInsure();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePageChange = useCallback((key: PageKey) => {
    setActivePage(key);
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

  const link = (key: PageKey | null, iconSrc: string, label: string, onClick?: () => void) => (
    <a
      href="#"
      onClick={(e) => { 
        e.preventDefault(); 
        if (onClick) onClick(); 
        else if (key) handlePageChange(key); 
      }}
      className={`nav-link flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activePage === key ? "nav-active nav-selected" : "text-gray-700 hover:bg-gray-50 hover:text-insurance-blue"}`}
    >
      <img src={iconSrc} alt={label} className="w-7 h-7 text-center mix-blend-multiply" />
      <span>{label}</span>
    </a>
  );

  return (
    <aside className="w-80 bg-white shadow-sm border-r border-gray-200 flex-shrink-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
      <div className="p-6 h-full flex flex-col">
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center space-x-2 text-success-green mb-1">
            <img src="/icons/sun.gif" alt="Sun" className="w-6 h-6" />
            <span className="font-medium text-sm">Good afternoon, Sarah!</span>
          </div>
          <p className="text-sm text-gray-700">Your policies are 95% up to date</p>
        </div>

        <nav className="space-y-2">
          {/* User Role Navigation */}
          {userRole === "user" && (
            <>
              {link("policyBankPage", "/icons/folder.gif", "Policy Bank")}
              {link("claimAssistancePage", "/icons/headset.gif", "Claim Assistance")}
            </>
          )}
          
          {/* Agent Role Navigation */}
          {userRole === "agent" && (
            <>
              {link("policyManagementPage", "/icons/users.gif", "Policy Management")}
              {link("claimManagementPage", "/icons/file-invoice.gif", "Assigned Claims")}
              {link("queryManagementPage", "/icons/headset.gif", "Query Management")}
            </>
          )}
          
          {/* Admin Role Navigation */}
          {userRole === "admin" && (
            <>
              {link("agentManagementPage", "/icons/agent.gif", "Agent Management")}
              {link("policyDashboardPage", "/icons/grid.gif", "Policy Dashboard")}
              {link("ruleManagementPage", "/icons/gear.gif", "Rule Management")}
              {link("claimManagementPage", "/icons/file-invoice.gif", "Claim Management")}
              {link("queryManagementPage", "/icons/headset.gif", "Query Management")}
            </>
          )}
        </nav>

        <div className="mt-auto animate-slide-up" style={{ animationDelay: "140ms" }}>
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity rounded-md p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
              onClick={toggleDropdown}
              type="button"
            >
              <Image src="/icons/user-profile.png" alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full" />
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-gray-700">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
              <i className={`fa-solid fa-chevron-up text-gray-600 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu - Opens Upward */}
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50">
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
    </aside>
  );
}

export default memo(Sidebar);



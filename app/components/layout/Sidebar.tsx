"use client";

import React, { memo, useCallback } from "react";
import { useInsure } from "../../store/insureStore";

type PageKey = "homePage" | "loginPage" | "policyBankPage" | "claimsPage" | "claimDetailsPage" | "policyDetailsPage" | "claimAssistancePage";

function Sidebar() {
  const { activePage, setActivePage, isAuthenticated, logout } = useInsure();
  
  const handlePageChange = useCallback((key: PageKey) => {
    setActivePage(key);
  }, [setActivePage]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

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
          {link("policyBankPage", "/icons/folder.gif", "Policy Bank")}
          {link("claimAssistancePage", "/icons/headset.gif", "Claim Assistance", () => handlePageChange("claimAssistancePage"))}
        </nav>

        <div className="mt-auto animate-slide-up" style={{ animationDelay: "140ms" }}>
          {isAuthenticated && (
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-red-600 hover:bg-red-600 hover:text-white bg-red-50 transition-colors cursor-pointer">
              <img src="/icons/logout.gif" alt="Logout" className="w- h-7 mix-blend-multiply" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default memo(Sidebar);



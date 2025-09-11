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

  const link = (key: PageKey | null, icon: string, label: string, onClick?: () => void) => (
    <a
      href="#"
      onClick={(e) => { 
        e.preventDefault(); 
        if (onClick) onClick(); 
        else if (key) handlePageChange(key); 
      }}
      className={`nav-link flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-base ${activePage === key ? "nav-active" : "text-gray-700 hover:bg-gray-50 hover:text-insurance-blue"}`}
    >
      <i className={`${icon} w-5 text-center`} />
      <span>{label}</span>
    </a>
  );

  return (
    <aside className="w-96 bg-white shadow-sm border-r border-gray-200 flex-shrink-0 animate-fade-in" style={{ animationDelay: "80ms" }}>
      <div className="p-6 h-full flex flex-col">
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center space-x-2 text-success-green mb-1">
            <i className="fa-regular fa-sun" />
            <span className="font-medium text-sm">Good afternoon, Sarah!</span>
          </div>
          <p className="text-sm text-gray-700">Your policies are 95% up to date</p>
        </div>

        <nav className="space-y-2">
          {link("policyBankPage", "fa-solid fa-folder-open", "Policy Bank")}
          {link("claimAssistancePage", "fa-solid fa-headset", "Claim Assistance", () => handlePageChange("claimAssistancePage"))}
          {link(null, "fa-solid fa-users", "Family Coverage", () => {})}
          {link(null, "fa-solid fa-calendar-check", "Renewals", () => {})}
          {link(null, "fa-solid fa-file-invoice-dollar", "Premium Tracker", () => {})}
          {link(null, "fa-solid fa-cog", "Settings", () => {})}
        </nav>

        <div className="mt-auto animate-slide-up" style={{ animationDelay: "140ms" }}>
          {isAuthenticated && (
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
              <i className="fa-solid fa-right-from-bracket" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default memo(Sidebar);



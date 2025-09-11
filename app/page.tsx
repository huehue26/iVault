"use client";

import React, { memo } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import PolicyBank from "./components/PolicyBank";
import ClaimsList from "./components/ClaimsList";
import ClaimDetails from "./components/ClaimDetails";
import PolicyDetails from "./components/PolicyDetails";
import ClaimAssistance from "./components/ClaimAssistance";
import { InsureProvider, useInsure } from "./store/insureStore";
import { AddPolicyModal, FileClaimModal } from "./components/Modals";
import PolicyOnboardingModal from "./components/PolicyOnboardingModal";
import ClaimFilingModal from "./components/ClaimFilingModal";
import Auth from "./components/Auth";
import WhatsAppFloatingIcon from "./components/WhatsAppFloatingIcon";

// Memoized components to prevent unnecessary re-renders
const MemoizedHome = memo(Home);
const MemoizedAuth = memo(Auth);
const MemoizedPolicyBank = memo(PolicyBank);
const MemoizedClaimAssistance = memo(ClaimAssistance);
const MemoizedClaimDetails = memo(ClaimDetails);
const MemoizedPolicyDetails = memo(PolicyDetails);

function ContentRouter() {
  const { activePage, isAuthenticated } = useInsure();
  
  // Show home page if not authenticated
  if (!isAuthenticated) {
    // If user tries to navigate to login page, show Auth component
    if (activePage === "loginPage") {
      return (
        <>
          <MemoizedAuth key="auth" />
          <WhatsAppFloatingIcon />
        </>
      );
    }
    return (
      <>
        <MemoizedHome key="home-unauthenticated" />
        <WhatsAppFloatingIcon />
      </>
    );
  }
  
  // If authenticated user wants to go to home page, show full screen home
  if (isAuthenticated && activePage === "homePage") {
    return (
      <>
        <MemoizedHome key="home-fullscreen" />
        <WhatsAppFloatingIcon />
      </>
    );
  }
  
  // Render authenticated content based on active page
  const renderAuthenticatedContent = () => {
    switch (activePage) {
      case "policyBankPage":
        return <MemoizedPolicyBank key="policy-bank" />;
      case "claimsPage":
        return <MemoizedClaimAssistance key="claims" />;
      case "claimDetailsPage":
        return <MemoizedClaimDetails key="claim-details" />;
      case "policyDetailsPage":
        return <MemoizedPolicyDetails key="policy-details" />;
      case "claimAssistancePage":
        return <MemoizedClaimAssistance key="claim-assistance" />;
      default:
        return <MemoizedPolicyBank key="policy-bank-default" />;
    }
  };
  
  // Show authenticated app if logged in
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {renderAuthenticatedContent()}
          </div>
        </div>
        <AddPolicyModal />
        <FileClaimModal />
        <PolicyOnboardingModal />
        <ClaimFilingModal />
      </div>
      <WhatsAppFloatingIcon />
    </>
  );
}

export default function App() {
  return (
    <InsureProvider>
      <ContentRouter />
    </InsureProvider>
  );
}

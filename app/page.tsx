"use client";

import React, { memo } from "react";
import { 
  Header, 
  Sidebar, 
  Home, 
  PolicyBank, 
  ClaimDetails, 
  PolicyDetails, 
  ClaimAssistance,
  AddPolicyModal,
  FileClaimModal,
  PolicyOnboardingModal,
  ClaimFilingModal,
  Auth,
  WhatsAppFloatingIcon
} from "./components";
import { InsureProvider, useInsure } from "./store/insureStore";

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

"use client";

import React, { useEffect } from "react";
import {
  Header,
  Sidebar,
  PolicyBank,
  ClaimAssistance,
  PolicyDetails,
  ClaimDetails,
  AddPolicyModal,
  FileClaimModal,
  PolicyOnboardingModal,
  ClaimFilingModal,
  WhatsAppFloatingIcon
} from "../components";
import { ProfilePage } from "../components/ui";
import { InsureProvider, useInsure } from "../store/insureStore";

function UserContentRouter() {
  const { activePage, setUserRole, login } = useInsure();
  
  // Set user role when component mounts
  useEffect(() => {
    setUserRole("user");
    login("user");
  }, [setUserRole, login]);
  
  const renderContent = () => {
    switch (activePage) {
      case "policyBankPage":
        return <PolicyBank key="policy-bank" />;
      case "claimAssistancePage":
        return <ClaimAssistance key="claim-assistance" />;
      case "claimDetailsPage":
        return <ClaimDetails key="claim-details" />;
      case "policyDetailsPage":
        return <PolicyDetails key="policy-details" />;
      case "profilePage":
        return <ProfilePage key="profile" />;
      default:
        return <PolicyBank key="policy-bank-default" />;
    }
  };
  
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {renderContent()}
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

export default function UserPage() {
  return (
    <InsureProvider>
      <UserContentRouter />
    </InsureProvider>
  );
}

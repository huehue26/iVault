"use client";

import React, { useEffect } from "react";
import {
  Header,
  Sidebar,
  PolicyManagement,
  AssignedClaims,
  ClaimManagementDetails,
  PolicyDetails,
  AddPolicyModal,
  FileClaimModal,
  PolicyOnboardingModal,
  ClaimFilingModal,
  WhatsAppFloatingIcon
} from "../components";
import { ProfilePage, QueryManagement } from "../components/ui";
import { InsureProvider, useInsure } from "../store/insureStore";

function AgentContentRouter() {
  const { activePage, setUserRole, login } = useInsure();
  
  // Set agent role when component mounts
  useEffect(() => {
    setUserRole("agent");
    login("agent");
  }, [setUserRole, login]);
  
  const renderContent = () => {
    switch (activePage) {
      case "policyManagementPage":
        return <PolicyManagement key="policy-management" />;
      case "claimManagementDetailsPage":
        return <ClaimManagementDetails key="claim-management-details" />;
      case "claimManagementPage":
        return <AssignedClaims key="assigned-claims" />;
      case "policyDetailsPage":
        return <PolicyDetails key="policy-details" />;
      case "profilePage":
        return <ProfilePage key="profile" />;
      case "queryManagementPage":
        return <QueryManagement key="query-management" />;
      default:
        return <PolicyManagement key="policy-management-default" />;
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

export default function AgentPage() {
  return (
    <InsureProvider>
      <AgentContentRouter />
    </InsureProvider>
  );
}

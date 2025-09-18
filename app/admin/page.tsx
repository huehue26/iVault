"use client";

import React, { useEffect } from "react";
import {
  Header,
  Sidebar,
  AddPolicyModal,
  FileClaimModal,
  PolicyOnboardingModal,
  ClaimFilingModal,
  WhatsAppFloatingIcon
} from "../components";
import { 
  AgentManagement, 
  PolicyDashboard, 
  RuleManagement, 
  ClaimManagement,
  ProfilePage,
  QueryManagement
} from "../components/ui";
import { InsureProvider, useInsure } from "../store/insureStore";

function AdminContentRouter() {
  const { activePage, setUserRole, login } = useInsure();
  
  // Set admin role when component mounts
  useEffect(() => {
    setUserRole("admin");
    login("admin");
  }, [setUserRole, login]);
  
  const renderContent = () => {
    switch (activePage) {
      case "agentManagementPage":
        return <AgentManagement key="agent-management" />;
      case "policyDashboardPage":
        return <PolicyDashboard key="policy-dashboard" />;
      case "ruleManagementPage":
        return <RuleManagement key="rule-management" />;
      case "claimManagementPage":
        return <ClaimManagement key="claim-management" />;
      case "profilePage":
        return <ProfilePage key="profile" />;
      case "queryManagementPage":
        return <QueryManagement key="query-management" />;
      default:
        return <AgentManagement key="agent-management-default" />;
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

export default function AdminPage() {
  return (
    <InsureProvider>
      <AdminContentRouter />
    </InsureProvider>
  );
}

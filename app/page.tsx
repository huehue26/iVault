"use client";

import React, { memo } from "react";
import {
  Header,
  Sidebar,
  Home,
  PolicyBank,
  PolicyManagement,
  ClaimDetails,
  PolicyDetails,
  ClaimAssistance,
  ClaimsManagement,
  ClaimManagementDetails,
  AddPolicyModal,
  FileClaimModal,
  PolicyOnboardingModal,
  ClaimFilingModal,
  Auth,
  WhatsAppFloatingIcon
} from "./components";
import { AgentManagement, PolicyDashboard, QueryManagement, RuleManagement, ClaimManagement, ProfilePage } from "./components/ui";
import { InsureProvider, useInsure } from "./store/insureStore";

// Memoized components to prevent unnecessary re-renders
const MemoizedHome = memo(Home);
const MemoizedAuth = memo(Auth);
const MemoizedPolicyBank = memo(PolicyBank);
const MemoizedPolicyManagement = memo(PolicyManagement);
const MemoizedClaimAssistance = memo(ClaimAssistance);
const MemoizedClaimsManagement = memo(ClaimsManagement);
const MemoizedClaimManagementDetails = memo(ClaimManagementDetails);
const MemoizedClaimDetails = memo(ClaimDetails);
const MemoizedPolicyDetails = memo(PolicyDetails);
const MemoizedProfilePage = memo(ProfilePage);
const MemoizedAgentManagement = memo(AgentManagement);
const MemoizedPolicyDashboard = memo(PolicyDashboard);
const MemoizedQueryManagement = memo(QueryManagement);
const MemoizedRuleManagement = memo(RuleManagement);
const MemoizedClaimManagement = memo(ClaimManagement);

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
      case "policyManagementPage":
        return <MemoizedPolicyManagement key="policy-management" />;
      case "policyDashboardPage":
        return <MemoizedPolicyDashboard key="policy-dashboard" />;
      case "agentManagementPage":
        return <MemoizedAgentManagement key="agent-management" />;
      case "queryManagementPage":
        return <MemoizedQueryManagement key="query-management" />;
      case "ruleManagementPage":
        return <MemoizedRuleManagement key="rule-management" />;
      case "claimsPage":
        return <MemoizedClaimAssistance key="claims" />;
      case "claimDetailsPage":
        return <MemoizedClaimDetails key="claim-details" />;
      case "policyDetailsPage":
        return <MemoizedPolicyDetails key={`policy-details-true`} />;
      case "claimAssistancePage":
        return <MemoizedClaimAssistance key="claim-assistance" />;
      case "claimsManagementPage":
        return <MemoizedClaimsManagement key="claims-management" />;
      case "claimManagementDetailsPage":
        return <MemoizedClaimManagementDetails key="claim-management-details" />;
      case "claimManagementPage":
        return <MemoizedClaimManagement key="claim-management" />;
      case "profilePage":
        return <MemoizedProfilePage key="profile" />;
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

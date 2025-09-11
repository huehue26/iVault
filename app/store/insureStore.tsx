"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

export type Policy = {
  type: string;
  insurer: string;
  policyNumber: string;
  premium: number;
  coverageAmount: number;
  expires: string;
  documents: number;
  status: "Active" | "Expiring Soon" | string;
  icon: string;
  iconBg: string;
  iconColor: string;
};

export type ClaimUpdate = { from: "agent" | "user"; message: string; timestamp: string };

export type Claim = {
  id: string;
  policyNumber: string;
  dateFiled: string;
  dateOfIncident: string;
  status: "Approved" | "Processing" | "Denied" | string;
  agent: { name: string; avatar: string };
  updates: ClaimUpdate[];
};

type PageKey =
  | "homePage"
  | "loginPage"
  | "policyBankPage"
  | "claimsPage"
  | "claimDetailsPage"
  | "policyDetailsPage"
  | "claimAssistancePage";

type ModalState = { addPolicyOpen: boolean; fileClaimOpen: boolean; policyOnboardingOpen: boolean; claimFilingOpen: boolean };

export type InsureState = {
  policies: Policy[];
  claims: Claim[];
  activePage: PageKey;
  activeClaimId: string | null;
  activePolicyNumber: string | null;
  modals: ModalState;
  isAuthenticated: boolean;
  uploadedFile: File | null;
};

type InsureActions = {
  setActivePage: (page: PageKey) => void;
  setActivePolicyNumber: (policyNumber: string | null) => void;
  openAddPolicy: () => void;
  closeAddPolicy: () => void;
  openPolicyOnboarding: (file?: File) => void;
  closePolicyOnboarding: () => void;
  openFileClaim: () => void;
  closeFileClaim: () => void;
  openClaimFiling: () => void;
  closeClaimFiling: () => void;
  setActiveClaimId: (id: string | null) => void;
  addPolicy: (policy: Policy) => void;
  addClaim: (claim: Claim) => void;
  appendClaimUpdate: (claimId: string, update: ClaimUpdate) => void;
  login: () => void;
  logout: () => void;
  showLoginPage: () => void;
};

type InsureContextType = InsureState & InsureActions;

const InsureContext = createContext<InsureContextType | undefined>(undefined);

export const initialPolicies: Policy[] = [
  { type: "Health Insurance", insurer: "BlueCross BlueShield Premium", policyNumber: "HI-2024-001", premium: 450, coverageAmount: 500000, expires: "2024-12-31", documents: 3, status: "Active", icon: "fa-solid fa-heart-pulse", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "State Farm Comprehensive", policyNumber: "AI-2024-002", premium: 180, coverageAmount: 100000, expires: "2025-01-15", documents: 5, status: "Active", icon: "fa-solid fa-car", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "MetLife Term Life $500K", policyNumber: "LI-2024-003", premium: 85, coverageAmount: 500000, expires: "2025-03-20", documents: 2, status: "Active", icon: "fa-solid fa-user-shield", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Allstate Homeowners Protection", policyNumber: "HO-2024-004", premium: 120, coverageAmount: 300000, expires: "2024-11-30", documents: 4, status: "Expiring Soon", icon: "fa-solid fa-home", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "World Nomads Annual Coverage", policyNumber: "TI-2024-005", premium: 45, coverageAmount: 50000, expires: "2025-08-15", documents: 1, status: "Active", icon: "fa-solid fa-plane", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
];

export const initialClaims: Claim[] = [
  { id: "CLM-001", policyNumber: "AI-2024-002", dateFiled: "Jul 22, 2024", dateOfIncident: "Jul 20, 2024", status: "Approved", agent: { name: "John Carter", avatar: "https://placehold.co/40x40/60A5FA/FFFFFF?text=JC" }, updates: [{ from: "agent", message: "Your claim has been received and is under review.", timestamp: "Jul 22, 2:30 PM" }, { from: "agent", message: "We have reviewed the documents. The estimated settlement amount is $2,500.", timestamp: "Jul 24, 11:10 AM" }, { from: "user", message: "Thank you for the update. When can I expect the payment?", timestamp: "Jul 24, 11:15 AM" }, { from: "agent", message: "The payment has been processed and should reflect in your account within 3-5 business days. Your claim is now approved.", timestamp: "Jul 25, 9:00 AM" }] },
  { id: "CLM-002", policyNumber: "HI-2024-001", dateFiled: "Aug 05, 2024", dateOfIncident: "Aug 02, 2024", status: "Processing", agent: { name: "Maria Garcia", avatar: "https://placehold.co/40x40/F472B6/FFFFFF?text=MG" }, updates: [{ from: "agent", message: "Claim received. Please ensure you have uploaded the hospital bills and the doctor's report.", timestamp: "Aug 05, 4:55 PM" }] },
  { id: "CLM-003", policyNumber: "HO-2024-004", dateFiled: "Sep 01, 2024", dateOfIncident: "Aug 28, 2024", status: "Denied", agent: { name: "David Lee", avatar: "https://placehold.co/40x40/34D399/FFFFFF?text=DL" }, updates: [{ from: "agent", message: "Claim under review. A surveyor will contact you shortly.", timestamp: "Sep 01, 10:20 AM" }, { from: "agent", message: "After reviewing the surveyor's report, we found the damage is not covered under your current policy terms. Unfortunately, we have to deny this claim.", timestamp: "Sep 03, 3:00 PM" }] },
];

export function InsureProvider({ children }: { children: React.ReactNode }) {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [activePage, setActivePage] = useState<PageKey>("homePage");
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [activePolicyNumber, setActivePolicyNumber] = useState<string | null>(null);
  const [modals, setModals] = useState<ModalState>({ 
    addPolicyOpen: false, 
    fileClaimOpen: false, 
    policyOnboardingOpen: false,
    claimFilingOpen: false
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Define all actions using useCallback at the top level
  const openAddPolicy = useCallback(() => setModals(m => ({ ...m, addPolicyOpen: true })), []);
  const closeAddPolicy = useCallback(() => setModals(m => ({ ...m, addPolicyOpen: false })), []);
  const openPolicyOnboarding = useCallback((file?: File) => {
    setUploadedFile(file || null);
    setModals(m => ({ ...m, policyOnboardingOpen: true }));
  }, []);
  const closePolicyOnboarding = useCallback(() => {
    setModals(m => ({ ...m, policyOnboardingOpen: false }));
    setUploadedFile(null);
  }, []);
  const openFileClaim = useCallback(() => setModals(m => ({ ...m, fileClaimOpen: true })), []);
  const closeFileClaim = useCallback(() => setModals(m => ({ ...m, fileClaimOpen: false })), []);
  const openClaimFiling = useCallback(() => setModals(m => ({ ...m, claimFilingOpen: true })), []);
  const closeClaimFiling = useCallback(() => setModals(m => ({ ...m, claimFilingOpen: false })), []);
  const addPolicy = useCallback((policy: Policy) => setPolicies(prev => [...prev, policy]), []);
  const addClaim = useCallback((claim: Claim) => setClaims(prev => [...prev, claim]), []);
  const appendClaimUpdate = useCallback((claimId: string, update: ClaimUpdate) => setClaims(prev => prev.map(c => c.id === claimId ? { ...c, updates: [...c.updates, update] } : c)), []);
  const login = useCallback(() => {
    setIsAuthenticated(true);
    setActivePage("policyBankPage");
  }, [setActivePage]);
  const logout = useCallback(() => setIsAuthenticated(false), []);
  const showLoginPage = useCallback(() => {
    setIsAuthenticated(false);
    setActivePage("loginPage");
  }, [setActivePage]);

  const actions: InsureActions = useMemo(() => ({
    setActivePage,
    setActivePolicyNumber,
    openAddPolicy,
    closeAddPolicy,
    openPolicyOnboarding,
    closePolicyOnboarding,
    openFileClaim,
    closeFileClaim,
    openClaimFiling,
    closeClaimFiling,
    setActiveClaimId,
    addPolicy,
    addClaim,
    appendClaimUpdate,
    login,
    logout,
    showLoginPage,
  }), [setActivePage, setActivePolicyNumber, setActiveClaimId, openAddPolicy, closeAddPolicy, openPolicyOnboarding, closePolicyOnboarding, openFileClaim, closeFileClaim, openClaimFiling, closeClaimFiling, addPolicy, addClaim, appendClaimUpdate, login, logout, showLoginPage]);

  const value = useMemo<InsureContextType>(
    () => ({ 
      policies, 
      claims, 
      activePage, 
      activeClaimId, 
      activePolicyNumber, 
      modals, 
      isAuthenticated, 
      uploadedFile, 
      ...actions 
    }),
    [policies, claims, activePage, activeClaimId, activePolicyNumber, modals, isAuthenticated, uploadedFile]
  );

  return <InsureContext.Provider value={value}>{children}</InsureContext.Provider>;
}

export function useInsure() {
  const ctx = useContext(InsureContext);
  if (!ctx) throw new Error("useInsure must be used within InsureProvider");
  return ctx;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}



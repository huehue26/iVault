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
  missingDocuments: string[];
  status: "Active" | "Expiring Soon" | string;
  icon: string;
  iconBg: string;
  iconColor: string;
};

export type ClaimUpdate = { from: "agent" | "user"; message: string; timestamp: string };

export type ClaimDocument = {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
};

export type Claim = {
  id: string;
  policyNumber: string;
  dateFiled: string;
  dateOfIncident: string;
  status: "Approved" | "Processing" | "Denied" | string;
  agent: { name: string; avatar: string };
  updates: ClaimUpdate[];
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  claimDetails: {
    incidentDescription: string;
    incidentLocation: string;
    estimatedDamage: string;
    witnesses: string;
  };
  documents: ClaimDocument[];
};

type PageKey =
  | "homePage"
  | "loginPage"
  | "policyBankPage"
  | "claimsPage"
  | "claimDetailsPage"
  | "policyDetailsPage"
  | "claimAssistancePage"
  | "claimsManagementPage"
  | "claimManagementDetailsPage"
  | "policyManagementPage"
  | "profilePage"
  | "agentManagementPage"
  | "policyDashboardPage"
  | "queryManagementPage"
  | "ruleManagementPage"
  | "claimManagementPage";

type ModalState = { addPolicyOpen: boolean; fileClaimOpen: boolean; policyOnboardingOpen: boolean; claimFilingOpen: boolean };

export type UserRole = "user" | "agent" | "admin";

export type InsureState = {
  policies: Policy[];
  claims: Claim[];
  activePage: PageKey;
  activeClaimId: string | null;
  activePolicyNumber: string | null;
  modals: ModalState;
  isAuthenticated: boolean;
  uploadedFile: File | null;
  isAgentView: boolean;
  userRole: UserRole;
  prePopulatedPolicy: Policy | null;
};

type InsureActions = {
  setActivePage: (page: PageKey) => void;
  setActivePolicyNumber: (policyNumber: string | null) => void;
  setIsAgentView: (isAgent: boolean) => void;
  setUserRole: (role: UserRole) => void;
  openAddPolicy: () => void;
  closeAddPolicy: () => void;
  openPolicyOnboarding: (file?: File) => void;
  openPolicyOnboardingWithData: (policy: Policy) => void;
  closePolicyOnboarding: () => void;
  openFileClaim: () => void;
  closeFileClaim: () => void;
  openClaimFiling: () => void;
  closeClaimFiling: () => void;
  setActiveClaimId: (id: string | null) => void;
  addPolicy: (policy: Policy) => void;
  addClaim: (claim: Claim) => void;
  appendClaimUpdate: (claimId: string, update: ClaimUpdate) => void;
  updateClaimStatus: (claimId: string, status: string) => void;
  login: (role?: UserRole) => void;
  logout: () => void;
  showLoginPage: () => void;
};

type InsureContextType = InsureState & InsureActions;

const InsureContext = createContext<InsureContextType | undefined>(undefined);

export const initialPolicies: Policy[] = [
  { type: "Health Insurance", insurer: "BlueCross BlueShield Premium", policyNumber: "HI-2024-001", premium: 450, coverageAmount: 500000, expires: "2024-12-31", documents: 3, missingDocuments: [], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "State Farm Comprehensive", policyNumber: "AI-2024-002", premium: 180, coverageAmount: 100000, expires: "2025-01-15", documents: 5, missingDocuments: ["Address Proof", "Income Certificate", "Bank Statement"], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "MetLife Term Life $500K", policyNumber: "LI-2024-003", premium: 85, coverageAmount: 500000, expires: "2025-03-20", documents: 2, missingDocuments: ["Policy Document", "Photo ID", "Address Proof", "Medical Certificate", "Income Certificate", "Policy Document", "Photo ID", "Address Proof", "Medical Certificate", "Income Certificate"], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Allstate Homeowners Protection", policyNumber: "HO-2024-004", premium: 120, coverageAmount: 300000, expires: "2024-11-30", documents: 4, missingDocuments: ["Policy Document", "Photo ID"], status: "Expiring Soon", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "World Nomads Annual Coverage", policyNumber: "TI-2024-005", premium: 45, coverageAmount: 50000, expires: "2025-08-15", documents: 1, missingDocuments: ["Policy Document", "Photo ID", "Address Proof"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },

  // Additional policies for pagination demonstration
  { type: "Health Insurance", insurer: "Aetna Gold Plan", policyNumber: "HI-2024-006", premium: 380, coverageAmount: 400000, expires: "2025-02-28", documents: 2, missingDocuments: ["Medical Certificate"], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "Geico Complete Coverage", policyNumber: "AI-2024-007", premium: 220, coverageAmount: 150000, expires: "2025-04-10", documents: 4, missingDocuments: [], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "Prudential Whole Life", policyNumber: "LI-2024-008", premium: 120, coverageAmount: 750000, expires: "2025-05-15", documents: 3, missingDocuments: ["Photo ID"], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Liberty Mutual Premier", policyNumber: "HO-2024-009", premium: 150, coverageAmount: 450000, expires: "2024-10-25", documents: 5, missingDocuments: ["Address Proof"], status: "Expiring Soon", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "Travel Guard Plus", policyNumber: "TI-2024-010", premium: 65, coverageAmount: 75000, expires: "2025-06-30", documents: 2, missingDocuments: ["Photo ID"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
  { type: "Health Insurance", insurer: "UnitedHealthcare Platinum", policyNumber: "HI-2024-011", premium: 520, coverageAmount: 600000, expires: "2024-11-15", documents: 4, missingDocuments: ["Income Certificate"], status: "Expiring Soon", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "Progressive Full Coverage", policyNumber: "AI-2024-012", premium: 195, coverageAmount: 125000, expires: "2025-07-20", documents: 3, missingDocuments: ["Bank Statement"], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "Northwestern Mutual", policyNumber: "LI-2024-013", premium: 95, coverageAmount: 400000, expires: "2025-08-12", documents: 2, missingDocuments: [], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Nationwide Elite", policyNumber: "HO-2024-014", premium: 135, coverageAmount: 350000, expires: "2025-01-08", documents: 4, missingDocuments: ["Policy Document"], status: "Active", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "Squaremouth Premium", policyNumber: "TI-2024-015", premium: 55, coverageAmount: 60000, expires: "2025-09-05", documents: 1, missingDocuments: ["Address Proof", "Photo ID"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
  { type: "Health Insurance", insurer: "Cigna PPO Plus", policyNumber: "HI-2024-016", premium: 420, coverageAmount: 450000, expires: "2025-03-10", documents: 3, missingDocuments: [], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "Farmers Insurance", policyNumber: "AI-2024-017", premium: 175, coverageAmount: 95000, expires: "2025-10-18", documents: 5, missingDocuments: ["Medical Certificate"], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "Guardian Life", policyNumber: "LI-2024-018", premium: 110, coverageAmount: 300000, expires: "2025-11-22", documents: 2, missingDocuments: ["Income Certificate"], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Chubb Home Protection", policyNumber: "HO-2024-019", premium: 180, coverageAmount: 500000, expires: "2024-12-05", documents: 4, missingDocuments: ["Photo ID"], status: "Expiring Soon", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "Allianz Global", policyNumber: "TI-2024-020", premium: 75, coverageAmount: 80000, expires: "2025-12-01", documents: 3, missingDocuments: ["Policy Document"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
  { type: "Health Insurance", insurer: "Humana Gold Choice", policyNumber: "HI-2024-021", premium: 340, coverageAmount: 350000, expires: "2025-04-15", documents: 2, missingDocuments: ["Address Proof", "Photo ID"], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "Esurance Complete", policyNumber: "AI-2024-022", premium: 210, coverageAmount: 140000, expires: "2025-05-28", documents: 3, missingDocuments: [], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "TIAA Life", policyNumber: "LI-2024-023", premium: 130, coverageAmount: 600000, expires: "2025-06-30", documents: 4, missingDocuments: ["Medical Certificate"], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "USAA Homeowners", policyNumber: "HO-2024-024", premium: 125, coverageAmount: 275000, expires: "2025-07-14", documents: 5, missingDocuments: ["Income Certificate"], status: "Active", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "Generali Europe", policyNumber: "TI-2024-025", premium: 60, coverageAmount: 55000, expires: "2025-08-20", documents: 2, missingDocuments: ["Bank Statement"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },

  // More policies for enhanced pagination demonstration
  { type: "Health Insurance", insurer: "Kaiser Permanente Gold", policyNumber: "HI-2024-026", premium: 395, coverageAmount: 425000, expires: "2025-09-25", documents: 3, missingDocuments: [], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "Mercury Insurance", policyNumber: "AI-2024-027", premium: 185, coverageAmount: 110000, expires: "2025-10-30", documents: 4, missingDocuments: ["Photo ID"], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "New York Life", policyNumber: "LI-2024-028", premium: 145, coverageAmount: 800000, expires: "2025-11-15", documents: 2, missingDocuments: ["Medical Certificate"], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Amica Mutual", policyNumber: "HO-2024-029", premium: 160, coverageAmount: 400000, expires: "2024-12-20", documents: 5, missingDocuments: ["Address Proof"], status: "Expiring Soon", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "Seven Corners", policyNumber: "TI-2024-030", premium: 70, coverageAmount: 65000, expires: "2025-12-10", documents: 1, missingDocuments: ["Policy Document", "Photo ID"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
  { type: "Health Insurance", insurer: "Anthem Blue Cross", policyNumber: "HI-2024-031", premium: 465, coverageAmount: 525000, expires: "2025-01-25", documents: 4, missingDocuments: ["Income Certificate"], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "The Hartford", policyNumber: "AI-2024-032", premium: 235, coverageAmount: 165000, expires: "2025-02-18", documents: 3, missingDocuments: [], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "MassMutual", policyNumber: "LI-2024-033", premium: 125, coverageAmount: 550000, expires: "2025-03-22", documents: 2, missingDocuments: ["Address Proof"], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Erie Insurance", policyNumber: "HO-2024-034", premium: 145, coverageAmount: 375000, expires: "2025-04-12", documents: 4, missingDocuments: ["Policy Document"], status: "Active", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "RoamRight", policyNumber: "TI-2024-035", premium: 85, coverageAmount: 90000, expires: "2025-05-08", documents: 3, missingDocuments: ["Bank Statement"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
  { type: "Health Insurance", insurer: "Molina Healthcare", policyNumber: "HI-2024-036", premium: 315, coverageAmount: 325000, expires: "2025-06-14", documents: 2, missingDocuments: ["Medical Certificate", "Photo ID"], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "Safeco Insurance", policyNumber: "AI-2024-037", premium: 200, coverageAmount: 135000, expires: "2025-07-19", documents: 5, missingDocuments: ["Address Proof"], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "Thrivent Financial", policyNumber: "LI-2024-038", premium: 135, coverageAmount: 475000, expires: "2025-08-25", documents: 3, missingDocuments: [], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Homesite Insurance", policyNumber: "HO-2024-039", premium: 155, coverageAmount: 425000, expires: "2024-09-30", documents: 4, missingDocuments: ["Income Certificate"], status: "Expiring Soon", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "Travelex Insurance", policyNumber: "TI-2024-040", premium: 50, coverageAmount: 45000, expires: "2025-10-05", documents: 1, missingDocuments: ["Policy Document", "Address Proof", "Photo ID"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
  { type: "Health Insurance", insurer: "Centene Corporation", policyNumber: "HI-2024-041", premium: 285, coverageAmount: 300000, expires: "2025-11-08", documents: 3, missingDocuments: ["Bank Statement"], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "21st Century Insurance", policyNumber: "AI-2024-042", premium: 190, coverageAmount: 120000, expires: "2025-12-12", documents: 4, missingDocuments: ["Medical Certificate"], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "American National", policyNumber: "LI-2024-043", premium: 115, coverageAmount: 350000, expires: "2026-01-16", documents: 2, missingDocuments: ["Photo ID"], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Foremost Insurance", policyNumber: "HO-2024-044", premium: 170, coverageAmount: 475000, expires: "2025-02-20", documents: 5, missingDocuments: ["Policy Document"], status: "Active", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "Generali USA", policyNumber: "TI-2024-045", premium: 80, coverageAmount: 75000, expires: "2025-03-28", documents: 2, missingDocuments: [], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
  { type: "Health Insurance", insurer: "Oscar Health", policyNumber: "HI-2024-046", premium: 375, coverageAmount: 400000, expires: "2025-04-30", documents: 3, missingDocuments: ["Address Proof", "Income Certificate"], status: "Active", icon: "/icons/health-insurance.gif", iconBg: "bg-red-100", iconColor: "text-red-500" },
  { type: "Auto Insurance", insurer: "Elephant Insurance", policyNumber: "AI-2024-047", premium: 225, coverageAmount: 155000, expires: "2025-05-25", documents: 3, missingDocuments: ["Bank Statement"], status: "Active", icon: "/icons/auto-insurance.gif", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
  { type: "Life Insurance", insurer: "Pacific Life", policyNumber: "LI-2024-048", premium: 155, coverageAmount: 650000, expires: "2025-06-18", documents: 4, missingDocuments: ["Medical Certificate"], status: "Active", icon: "/icons/life-insurance.gif", iconBg: "bg-purple-100", iconColor: "text-purple-500" },
  { type: "Home Insurance", insurer: "Hagerty Insurance", policyNumber: "HO-2024-049", premium: 195, coverageAmount: 550000, expires: "2024-07-22", documents: 5, missingDocuments: ["Photo ID"], status: "Expiring Soon", icon: "/icons/home-insurance.gif", iconBg: "bg-green-100", iconColor: "text-green-500" },
  { type: "Travel Insurance", insurer: "AllClear Insurance", policyNumber: "TI-2024-050", premium: 90, coverageAmount: 85000, expires: "2025-08-14", documents: 3, missingDocuments: ["Address Proof"], status: "Active", icon: "/icons/travel-insurance.gif", iconBg: "bg-yellow-100", iconColor: "text-yellow-500" },
];

export const initialClaims: Claim[] = [
  {
    id: "CLM-001",
    policyNumber: "AI-2024-002",
    dateFiled: "Jul 22, 2024",
    dateOfIncident: "Jul 20, 2024",
    status: "Approved",
    agent: { name: "John Carter", avatar: "/icons/agent.gif" },
    updates: [
      { from: "agent", message: "Your claim has been received and is under review.", timestamp: "Jul 22, 2:30 PM" },
      { from: "agent", message: "We have reviewed the documents. The estimated settlement amount is $2,500.", timestamp: "Jul 24, 11:10 AM" },
      { from: "user", message: "Thank you for the update. When can I expect the payment?", timestamp: "Jul 24, 11:15 AM" },
      { from: "agent", message: "The payment has been processed and should reflect in your account within 3-5 business days. Your claim is now approved.", timestamp: "Jul 25, 9:00 AM" }
    ],
    user: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Springfield, IL 62701"
    },
    claimDetails: {
      incidentDescription: "Rear-end collision at intersection. Vehicle sustained damage to rear bumper and trunk.",
      incidentLocation: "Main St & Oak Ave, Springfield, IL",
      estimatedDamage: "$2,500",
      witnesses: "John Smith (555-987-6543), Mary Davis (555-456-7890)"
    },
    documents: [
      { id: "doc1", name: "Police Report.pdf", type: "pdf", url: "/documents/police-report.pdf", uploadedAt: "Jul 22, 2024" },
      { id: "doc2", name: "Damage Photos.zip", type: "zip", url: "/documents/damage-photos.zip", uploadedAt: "Jul 22, 2024" },
      { id: "doc3", name: "Repair Estimate.pdf", type: "pdf", url: "/documents/repair-estimate.pdf", uploadedAt: "Jul 23, 2024" }
    ]
  },
  {
    id: "CLM-002",
    policyNumber: "HI-2024-001",
    dateFiled: "Aug 05, 2024",
    dateOfIncident: "Aug 02, 2024",
    status: "Processing",
    agent: { name: "Maria Garcia", avatar: "/icons/agent.gif" },
    updates: [
      { from: "agent", message: "Claim received. Please ensure you have uploaded the hospital bills and the doctor's report.", timestamp: "Aug 05, 4:55 PM" }
    ],
    user: {
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 234-5678",
      address: "456 Oak St, Springfield, IL 62702"
    },
    claimDetails: {
      incidentDescription: "Fell and injured ankle while hiking. Required emergency room treatment and follow-up care.",
      incidentLocation: "Springfield National Park Trail, Springfield, IL",
      estimatedDamage: "$1,200 (medical expenses)",
      witnesses: "None present at the time of incident"
    },
    documents: [
      { id: "doc4", name: "Medical Report.pdf", type: "pdf", url: "/documents/medical-report.pdf", uploadedAt: "Aug 05, 2024" },
      { id: "doc5", name: "ER Bill.pdf", type: "pdf", url: "/documents/er-bill.pdf", uploadedAt: "Aug 05, 2024" }
    ]
  },
  {
    id: "CLM-003",
    policyNumber: "HO-2024-004",
    dateFiled: "Sep 01, 2024",
    dateOfIncident: "Aug 28, 2024",
    status: "Denied",
    agent: { name: "David Lee", avatar: "/icons/agent.gif" },
    updates: [
      { from: "agent", message: "Claim under review. A surveyor will contact you shortly.", timestamp: "Sep 01, 10:20 AM" },
      { from: "agent", message: "After reviewing the surveyor's report, we found the damage is not covered under your current policy terms. Unfortunately, we have to deny this claim.", timestamp: "Sep 03, 3:00 PM" }
    ],
    user: {
      name: "Emma Rodriguez",
      email: "emma.rodriguez@email.com",
      phone: "+1 (555) 345-6789",
      address: "789 Pine St, Springfield, IL 62703"
    },
    claimDetails: {
      incidentDescription: "Heavy rain caused flooding in basement. Water damaged flooring, walls, and stored items.",
      incidentLocation: "789 Pine St, Springfield, IL (basement)",
      estimatedDamage: "$5,000",
      witnesses: "Neighbor - Robert Wilson (555-567-8901)"
    },
    documents: [
      { id: "doc6", name: "Flood Photos.zip", type: "zip", url: "/documents/flood-photos.zip", uploadedAt: "Sep 01, 2024" },
      { id: "doc7", name: "Damage Assessment.pdf", type: "pdf", url: "/documents/damage-assessment.pdf", uploadedAt: "Sep 01, 2024" },
      { id: "doc8", name: "Weather Report.pdf", type: "pdf", url: "/documents/weather-report.pdf", uploadedAt: "Sep 02, 2024" }
    ]
  },
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAgentView, setIsAgentView] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [prePopulatedPolicy, setPrePopulatedPolicy] = useState<Policy | null>(null);

  // Define all actions using useCallback at the top level
  const openAddPolicy = useCallback(() => setModals(m => ({ ...m, addPolicyOpen: true })), []);
  const closeAddPolicy = useCallback(() => setModals(m => ({ ...m, addPolicyOpen: false })), []);
  const openPolicyOnboarding = useCallback((file?: File) => {
    setUploadedFile(file || null);
    setModals(m => ({ ...m, policyOnboardingOpen: true }));
  }, []);
  const openPolicyOnboardingWithData = useCallback((policy: Policy) => {
    setPrePopulatedPolicy(policy);
    setModals(m => ({ ...m, policyOnboardingOpen: true }));
  }, []);
  const closePolicyOnboarding = useCallback(() => {
    setModals(m => ({ ...m, policyOnboardingOpen: false }));
    setUploadedFile(null);
    setPrePopulatedPolicy(null);
  }, []);
  const openFileClaim = useCallback(() => setModals(m => ({ ...m, fileClaimOpen: true })), []);
  const closeFileClaim = useCallback(() => setModals(m => ({ ...m, fileClaimOpen: false })), []);
  const openClaimFiling = useCallback(() => setModals(m => ({ ...m, claimFilingOpen: true })), []);
  const closeClaimFiling = useCallback(() => setModals(m => ({ ...m, claimFilingOpen: false })), []);
  const addPolicy = useCallback((policy: Policy) => setPolicies(prev => [...prev, policy]), []);
  const addClaim = useCallback((claim: Claim) => setClaims(prev => [...prev, claim]), []);
  const appendClaimUpdate = useCallback((claimId: string, update: ClaimUpdate) => setClaims(prev => prev.map(c => c.id === claimId ? { ...c, updates: [...c.updates, update] } : c)), []);
  const updateClaimStatus = useCallback((claimId: string, status: string) => setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status } : c)), []);
  const login = useCallback((role: UserRole = "user") => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Set default page based on role
    if (role === "admin") {
      setActivePage("agentManagementPage");
    } else if (role === "agent") {
      setActivePage("policyManagementPage");
    } else {
      setActivePage("policyBankPage");
    }
  }, [setActivePage]);
  const logout = useCallback(() => setIsAuthenticated(false), []);
  const showLoginPage = useCallback(() => {
    setIsAuthenticated(false);
    setActivePage("loginPage");
  }, [setActivePage]);

  const actions: InsureActions = useMemo(() => ({
    setActivePage,
    setActivePolicyNumber,
    setIsAgentView,
    setUserRole,
    openAddPolicy,
    closeAddPolicy,
    openPolicyOnboarding,
    openPolicyOnboardingWithData,
    closePolicyOnboarding,
    openFileClaim,
    closeFileClaim,
    openClaimFiling,
    closeClaimFiling,
    setActiveClaimId,
    addPolicy,
    addClaim,
    appendClaimUpdate,
    updateClaimStatus,
    login,
    logout,
    showLoginPage,
  }), [setActivePage, setActivePolicyNumber, setActiveClaimId, openAddPolicy, closeAddPolicy, openPolicyOnboarding, openPolicyOnboardingWithData, closePolicyOnboarding, openFileClaim, closeFileClaim, openClaimFiling, closeClaimFiling, addPolicy, addClaim, appendClaimUpdate, updateClaimStatus, login, logout, showLoginPage]);

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
      isAgentView,
      userRole,
      prePopulatedPolicy,
      ...actions
    }),
    [policies, claims, activePage, activeClaimId, activePolicyNumber, modals, isAuthenticated, uploadedFile, isAgentView, userRole, prePopulatedPolicy, actions]
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



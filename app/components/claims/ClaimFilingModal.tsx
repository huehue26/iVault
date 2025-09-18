"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useInsure } from "../../store/insureStore";

interface ClaimData {
  selectedPolicyId: string | null;
  claimDetails: string;
  supportingDocs: File[];
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  incidentDetails: {
    description: string;
    location: string;
    damageAmount: string;
    witnesses: string;
  };
}

const stepTitles = [
  "Select a Policy",
  "Describe Claim Details", 
  "Upload Supporting Documents",
  "Review & Submit"
];

export default function ClaimFilingModal() {
  const { modals, closeClaimFiling, addClaim, policies } = useInsure();
  const [currentStep, setCurrentStep] = useState(1);
  const [claimData, setClaimData] = useState<ClaimData>({
    selectedPolicyId: null,
    claimDetails: '',
    supportingDocs: [],
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    incidentDetails: {
      description: '',
      location: '',
      damageAmount: '',
      witnesses: ''
    }
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;

  // Reset modal when opened
  useEffect(() => {
    if (modals.claimFilingOpen) {
      setCurrentStep(1);
      setClaimData({
        selectedPolicyId: null,
        claimDetails: '',
        supportingDocs: [],
        personalInfo: {
          name: '',
          email: '',
          phone: '',
          address: ''
        },
        incidentDetails: {
          description: '',
          location: '',
          damageAmount: '',
          witnesses: ''
        }
      });
      setExpandedSections({});
    }
  }, [modals.claimFilingOpen]);

  const updateClaimData = useCallback((updates: Partial<ClaimData>) => {
    setClaimData(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const selectedPolicy = policies.find(p => p.policyNumber === claimData.selectedPolicyId);
    if (!selectedPolicy) return;

    // Create a new claim object
    const newClaim = {
      id: `CLM-${Date.now()}`,
      policyNumber: selectedPolicy.policyNumber,
      dateFiled: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dateOfIncident: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Processing" as const,
      agent: { 
        name: "Sarah Johnson", 
        avatar: "https://placehold.co/40x40/60A5FA/FFFFFF?text=SJ" 
      },
      updates: [
        { 
          from: "agent" as const, 
          message: "Your claim has been received and is under review.", 
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        }
      ],
      user: {
        name: claimData.personalInfo?.name || "Unknown User",
        email: claimData.personalInfo?.email || "unknown@email.com",
        phone: claimData.personalInfo?.phone || "Unknown",
        address: claimData.personalInfo?.address || "Unknown Address"
      },
      claimDetails: {
        incidentDescription: claimData.incidentDetails?.description || "No description provided",
        incidentLocation: claimData.incidentDetails?.location || "Unknown location",
        estimatedDamage: claimData.incidentDetails?.damageAmount || "Unknown",
        witnesses: claimData.incidentDetails?.witnesses || "None"
      },
      documents: []
    };

    addClaim(newClaim);
    closeClaimFiling();
  }, [claimData, policies, addClaim, closeClaimFiling]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    } else {
      // Submit the claim
      handleSubmit();
    }
  }, [currentStep, goToStep, handleSubmit]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    updateClaimData({
      supportingDocs: [...claimData.supportingDocs, ...files]
    });
  }, [claimData.supportingDocs, updateClaimData]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      updateClaimData({
        supportingDocs: [...claimData.supportingDocs, ...Array.from(files)]
      });
    }
  }, [claimData.supportingDocs, updateClaimData]);

  const removeFile = useCallback((index: number) => {
    const newFiles = claimData.supportingDocs.filter((_, i) => i !== index);
    updateClaimData({ supportingDocs: newFiles });
  }, [claimData.supportingDocs, updateClaimData]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return claimData.selectedPolicyId !== null;
      case 2: return claimData.claimDetails.trim() !== '';
      case 3: return true; // Documents are optional
      case 4: return true;
      default: return false;
    }
  };

  if (!modals.claimFilingOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/icons/headset.gif" alt="Headset" className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">iVault Claim Assistance</h2>
            </div>
            <button onClick={closeClaimFiling} className="text-gray-600 hover:text-gray-800 text-3xl font-light">
              &times;
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{stepTitles[currentStep - 1]}</h3>
            <span className="text-sm text-gray-700 font-medium">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="relative">
            <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-600 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="relative flex items-center justify-between">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
                <div key={step} className="step-indicator text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                    step < currentStep 
                      ? 'bg-blue-600 text-white border-white' 
                      : step === currentStep 
                        ? 'bg-blue-600 text-white border-blue-200 ring-2 ring-blue-500'
                        : 'bg-gray-300 text-gray-600 border-white'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    step <= currentStep ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  }`}>
                    {['Select Policy', 'Details', 'Documents', 'Review'][step - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Step 1: Select Policy */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {policies.map(policy => (
                <div
                  key={policy.policyNumber}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    claimData.selectedPolicyId === policy.policyNumber
                      ? 'border-blue-500 bg-blue-50 transform -translate-y-1 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => updateClaimData({ selectedPolicyId: policy.policyNumber })}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center rounded-lg">
                      <img src={policy.icon} alt={policy.type} className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{policy.type}</h3>
                      <p className="text-sm text-gray-700">{policy.insurer} - {policy.policyNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Describe Claim Details */}
          {currentStep === 2 && (
            <div className="relative">
              <textarea
                id="claim-details-text"
                placeholder=" "
                rows={10}
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 pt-5 text-gray-900"
                value={claimData.claimDetails}
                onChange={(e) => updateClaimData({ claimDetails: e.target.value })}
              />
              <label htmlFor="claim-details-text" className="absolute left-4 top-0 text-xs text-blue-600 bg-white px-1 -translate-y-1/2">
                Please describe the incident and claim details...
              </label>
            </div>
          )}

          {/* Step 3: Upload Supporting Documents */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  multiple
                  onChange={handleFileInputChange}
                />
                <div className="flex flex-col items-center text-gray-700">
                  <img src="/icons/upload-cloud.gif" alt="Upload" className="w-20 h-20 mix-blend-multiply" />
                  <p className="font-semibold text-lg text-gray-700">Drag & drop supporting documents</p>
                  <p className="text-gray-700 mt-1">or</p>
                  <button type="button" className="mt-4 text-sm font-semibold text-blue-600 hover:underline">
                    Browse from your device
                  </button>
                </div>
              </div>

              {/* File Preview */}
              {claimData.supportingDocs.length > 0 && (
                <div className="mt-6 space-y-3">
                  {claimData.supportingDocs.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src="/icons/file-uploaded.gif" alt="PDF" className="w-8 h-8 mix-blend-multiply" />
                        <span className="font-medium truncate text-sm text-gray-800">{file.name}</span>
                        <span className="text-gray-600 text-xs font-semibold flex-shrink-0">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0 ml-4"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg">
                <button 
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('policy')}
                >
                  <h4 className="font-semibold text-gray-900">Selected Policy</h4>
                  <i className={`fa-solid fa-chevron-down transition-transform duration-200 text-gray-700 ${
                    expandedSections['policy'] ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {expandedSections['policy'] && (
                  <div className="px-4 pb-4 border-t">
                    {(() => {
                      const selectedPolicy = policies.find(p => p.policyNumber === claimData.selectedPolicyId);
                      return selectedPolicy ? (
                        <div className="pt-4">
                          <h3 className="font-bold text-gray-800">{selectedPolicy.type}</h3>
                          <p className="text-sm text-gray-700">{selectedPolicy.insurer} - {selectedPolicy.policyNumber}</p>
                          <button 
                            className="text-sm text-blue-600 font-semibold hover:underline mt-2"
                            onClick={() => goToStep(1)}
                          >
                            Edit
                          </button>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
              
              <div className="border border-gray-200 rounded-lg">
                <button 
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('details')}
                >
                  <h4 className="font-semibold text-gray-900">Claim Details</h4>
                  <i className={`fa-solid fa-chevron-down transition-transform duration-200 text-gray-700 ${
                    expandedSections['details'] ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {expandedSections['details'] && (
                  <div className="px-4 pb-4 border-t">
                    <p className="text-gray-700 whitespace-pre-wrap pt-4">{claimData.claimDetails}</p>
                    <button 
                      className="text-sm text-blue-600 font-semibold hover:underline mt-4"
                      onClick={() => goToStep(2)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button 
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('documents')}
                >
                  <h4 className="font-semibold text-gray-900">Supporting Documents</h4>
                  <i className={`fa-solid fa-chevron-down transition-transform duration-200 text-gray-700 ${
                    expandedSections['documents'] ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {expandedSections['documents'] && (
                  <div className="px-4 pb-4 border-t">
                    <ul className="space-y-2 pt-4">
                      {claimData.supportingDocs.length > 0 ? (
                        claimData.supportingDocs.map((file, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-gray-700">{file.name}</span>
                            <img src="/icons/check-circle.gif" alt="Check" className="w-5 h-5 text-green-500" />
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-700 py-2">No supporting documents uploaded.</li>
                      )}
                    </ul>
                    <button 
                      className="text-sm text-blue-600 font-semibold hover:underline mt-4"
                      onClick={() => goToStep(3)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={`${currentStep === 1 ? 'justify-end' : 'justify-between'} p-6 bg-gray-50 border-t flex items-center`}>
          <button
            onClick={prevStep}
            className={`${currentStep === 1 ? 'hidden' : 'visible'} flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Previous</span>
          </button>
          
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            <span>{currentStep === totalSteps ? 'Submit Claim' : 'Next'}</span>
            {currentStep === totalSteps ? (
              <i className="fa-solid fa-check ml-2"></i>
            ) : (
              <i className="fa-solid fa-arrow-right ml-2"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

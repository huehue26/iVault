"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useInsure } from "../../store/insureStore";

interface PolicyData {
  policyFile: File | null;
  policyType: string | null;
  questions: Record<string, string>;
  additionalDocs: Record<string, File>;
}

interface Question {
  id: string;
  label: string;
  type: 'text' | 'radio';
  options?: string[];
}

const questions: Record<string, Question[]> = {
  Health: [
    { id: 'policyHolder', label: 'Full Name of Policy Holder', type: 'text' },
    { id: 'dob', label: 'Date of Birth', type: 'text' },
    { id: 'coverageType', label: 'Who is this policy for?', type: 'radio', options: ['Myself Only', 'My Family', 'My Parents'] },
    { id: 'preExistingConditions', label: 'Any pre-existing medical conditions?', type: 'radio', options: ['Yes', 'No'] }
  ],
  Auto: [
    { id: 'vehicleModel', label: 'Vehicle Make & Model', type: 'text' },
    { id: 'vehicleYear', label: 'Year of Manufacture', type: 'text' },
    { id: 'licenseNumber', label: 'Driving License Number', type: 'text' },
    { id: 'claimsInPast', label: 'Any claims in the past 3 years?', type: 'radio', options: ['Yes', 'No'] }
  ],
  Home: [
    { id: 'propertyAddress', label: 'Full Property Address', type: 'text' },
    { id: 'propertyType', label: 'What type of property is it?', type: 'radio', options: ['Apartment', 'Independent House', 'Villa'] },
    { id: 'ownership', label: 'Property Ownership', type: 'radio', options: ['Owned', 'Rented'] },
    { id: 'yearBuilt', label: 'Year the property was built', type: 'text' }
  ],
  Life: [
    { id: 'insuredPerson', label: 'Full Name of the Person Insured', type: 'text' },
    { id: 'coverageAmount', label: 'What is the coverage amount (Sum Assured)?', type: 'text' },
    { id: 'nomineeName', label: 'Nominee\'s Full Name', type: 'text' },
    { id: 'nomineeRelationship', label: 'Relationship with Nominee', type: 'radio', options: ['Spouse', 'Child', 'Parent', 'Other'] }
  ],
  Travel: [
    { id: 'destination', label: 'Country/Countries of Travel', type: 'text' },
    { id: 'tripStartDate', label: 'Trip Start Date', type: 'text' },
    { id: 'tripEndDate', label: 'Trip End Date', type: 'text' },
    { id: 'tripType', label: 'What is the nature of your trip?', type: 'radio', options: ['Leisure', 'Business', 'Student', 'Other'] }
  ],
  Other: [
    { id: 'policyDescription', label: 'Brief Policy Description', type: 'text' },
    { id: 'providerName', label: 'Name of the Insurance Provider', type: 'text' }
  ]
};

const requiredDocs: Record<string, Array<{ key: string; name: string }>> = {
  Health: [{ key: 'photoId', name: 'Photo ID' }, { key: 'addressProof', name: 'Address Proof' }],
  Auto: [{ key: 'rc', name: 'Vehicle Registration (RC)' }, { key: 'license', name: 'Driving License' }],
  Home: [{ key: 'ownership', name: 'Property Ownership Document' }, { key: 'tax', name: 'Latest Property Tax Receipt' }],
  Life: [{ key: 'ageProof', name: 'Age Proof' }, { key: 'photoId', name: 'Photo ID' }],
  Travel: [{ key: 'passport', name: 'Passport Copy' }, { key: 'visa', name: 'Visa Copy' }],
  Other: []
};

const stepTitles = [
  "Upload Your Policy Document",
  "Select Policy Type", 
  "Provide Details",
  "Upload Supporting Documents",
  "Review & Submit"
];

export default function PolicyOnboardingModal() {
  const { modals, closePolicyOnboarding, addPolicy, uploadedFile } = useInsure();
  const [currentStep, setCurrentStep] = useState(1);
  const [policyData, setPolicyData] = useState<PolicyData>({
    policyFile: null,
    policyType: null,
    questions: {},
    additionalDocs: {}
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [docDragOver, setDocDragOver] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  // Reset modal when opened
  useEffect(() => {
    if (modals.policyOnboardingOpen) {
      // If a file was uploaded via drag and drop, skip to step 2
      if (uploadedFile) {
        setCurrentStep(2);
        setPolicyData({
          policyFile: uploadedFile,
          policyType: null,
          questions: {},
          additionalDocs: {}
        });
      } else {
        setCurrentStep(1);
        setPolicyData({
          policyFile: null,
          policyType: null,
          questions: {},
          additionalDocs: {}
        });
      }
    }
  }, [modals.policyOnboardingOpen, uploadedFile]);

  const updatePolicyData = useCallback((updates: Partial<PolicyData>) => {
    setPolicyData(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    } else {
      // Submit the policy
      handleSubmit();
    }
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const handleFileUpload = useCallback((file: File) => {
    updatePolicyData({ policyFile: file });
    // Auto-advance to step 2 after file upload
    setTimeout(() => goToStep(2), 500);
  }, [updatePolicyData, goToStep]);

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
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDocDragOver = useCallback((e: React.DragEvent, docKey: string) => {
    e.preventDefault();
    setDocDragOver(prev => ({ ...prev, [docKey]: true }));
  }, []);

  const handleDocDragLeave = useCallback((e: React.DragEvent, docKey: string) => {
    e.preventDefault();
    setDocDragOver(prev => ({ ...prev, [docKey]: false }));
  }, []);

  const handleDocDrop = useCallback((e: React.DragEvent, docKey: string) => {
    e.preventDefault();
    setDocDragOver(prev => ({ ...prev, [docKey]: false }));
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      updatePolicyData({
        additionalDocs: {
          ...policyData.additionalDocs,
          [docKey]: files[0]
        }
      });
    }
  }, [policyData.additionalDocs, updatePolicyData]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    // Create a new policy object
    const newPolicy = {
      type: `${policyData.policyType} Insurance`,
      insurer: policyData.questions.providerName || `${policyData.policyType} Provider`,
      policyNumber: `${policyData.policyType?.substring(0, 2).toUpperCase()}-${Date.now()}`,
      premium: Math.floor(Math.random() * 500) + 50, // Random premium for demo
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documents: 1 + Object.keys(policyData.additionalDocs).length,
      status: "Active" as const,
      icon: getPolicyIcon(policyData.policyType || ''),
      iconBg: getPolicyIconBg(policyData.policyType || ''),
      iconColor: getPolicyIconColor(policyData.policyType || '')
    };

    addPolicy(newPolicy);
    closePolicyOnboarding();
  }, [policyData, addPolicy, closePolicyOnboarding]);

  const getPolicyIcon = (type: string) => {
    const icons: Record<string, string> = {
      Health: "fa-solid fa-heart-pulse",
      Auto: "fa-solid fa-car",
      Home: "fa-solid fa-home",
      Life: "fa-solid fa-user-shield",
      Travel: "fa-solid fa-plane",
      Other: "fa-solid fa-file-invoice"
    };
    return icons[type] || "fa-solid fa-file-invoice";
  };

  const getPolicyIconBg = (type: string) => {
    const backgrounds: Record<string, string> = {
      Health: "bg-red-100",
      Auto: "bg-blue-100",
      Home: "bg-green-100",
      Life: "bg-blue-100",
      Travel: "bg-yellow-100",
      Other: "bg-gray-100"
    };
    return backgrounds[type] || "bg-gray-100";
  };

  const getPolicyIconColor = (type: string) => {
    const colors: Record<string, string> = {
      Health: "text-red-500",
      Auto: "text-blue-500",
      Home: "text-green-500",
      Life: "text-blue-500",
      Travel: "text-yellow-500",
      Other: "text-gray-700"
    };
    return colors[type] || "text-gray-700";
  };

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return policyData.policyFile !== null;
      case 2: return policyData.policyType !== null;
      case 3: return true; // Questions are optional
      case 4: return true; // Documents are optional
      case 5: return true;
      default: return false;
    }
  };

  if (!modals.policyOnboardingOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <i className="fa-solid fa-shield-halved text-blue-600 text-2xl"></i>
              <h2 className="text-2xl font-bold text-gray-900">iVault Policy Onboarding</h2>
            </div>
            <button onClick={closePolicyOnboarding} className="text-gray-600 hover:text-gray-600 text-3xl font-light">
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
                    {['Upload', 'Type', 'Details', 'Docs', 'Review'][step - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Step 1: Upload Policy */}
          {currentStep === 1 && (
            <div className="text-center">
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
                  onChange={handleFileInputChange}
                />
                <div className="flex flex-col items-center text-gray-700">
                  <svg className="w-16 h-16 mb-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <p className="font-semibold text-lg text-gray-700">Drag & drop your policy file</p>
                  <p className="text-gray-700 mt-1">or</p>
                  <button type="button" className="mt-4 text-sm font-semibold text-blue-600 hover:underline">
                    Browse from your device
                  </button>
                </div>
              </div>
              {policyData.policyFile && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-file-pdf text-red-500 text-xl"></i>
                    <span className="font-medium text-green-800">{policyData.policyFile.name}</span>
                    <span className="text-green-600 text-xs ml-auto font-semibold">
                      {(policyData.policyFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Policy Type */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Health', 'Auto', 'Home', 'Life', 'Travel', 'Other'].map(type => (
                <div
                  key={type}
                  className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    policyData.policyType === type
                      ? 'border-blue-500 bg-blue-50 transform -translate-y-1 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => updatePolicyData({ policyType: type })}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 ${
                    type === 'Health' ? 'text-red-500' :
                    type === 'Auto' ? 'text-blue-500' :
                    type === 'Home' ? 'text-green-500' :
                    type === 'Life' ? 'text-blue-500' :
                    type === 'Travel' ? 'text-yellow-500' : 'text-gray-700'
                  }`}>
                    {type === 'Health' && <i className="fa-solid fa-heart-pulse text-2xl"></i>}
                    {type === 'Auto' && <i className="fa-solid fa-car text-2xl"></i>}
                    {type === 'Home' && <i className="fa-solid fa-home text-2xl"></i>}
                    {type === 'Life' && <i className="fa-solid fa-user-shield text-2xl"></i>}
                    {type === 'Travel' && <i className="fa-solid fa-plane text-2xl"></i>}
                    {type === 'Other' && <i className="fa-solid fa-file-invoice text-2xl"></i>}
                  </div>
                  <p className="font-semibold text-gray-700">{type}</p>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Questions */}
          {currentStep === 3 && policyData.policyType && (
            <div className="space-y-6">
              {questions[policyData.policyType]?.map(q => (
                <div key={q.id}>
                  {q.type === 'text' ? (
                    <div className="relative">
                      <input
                        type="text"
                        id={q.id}
                        placeholder=" "
                        className="w-full px-4 py-3 pt-5 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                        onChange={(e) => updatePolicyData({
                          questions: { ...policyData.questions, [q.id]: e.target.value }
                        })}
                      />
                      <label htmlFor={q.id} className="absolute left-4 top-0 text-xs text-blue-600 bg-white px-1 -translate-y-1/2">
                        {q.label}
                      </label>
                    </div>
                  ) : (
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">{q.label}</p>
                      <div className="space-y-2">
                        {q.options?.map((option, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              id={`${q.id}-${index}`}
                              name={q.id}
                              type="radio"
                              value={option}
                              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                              onChange={(e) => updatePolicyData({
                                questions: { ...policyData.questions, [q.id]: e.target.value }
                              })}
                            />
                            <label htmlFor={`${q.id}-${index}`} className="ml-3 block text-sm font-medium text-gray-700">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Additional Documents */}
          {currentStep === 4 && policyData.policyType && (
            <div className="space-y-4">
              {requiredDocs[policyData.policyType]?.length === 0 ? (
                <p className="text-center text-gray-700">No additional documents required for this policy type.</p>
              ) : (
                requiredDocs[policyData.policyType]?.map(doc => (
                  <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{doc.name}</span>
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                        policyData.additionalDocs[doc.key] 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {policyData.additionalDocs[doc.key] ? 'Uploaded' : 'Required'}
                      </span>
                    </div>
                    
                    {policyData.additionalDocs[doc.key] ? (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <i className="fa-solid fa-file-pdf text-red-500 text-xl"></i>
                            <span className="font-medium text-green-800">{policyData.additionalDocs[doc.key].name}</span>
                            <span className="text-green-600 text-xs font-semibold">
                              {(policyData.additionalDocs[doc.key].size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              const newDocs = { ...policyData.additionalDocs };
                              delete newDocs[doc.key];
                              updatePolicyData({ additionalDocs: newDocs });
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={`mt-3 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          docDragOver[doc.key] 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                        onDragOver={(e) => handleDocDragOver(e, doc.key)}
                        onDragLeave={(e) => handleDocDragLeave(e, doc.key)}
                        onDrop={(e) => handleDocDrop(e, doc.key)}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf,.doc,.docx,.jpg,.png';
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files && files[0]) {
                              updatePolicyData({
                                additionalDocs: {
                                  ...policyData.additionalDocs,
                                  [doc.key]: files[0]
                                }
                              });
                            }
                          };
                          input.click();
                        }}
                      >
                        <div className="flex flex-col items-center text-gray-700">
                          <svg className="w-12 h-12 mb-3 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                          </svg>
                          <p className="font-semibold text-gray-700">Drag & drop {doc.name.toLowerCase()}</p>
                          <p className="text-gray-700 mt-1">or</p>
                          <button type="button" className="mt-2 text-sm font-semibold text-blue-600 hover:underline">
                            Click to browse
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg">
                <button 
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('policy-type')}
                >
                  <h4 className="font-semibold text-gray-900">Policy Type</h4>
                  <i className={`fa-solid fa-chevron-down transition-transform duration-200 text-gray-700 ${
                    expandedSections['policy-type'] ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {expandedSections['policy-type'] && (
                  <div className="px-4 pb-4 border-t">
                    <p className="text-gray-800 pt-4">{policyData.policyType} Insurance</p>
                    <button 
                      className="text-sm text-blue-600 font-semibold hover:underline mt-2"
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
                  onClick={() => toggleSection('details')}
                >
                  <h4 className="font-semibold text-gray-900">Details</h4>
                  <i className={`fa-solid fa-chevron-down transition-transform duration-200 text-gray-700 ${
                    expandedSections['details'] ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {expandedSections['details'] && (
                  <div className="px-4 pb-4 border-t">
                    <dl className="space-y-2 pt-4">
                      {Object.entries(policyData.questions).map(([key, value]) => {
                        const question = questions[policyData.policyType || '']?.find(q => q.id === key);
                        return (
                          <div key={key} className="flex justify-between">
                            <dt className="text-gray-700">{question?.label || key}</dt>
                            <dd className="font-medium text-gray-900 text-right">{value}</dd>
                          </div>
                        );
                      })}
                    </dl>
                    <button 
                      className="text-sm text-blue-600 font-semibold hover:underline mt-4"
                      onClick={() => goToStep(3)}
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
                  <h4 className="font-semibold text-gray-900">Documents</h4>
                  <i className={`fa-solid fa-chevron-down transition-transform duration-200 text-gray-700 ${
                    expandedSections['documents'] ? 'rotate-180' : ''
                  }`}></i>
                </button>
                {expandedSections['documents'] && (
                  <div className="px-4 pb-4 border-t">
                    <ul className="space-y-2 pt-4">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-700">Main Policy Document</span>
                        <i className="fa-solid fa-check-circle text-green-500"></i>
                      </li>
                      {Object.entries(policyData.additionalDocs).map(([key, file]) => {
                        const docName = requiredDocs[policyData.policyType || '']?.find(d => d.key === key)?.name || key;
                        return (
                          <li key={key} className="flex items-center justify-between">
                            <span className="text-gray-700">{docName}</span>
                            <i className="fa-solid fa-check-circle text-green-500"></i>
                          </li>
                        );
                      })}
                    </ul>
                    <button 
                      className="text-sm text-blue-600 font-semibold hover:underline mt-4"
                      onClick={() => goToStep(4)}
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
        <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Previous</span>
          </button>
          
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            <span>{currentStep === totalSteps ? 'Submit Application' : 'Next'}</span>
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

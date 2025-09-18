"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useInsure, formatDate, Policy } from "../../store/insureStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface GroupMember {
  id: number;
  name: string;
  code: string;
  relationship: string;
}

interface PolicyFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: 'core' | 'additional';
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <span className="text-sm font-bold text-blue-700">{(value/10).toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function PolicyDetails() {
  const { activePolicyNumber, policies, setActivePage, setActivePolicyNumber, isAgentView, setIsAgentView, openPolicyOnboardingWithData } = useInsure();
  // Temporarily hardcode to true until roles integration
  const agentViewEnabled = true; // TODO: Replace with proper role checking
  const policy = policies.find(p => p.policyNumber === activePolicyNumber);


  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; sizeKb: number; url?: string; mime?: string }[]>([
    { name: "Policy_Document.pdf", sizeKb: 128, url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", mime: "application/pdf" },
    { name: "Vehicle_Photo.jpg", sizeKb: 256, url: "https://placehold.co/1024x768?text=Vehicle+Photo", mime: "image/jpeg" },
  ]);
  const [missingDocs] = useState<string[]>(["Policy Document", "Photo ID", "Address Proof"]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMime, setPreviewMime] = useState<string | undefined>(undefined);
  // Tab management state
  const [activeTab, setActiveTab] = useState<'features' | 'groups'>('features');

  // Agent edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState<Partial<Policy> | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize edited policy when policy changes
  useEffect(() => {
    if (policy) {
      setEditedPolicy({ ...policy });
    }
  }, [policy]);

  // Handle save policy changes
  const handleSavePolicy = () => {
    // In a real app, this would update the policy in the backend
    console.log('Saving policy:', editedPolicy);
    if (editedPolicy?.policyNumber) {
      setSuccessMessage(`Policy ${editedPolicy.policyNumber} updated successfully`);
    } else {
      setSuccessMessage('Policy updated successfully');
    }
    setIsEditMode(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle cancel policy edit
  const handleCancelPolicyEdit = () => {
    setEditedPolicy({ ...policy });
    setIsEditMode(false);
  };
  
  // Feature management state
  const [policyFeatures, setPolicyFeatures] = useState<PolicyFeature[]>([
    { id: 1, title: 'In-patient Hospitalization', description: 'Covers room rent, ICU charges, doctor\'s fees, and other related expenses.', icon: '/icons/hospital-doctor.gif', category: 'core' },
    { id: 2, title: 'Pre & Post-Hospitalization', description: 'Covers medical expenses for 60 days before and 90 days after hospitalization.', icon: '/icons/notes-medical.gif', category: 'core' },
    { id: 3, title: 'Day Care Procedures', description: 'Covers medical treatments that do not require 24-hour hospitalization.', icon: '/icons/clock.gif', category: 'core' },
    { id: 4, title: 'Maternity and Newborn Care', description: 'Coverage for childbirth and newborn baby expenses up to $5,000.', icon: '/icons/baby.gif', category: 'additional' }
  ]);
  const [editingFeatureId, setEditingFeatureId] = useState<number | null>(null);
  const [featureValidationErrors, setFeatureValidationErrors] = useState<{[key: string]: string}>({});

  // Group management state
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { id: 1, name: 'John Doe', code: 'GRP-001-JD', relationship: 'Spouse' },
    { id: 2, name: 'Jane Doe', code: 'GRP-002-JD', relationship: 'Child' },
    { id: 3, name: 'Sam Smith', code: 'GRP-003-SS', relationship: 'Dependent Parent' }
  ]);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Relationship options
  const relationshipOptions = [
    'Spouse',
    'Child',
    'Dependent Parent',
    'Sibling',
    'Other Dependent'
  ];
  
  const missingStatus = useMemo(() => {
    return missingDocs
      .map(req => ({ name: req, satisfied: uploadedDocs.some(u => u.name.toLowerCase().includes(req.toLowerCase().split(" ")[0])) }))
      .filter(item => !item.satisfied);
  }, [missingDocs, uploadedDocs]);

  function openPreview(url?: string, mime?: string) { if (!url) return; setPreviewUrl(url); setPreviewMime(mime); }
  function closePreview() { setPreviewUrl(null); setPreviewMime(undefined); }

  // Group management functions
  const validateMember = (member: Partial<GroupMember>) => {
    const errors: {[key: string]: string} = {};
    
    if (!member.name || member.name.trim() === '') {
      errors.name = 'Name is required';
    }
    if (!member.code || member.code.trim() === '') {
      errors.code = 'Group Member Code is required';
    }
    if (!member.relationship || member.relationship.trim() === '') {
      errors.relationship = 'Relationship is required';
    }
    
    return errors;
  };

  const handleEditMember = (id: number) => {
    setEditingMemberId(id);
    setValidationErrors({});
  };

  const handleSaveMember = (id: number, field: keyof GroupMember, value: string) => {
    setGroupMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveEdit = (id: number) => {
    const member = groupMembers.find(m => m.id === id);
    if (!member) return;
    
    const errors = validateMember(member);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setEditingMemberId(null);
    setValidationErrors({});
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setValidationErrors({});
  };

  const handleDeleteMember = (id: number) => {
    setGroupMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleAddMember = () => {
    const newId = groupMembers.length ? Math.max(...groupMembers.map(m => m.id)) + 1 : 1;
    const newMember: GroupMember = {
      id: newId,
      name: '',
      code: '',
      relationship: ''
    };
    setGroupMembers(prev => [...prev, newMember]);
    setEditingMemberId(newId);
    setValidationErrors({});
  };

  // Feature management functions
  const validateFeature = (feature: Partial<PolicyFeature>) => {
    const errors: {[key: string]: string} = {};

    if (!feature.title || feature.title.trim() === '') {
      errors.title = 'Title is required';
    }
    if (!feature.description || feature.description.trim() === '') {
      errors.description = 'Description is required';
    }
    if (!feature.category) {
      errors.category = 'Category is required';
    }

    return errors;
  };

  const handleEditFeature = (id: number) => {
    setEditingFeatureId(id);
    setFeatureValidationErrors({});
  };

  const handleSaveFeature = (id: number, field: keyof PolicyFeature, value: string) => {
    setPolicyFeatures(prev => prev.map(feature =>
      feature.id === id ? { ...feature, [field]: value } : feature
    ));

    // Clear validation error for this field
    if (featureValidationErrors[field]) {
      setFeatureValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveFeatureEdit = (id: number) => {
    const feature = policyFeatures.find(f => f.id === id);
    if (!feature) return;

    const errors = validateFeature(feature);
    if (Object.keys(errors).length > 0) {
      setFeatureValidationErrors(errors);
      return;
    }

    setEditingFeatureId(null);
    setFeatureValidationErrors({});
  };

  const handleCancelFeatureEdit = () => {
    setEditingFeatureId(null);
    setFeatureValidationErrors({});
  };

  const handleDeleteFeature = (id: number) => {
    setPolicyFeatures(prev => prev.filter(feature => feature.id !== id));
  };

  const handleAddFeature = () => {
    const newId = policyFeatures.length ? Math.max(...policyFeatures.map(f => f.id)) + 1 : 1;
    const newFeature: PolicyFeature = {
      id: newId,
      title: '',
      description: '',
      icon: '/icons/shield.gif', // Default icon
      category: 'core'
    };
    setPolicyFeatures(prev => [...prev, newFeature]);
    setEditingFeatureId(newId);
    setFeatureValidationErrors({});
  };

  if (!policy) return null;

  return (
    <main className="page-content p-8 animate-fade-in">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => { setActivePolicyNumber(null); setIsAgentView(false); setActivePage(isAgentView ? "policyManagementPage" : "policyBankPage"); }} className="text-gray-700 hover:text-gray-800 mr-3">
            <i className="fa-solid fa-arrow-left text-lg" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Policy Details</h1>
        </div>
        {agentViewEnabled && (
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <button
                  onClick={handleCancelPolicyEdit}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePolicy}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Primary Action - Edit Policy */}
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 text-sm font-medium"
                >
                  <i className="fa-solid fa-edit"></i>
                  Edit Policy
                </button>

                {/* Approval Action - Approve */}
                <button
                  onClick={() => {
                    console.log('Approving policy:', policy?.policyNumber);
                    setSuccessMessage(`Policy ${policy?.policyNumber} has been approved successfully`);
                    setTimeout(() => setSuccessMessage(""), 3000);
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 text-sm font-medium"
                >
                  <i className="fa-solid fa-check"></i>
                  Approve
                </button>

                {/* Secondary Action - Retrigger Insights */}
                <button
                  onClick={() => {
                    console.log('Retriggering insights for policy:', policy?.policyNumber);
                    setSuccessMessage(`Insights retriggered for policy ${policy?.policyNumber}`);
                    setTimeout(() => setSuccessMessage(""), 3000);
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 text-sm font-medium"
                >
                  <i className="fa-solid fa-refresh"></i>
                  Retrigger Insights
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-slide-up">
          <i className="fa-solid fa-check-circle text-green-600"></i>
          <span className="text-green-800 font-medium">{successMessage}</span>
        </div>
      )}

      <div className="p-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-start animate-slide-up">
            <div className="flex items-start space-x-5">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center`}>
                <img src={policy.icon} alt="Clock" className="w-14 h-14" />
              </div>
              <div>
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedPolicy?.type || ''}
                      onChange={(e) => setEditedPolicy({ ...editedPolicy, type: e.target.value })}
                      className="text-2xl font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                      placeholder="Policy Type"
                    />
                    <input
                      type="text"
                      value={editedPolicy?.policyNumber || ''}
                      onChange={(e) => setEditedPolicy({ ...editedPolicy, policyNumber: e.target.value })}
                      className="text-gray-700 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                      placeholder="Policy Number"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800">{policy.type}</h2>
                    <p className="text-gray-700">Policy No: {policy.policyNumber}</p>
                  </>
                )}
              </div>
            </div>
            <div className="text-center">
              <button 
                className="mt-1 w-12 h-12 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                onClick={() => {
                  // Download policy documents
                  console.log('Downloading policy documents...');
                }}
                title="Download Policy Documents"
              >
                <i className="fa-solid fa-download text-2xl group-hover:animate-bounce"></i>
              </button>
            </div>
          </div>

          {/* Policy Details Section */}
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 gap-3">
              {/* Basic Information Card */}
              <div className="bg-gray-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <img src="/icons/file-invoice.gif" alt="Policy" className="w-10 h-10 mix-blend-multiply" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
                    <p className="text-sm text-gray-600">Policy fundamentals</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Expiry Date:</span>
                    {isEditMode ? (
                      <input
                        type="date"
                        value={editedPolicy?.expires || ''}
                        onChange={(e) => setEditedPolicy({ ...editedPolicy, expires: e.target.value })}
                        className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{formatDate(policy.expires)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Insurance Provider:</span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editedPolicy?.insurer || ''}
                        onChange={(e) => setEditedPolicy({ ...editedPolicy, insurer: e.target.value })}
                        className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                        placeholder="Insurance Provider"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{policy.insurer}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Status:</span>
                    {isEditMode ? (
                      <select
                        value={editedPolicy?.status || ''}
                        onChange={(e) => setEditedPolicy({ ...editedPolicy, status: e.target.value })}
                        className="font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                      >
                        <option value="Active">Active</option>
                        <option value="Expiring Soon">Expiring Soon</option>
                        <option value="Expired">Expired</option>
                        <option value="Pending">Pending</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                        policy.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {policy.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Coverage Details Card */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <img src="/icons/shield.gif" alt="Shield" className="w-10 h-10 mix-blend-multiply" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Coverage Details</h4>
                    <p className="text-sm text-gray-600">Your protection coverage</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div>
                        <p className="text-gray-700 font-medium">Coverage Amount</p>
                        <p className="text-xs text-gray-500">Maximum protection limit</p>
                      </div>
                      <div className="mt-2">
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editedPolicy?.coverageAmount || ''}
                            onChange={(e) => setEditedPolicy({ ...editedPolicy, coverageAmount: Number(e.target.value) })}
                            className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-full"
                            placeholder="Coverage Amount"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-gray-900">${policy.coverageAmount.toLocaleString()}</p>
                        )}
                        <p className="text-xs text-gray-500">USD</p>
                      </div>
                    </div>
                    <div className="border-l border-gray-200 pl-6 ml-6 flex-1">
                      <div>
                        <p className="text-gray-700 font-medium">Monthly Premium</p>
                        <p className="text-xs text-gray-500">Payment amount</p>
                      </div>
                      <div className="mt-2">
                        {isEditMode ? (
                          <input
                            type="number"
                            value={editedPolicy?.premium || ''}
                            onChange={(e) => setEditedPolicy({ ...editedPolicy, premium: Number(e.target.value) })}
                            className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-full"
                            placeholder="Monthly Premium"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-gray-900">${policy.premium}</p>
                        )}
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-3 lg:col-span-3 bg-white rounded-2xl shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'features'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Policy Features
                  </button>
                  <button
                    onClick={() => setActiveTab('groups')}
                    className={`w-1/2 py-4 px-1 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'groups'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Manage Groups
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'features' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Policy Features</h3>
                      {isEditMode && (
                        <button
                          onClick={handleAddFeature}
                          className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <i className="fa-solid fa-plus w-4 h-4 mr-2"></i>
                          Add New Feature
                        </button>
                      )}
                    </div>

                    {/* Feature Validation Error Display */}
                    {Object.keys(featureValidationErrors).length > 0 && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <i className="fa-solid fa-exclamation-triangle text-red-500"></i>
                          <span className="text-sm font-medium text-red-800">Please fill in all required fields:</span>
                        </div>
                        <ul className="mt-2 text-sm text-red-700">
                          {Object.entries(featureValidationErrors).map(([field, error]) => (
                            <li key={field} className="flex items-center space-x-2">
                              <i className="fa-solid fa-circle text-red-400 text-xs"></i>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-4">
                      {['core', 'additional'].map(category => {
                        const categoryFeatures = policyFeatures.filter(f => f.category === category);

                        return (
                          <div key={category}>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                {category === 'core' ? 'Core Coverage' : 'Additional Benefits'}
                              </p>
                              {isEditMode && categoryFeatures.length === 0 && (
                                <span className="text-xs text-blue-600 font-medium">
                                  No {category === 'core' ? 'core' : 'additional'} features yet
                                </span>
                              )}
                            </div>
                            {categoryFeatures.length === 0 && isEditMode ? (
                              <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mb-4">
                                <div className="text-gray-400 mb-2">
                                  <i className="fa-solid fa-plus-circle text-2xl"></i>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  No {category === 'core' ? 'core coverage' : 'additional benefit'} features added yet
                                </p>
                                <p className="text-xs text-gray-500">
                                  Click &quot;Add New Feature&quot; to get started
                                </p>
                              </div>
                            ) : (
                              categoryFeatures.map((feature) => {
                              const isEditing = feature.id === editingFeatureId;
                              return (
                                <div key={feature.id} className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4 group">
                                  <div className="rounded-lg flex items-center justify-center flex-shrink-0">
                                    <img src={feature.icon} alt="Feature" className="w-11 h-11" />
                                  </div>
                                  <div className="flex-1">
                                    {isEditing ? (
                                      <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-gray-800 block">Feature Title</label>
                                          <input
                                            type="text"
                                            value={feature.title}
                                            onChange={(e) => handleSaveFeature(feature.id, 'title', e.target.value)}
                                            className={`w-full p-3 border rounded-lg text-base font-medium text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${featureValidationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="Enter feature title (e.g., Dental Coverage)"
                                            autoFocus
                                          />
                                          {featureValidationErrors.title && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                              <i className="fa-solid fa-exclamation-circle"></i>
                                              {featureValidationErrors.title}
                                            </p>
                                          )}
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-gray-800 block">Description</label>
                                          <textarea
                                            value={feature.description}
                                            onChange={(e) => handleSaveFeature(feature.id, 'description', e.target.value)}
                                            className={`w-full p-3 border rounded-lg text-base text-gray-800 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${featureValidationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="Describe the feature benefits and coverage details"
                                            rows={3}
                                          />
                                          {featureValidationErrors.description && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                              <i className="fa-solid fa-exclamation-circle"></i>
                                              {featureValidationErrors.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-sm font-semibold text-gray-800 block">Category</label>
                                          <select
                                            value={feature.category}
                                            onChange={(e) => handleSaveFeature(feature.id, 'category', e.target.value)}
                                            className={`w-full p-3 border rounded-lg text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${featureValidationErrors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                          >
                                            <option value="core">Core Coverage - Essential policy benefits</option>
                                            <option value="additional">Additional Benefits - Optional enhancements</option>
                                          </select>
                                          {featureValidationErrors.category && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                              <i className="fa-solid fa-exclamation-circle"></i>
                                              {featureValidationErrors.category}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex items-center justify-end space-x-3 pt-2">
                                          <button
                                            onClick={handleCancelFeatureEdit}
                                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                            title="Cancel editing"
                                          >
                                            <i className="fa-solid fa-xmark w-4 h-4 mr-2"></i>
                                            Cancel
                                          </button>
                                          <button
                                            onClick={() => handleSaveFeatureEdit(feature.id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                            title="Save changes"
                                          >
                                            <i className="fa-solid fa-check w-4 h-4 mr-2"></i>
                                            Save Feature
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                                          <p className="text-sm text-gray-700">{feature.description}</p>
                                        </div>
                                        {isEditMode && (
                                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                              onClick={() => handleEditFeature(feature.id)}
                                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                              title="Edit feature"
                                            >
                                              <i className="fa-solid fa-pen-to-square w-4 h-4"></i>
                                            </button>
                                            <button
                                              onClick={() => handleDeleteFeature(feature.id)}
                                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                              title="Delete feature"
                                            >
                                              <i className="fa-solid fa-trash w-4 h-4"></i>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'groups' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg flex items-center justify-center">
                          <img src="/icons/users.gif" alt="Users" className="w-9 h-9" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700">Group Members</h3>
                      </div>
                      <button
                        onClick={handleAddMember}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm shadow-sm hover:shadow-md"
                      >
                        <i className="fa-solid fa-user-plus w-4 h-4 mr-2"></i>
                        Add Member
                      </button>
                    </div>
                    
                    {/* Validation Error Display */}
                    {Object.keys(validationErrors).length > 0 && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <i className="fa-solid fa-exclamation-triangle text-red-500"></i>
                          <span className="text-sm font-medium text-red-800">Please fill in all required fields:</span>
                        </div>
                        <ul className="mt-2 text-sm text-red-700">
                          {Object.entries(validationErrors).map(([field, error]) => (
                            <li key={field} className="flex items-center space-x-2">
                              <i className="fa-solid fa-circle text-red-400 text-xs"></i>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                     <div className="overflow-x-auto">
                       <table className="min-w-full bg-white border border-gray-200 rounded-lg table-fixed">
                         <thead className="bg-gray-50">
                           <tr>
                             <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               <div className="flex items-center space-x-2">
                                 {/* <i className="fa-solid fa-user text-gray-400"></i> */}
                                 <span>Name</span>
                               </div>
                             </th>
                             <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               <div className="flex items-center space-x-2">
                                 {/* <i className="fa-solid fa-id-card text-gray-400"></i> */}
                                 <span>Group Member Code</span>
                               </div>
                             </th>
                             <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               <div className="flex items-center space-x-2">
                                 {/* <i className="fa-solid fa-heart text-gray-400"></i> */}
                                 <span>Relationship</span>
                               </div>
                             </th>
                             <th scope="col" className="w-1/12 px-6 py-3">
                               <span className="sr-only">Actions</span>
                             </th>
                           </tr>
                         </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {groupMembers.map((member) => {
                            const isEditing = member.id === editingMemberId;
                            return (
                              <tr key={member.id} className="member-row hover:bg-gray-50 transition-colors">
                                 <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="min-h-[2.5rem] flex items-center">
                                     {isEditing ? (
                                       <div className="w-full">
                                         <input
                                           type="text"
                                           value={member.name}
                                           onChange={(e) => handleSaveMember(member.id, 'name', e.target.value)}
                                           className={`w-full p-2 border rounded-md text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                             validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                           }`}
                                           placeholder="Enter member name"
                                         />
                                         {validationErrors.name && (
                                           <p className="text-xs text-red-600 mt-0.5">{validationErrors.name}</p>
                                         )}
                                       </div>
                                     ) : (
                                       <div className="text-sm text-gray-900 font-medium">{member.name}</div>
                                     )}
                                   </div>
                                 </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="min-h-[2.5rem] flex items-center">
                                    {isEditing ? (
                                      <div className="w-full">
                                        <input
                                          type="text"
                                          value={member.code}
                                          onChange={(e) => handleSaveMember(member.id, 'code', e.target.value)}
                                          className={`w-full p-2 border rounded-md text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            validationErrors.code ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                          }`}
                                          placeholder="Enter member code"
                                        />
                                        {validationErrors.code && (
                                          <p className="text-xs text-red-600 mt-0.5">{validationErrors.code}</p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-500 font-medium">{member.code}</div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="min-h-[2.5rem] flex items-center">
                                    {isEditing ? (
                                      <div className="w-full">
                                        <select
                                          value={member.relationship}
                                          onChange={(e) => handleSaveMember(member.id, 'relationship', e.target.value)}
                                          className={`w-full p-2 border rounded-md text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            validationErrors.relationship ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                          }`}
                                        >
                                          <option value="">Select relationship</option>
                                          {relationshipOptions.map((option) => (
                                            <option key={option} value={option}>
                                              {option}
                                            </option>
                                          ))}
                                        </select>
                                        {validationErrors.relationship && (
                                          <p className="text-xs text-red-600 mt-0.5">{validationErrors.relationship}</p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-500 font-medium">{member.relationship}</div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="min-h-[2.5rem] flex items-center justify-end space-x-2">
                                    {isEditing ? (
                                      <>
                                        <button
                                          onClick={() => handleSaveEdit(member.id)}
                                          className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                          title="Save changes"
                                        >
                                          <i className="fa-solid fa-check w-4 h-4"></i>
                                        </button>
                                        <button
                                          onClick={handleCancelEdit}
                                          className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                          title="Cancel editing"
                                        >
                                          <i className="fa-solid fa-xmark w-4 h-4"></i>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => handleEditMember(member.id)}
                                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                          title="Edit member"
                                        >
                                          <i className="fa-solid fa-pen-to-square w-4 h-4"></i>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteMember(member.id)}
                                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                          title="Delete member"
                                        >
                                          <i className="fa-solid fa-trash w-4 h-4"></i>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-28 animate-slide-up" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/0a43f76d-5404-465d-85ac-2ae1af2efccb/KL9hBWkl66.lottie"
              loop
              autoplay
            />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Genie Insights</h3>
              <p className="text-sm text-gray-700">AI-powered insights for your policy</p>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600">85%</div>
        </div>
          <div className="space-y-5 mb-6">
            <ProgressRow label="Market Score" value={85} color="bg-blue-500" />
            <ProgressRow label="Coverage Quality" value={92} color="bg-green-500" />
            <ProgressRow label="Premium Value" value={78} color="bg-orange-500" />
          </div>
          <div>
            <h4 className="font-bold mb-3 text-gray-800">Key Insights</h4>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg flex items-start space-x-3"><i className="fa-solid fa-check-circle text-green-500 mt-1" /><p className="text-sm text-green-800">Excellent coverage for major medical expenses.</p></div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r-lg flex items-start space-x-3"><i className="fa-solid fa-triangle-exclamation text-yellow-500 mt-1" /><p className="text-sm text-yellow-800">Consider adding dental coverage for better value.</p></div>
            </div>
          </div>
          <div className="mt-8 space-y-5">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Missing Documents</h5>
              {missingStatus.length === 0 ? (
                <p className="text-sm text-green-700">All required documents are uploaded.</p>
              ) : (
                <ul className="space-y-2">
                  {missingStatus.map(item => (
                    <li key={item.name} className="flex items-center justify-between px-3 py-2 rounded-lg border bg-orange-50 border-orange-200">
                      <div className="flex items-center gap-2">
                        <img src="/icons/circle-exclamation.gif" alt="Alert" className="w-6 h-6 text-orange-600 mix-blend-multiply" />
                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      </div>
                      <button onClick={() => policy && openPolicyOnboardingWithData(policy)} title="Upload" aria-label="Upload missing document" className="text-orange-700 hover:text-orange-800 bg-white border border-orange-300 rounded-full w-8 h-8 flex items-center justify-center">
                        <i className="fa-solid fa-upload" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Uploaded Documents</h5>
              {uploadedDocs.length === 0 ? (
                <p className="text-sm text-gray-600">No documents uploaded yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {uploadedDocs.map((d, i) => (
                    <li key={`${d.name}-${i}`} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md flex items-center justify-center text-gray-700 icon-hover-bounce"><img src={d.mime?.includes("pdf") ? "/icons/file-uploaded.gif" : d.mime?.startsWith("image/") ? "/icons/file-uploaded.gif" : "/icons/file.gif"} alt="File" className="w-7 h-7 mix-blend-multiply" /></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{d.name}</p>
                          <p className="text-xs text-gray-700">{d.sizeKb} KB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {d.url && (
                          <button title="Preview" aria-label="Preview" className="text-blue-600 hover:text-blue-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-50 icon-hover-wiggle" onClick={() => openPreview(d.url, d.mime)}>
                            <i className="fa-solid fa-eye" />
                          </button>
                        )}
                        <button title="Remove" aria-label="Remove" className="text-red-600 hover:text-red-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 icon-hover-wiggle" onClick={() => setUploadedDocs(prev => prev.filter((_, idx) => idx !== i))}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={closePreview}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3 border-b">
              <h4 className="font-semibold text-gray-800">Document Preview</h4>
              <button onClick={closePreview} className="text-gray-700 hover:text-gray-700"><img src="/icons/xmark.gif" alt="Close" className="w-5 h-5" /></button>
            </div>
            <div className="p-0 h-[70vh] overflow-auto">
              {previewMime?.startsWith("image/") ? (
                <Image src={previewUrl} alt="Preview" width={800} height={600} className="w-full h-auto" />
              ) : (
                <iframe src={previewUrl} title="Preview" className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



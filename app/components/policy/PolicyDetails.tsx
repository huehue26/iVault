"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useInsure } from "../../store/insureStore";

interface GroupMember {
  id: number;
  name: string;
  code: string;
  relationship: string;
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
  const { activePolicyNumber, policies, setActivePage, setActivePolicyNumber } = useInsure();
  const policy = policies.find(p => p.policyNumber === activePolicyNumber);
  
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; sizeKb: number; url?: string; mime?: string }[]>([
    { name: "Policy_Document.pdf", sizeKb: 128, url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", mime: "application/pdf" },
    { name: "Vehicle_Photo.jpg", sizeKb: 256, url: "https://placehold.co/1024x768?text=Vehicle+Photo", mime: "image/jpeg" },
  ]);
  const [missingDocs, setMissingDocs] = useState<string[]>(["Policy Document", "Photo ID", "Address Proof"]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMime, setPreviewMime] = useState<string | undefined>(undefined);
  const [isDropOver, setIsDropOver] = useState(false);
  
  // Tab management state
  const [activeTab, setActiveTab] = useState<'features' | 'groups'>('features');
  
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
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDropOver(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDropOver(false); }, []);
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDropOver(false); const files = e.dataTransfer.files; onFilesSelected(files); }, []);
  
  const missingStatus = useMemo(() => {
    return missingDocs
      .map(req => ({ name: req, satisfied: uploadedDocs.some(u => u.name.toLowerCase().includes(req.toLowerCase().split(" ")[0])) }))
      .filter(item => !item.satisfied);
  }, [missingDocs, uploadedDocs]);

  function handleUploadClick() { uploadInputRef.current?.click(); }
  function onFilesSelected(files: FileList | null) {
    if (!files) return;
    const newItems = Array.from(files).map(f => ({ name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)), url: URL.createObjectURL(f), mime: f.type }));
    setUploadedDocs(prev => [...prev, ...newItems]);
    setMissingDocs(prev => prev.filter(req => !newItems.some(n => n.name.toLowerCase().includes(req.split(" ")[0].toLowerCase()))));
  }
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

  if (!policy) return null;

  return (
    <main className="page-content p-8 animate-fade-in">
      <header className="flex items-center mb-6">
        <button onClick={() => { setActivePolicyNumber(null); setActivePage("policyBankPage"); }} className="text-gray-700 hover:text-gray-800 mr-3">
          <i className="fa-solid fa-arrow-left text-lg" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Policy Details</h1>
      </header>

      <div className="p-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-start animate-slide-up">
            <div className="flex items-start space-x-5">
              <div className={`w-16 h-16 ${policy.iconBg} rounded-xl flex items-center justify-center`}>
                <i className={`${policy.icon} text-3xl ${policy.iconColor}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{policy.type}</h2>
                <p className="text-gray-700">Policy No: {policy.policyNumber}</p>
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
                <i className="fa-solid fa-download text-lg group-hover:animate-bounce"></i>
              </button>
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
                    <h3 className="text-xl font-bold mb-5 text-gray-800">Policy Features</h3>
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Core Coverage</p>
                      <div className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-bed-pulse text-blue-500" /></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">In-patient Hospitalization</h4>
                          <p className="text-sm text-gray-700">Covers room rent, ICU charges, doctor&apos;s fees, and other related expenses.</p>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-notes-medical text-green-500" /></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Pre & Post-Hospitalization</h4>
                          <p className="text-sm text-gray-700">Covers medical expenses for 60 days before and 90 days after hospitalization.</p>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-clock text-blue-500" /></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Day Care Procedures</h4>
                          <p className="text-sm text-gray-700">Covers medical treatments that do not require 24-hour hospitalization.</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider pt-4">Additional Benefits</p>
                      <div className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-baby text-pink-500" /></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Maternity and Newborn Care</h4>
                          <p className="text-sm text-gray-700">Coverage for childbirth and newborn baby expenses up to $5,000.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'groups' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="fa-solid fa-users text-blue-600 text-lg"></i>
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
                                 <i className="fa-solid fa-user text-gray-400"></i>
                                 <span>Name</span>
                               </div>
                             </th>
                             <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               <div className="flex items-center space-x-2">
                                 <i className="fa-solid fa-id-card text-gray-400"></i>
                                 <span>Group Member Code</span>
                               </div>
                             </th>
                             <th scope="col" className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               <div className="flex items-center space-x-2">
                                 <i className="fa-solid fa-heart text-gray-400"></i>
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
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><i className="fa-solid fa-wand-magic-sparkles text-2xl text-blue-600" /></div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Genie Analysis</h3>
              <p className="text-sm text-gray-700">AI-powered insights for your policy</p>
            </div>
          </div>
          <div className="space-y-5 mb-6">
            <div className="bg-blue-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600"><i className="fa-solid fa-wand-magic-sparkles" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Genie Score</p>
                  <p className="text-xs text-gray-600">Overall policy quality by Genie</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-extrabold text-blue-600">85%</div>
              </div>
            </div>
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
            <h4 className="font-bold mb-3 text-gray-800">Policy Documents</h4>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center dropzone ${isDropOver ? "border-blue-500 bg-blue-50 drag-over" : "border-gray-300"}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 dropzone-icon"><i className="fa-solid fa-cloud-arrow-up text-xl text-gray-600" /></div>
              <p className="text-sm font-semibold text-gray-800">Upload Documents</p>
              <p className="text-xs text-gray-600 mb-4">Drag & drop or click to upload</p>
              <input ref={uploadInputRef} type="file" multiple className="hidden" onChange={(e) => onFilesSelected(e.target.files)} />
              <button onClick={handleUploadClick} className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors animate-shimmer">Upload File</button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Missing Documents</h5>
              {missingStatus.length === 0 ? (
                <p className="text-sm text-green-700">All required documents are uploaded.</p>
              ) : (
                <ul className="space-y-2">
                  {missingStatus.map(item => (
                    <li key={item.name} className="flex items-center justify-between px-3 py-2 rounded-lg border bg-orange-50 border-orange-200">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation text-orange-600" />
                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      </div>
                      <button onClick={handleUploadClick} title="Upload" aria-label="Upload missing document" className="text-orange-700 hover:text-orange-800 bg-white border border-orange-300 rounded-full w-8 h-8 flex items-center justify-center">
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
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-700 icon-hover-bounce"><i className={`fa-solid ${d.mime?.includes("pdf") ? "fa-file-pdf" : d.mime?.startsWith("image/") ? "fa-file-image" : "fa-file"}`} /></div>
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
              <button onClick={closePreview} className="text-gray-700 hover:text-gray-700"><i className="fa-solid fa-xmark" /></button>
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



import { useState, useMemo, useCallback, useEffect } from "react";
import { useInsure, formatDate } from "../../store/insureStore";

// Reusable Settings Dropdown Component
function SettingsDropdown({ 
  isOpen, 
  policyNumber, 
  onAction 
}: { 
  isOpen: boolean; 
  policyNumber: string; 
  onAction: (action: string, policyNumber: string) => void; 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[999999]" style={{ zIndex: 2 }}>
      <button
        onClick={() => onAction('delete', policyNumber)}
        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <i className="fa-solid fa-trash pe-4"></i>
        Delete Policy
      </button>
      <button
        onClick={() => onAction('download', policyNumber)}
        className="w-full flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <img src="/icons/download.gif" alt="Download" className="w-4 h-4 mr-3" />
        Download Policy
      </button>
      <button
        onClick={() => onAction('upload', policyNumber)}
        className="w-full flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <i className="fa-solid fa-upload pe-4"></i>
        Upload Documents
      </button>
    </div>
  );
}

// Reusable Missing Documents Component
function MissingDocuments({ 
  missingDocuments 
}: { 
  missingDocuments: string[] 
}) {
  if (missingDocuments.length === 0) return null;
  
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0 max-w-full">
      <span className="flex items-center gap-1 flex-shrink-0">
        <img src="/icons/exclamation-triangle.gif" alt="Warning" className="w-6 h-6 text-orange-500 flex-shrink-0" />
        <span className="text-gray-700 text-sm whitespace-nowrap">Missing Documents:</span>
      </span>
      <div className="flex gap-1 min-w-0 flex-1">
        {missingDocuments.slice(0, 1).map((doc, docIdx) => (
          <span key={docIdx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 truncate max-w-[180px]" title={doc} >
            <i className="fa-solid fa-circle-exclamation text-orange-600 mr-1 flex-shrink-0" />
            <span className="truncate">{doc}</span>
          </span>
        ))}
        {missingDocuments.length > 1 && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 flex-shrink-0">
            +{missingDocuments.length - 1}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PolicyBank() {
  const { policies, openPolicyOnboarding, setActivePage, setActivePolicyNumber } = useInsure();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isDragOver, setIsDragOver] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => { 
    e.preventDefault(); 
    setIsDragOver(false); 
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      openPolicyOnboarding(files[0]);
    }
  }, [openPolicyOnboarding]);


  const handleSettingsClick = (e: React.MouseEvent, policyNumber: string) => {
    e.stopPropagation();
    setSettingsMenuOpen(settingsMenuOpen === policyNumber ? null : policyNumber);
  };

  const handlePolicyAction = (action: string, policyNumber: string) => {
    setSettingsMenuOpen(null);
    switch (action) {
      case 'delete':
        console.log('Delete policy:', policyNumber);
        break;
      case 'download':
        console.log('Download policy:', policyNumber);
        break;
      case 'upload':
        console.log('Upload documents for policy:', policyNumber);
        break;
    }
  };

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (settingsMenuOpen) {
        setSettingsMenuOpen(null);
      }
    };

    if (settingsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsMenuOpen]);

  function getCategoryFromType(type: string) { return (type || "").split(" ")[0]; }
  const categories = useMemo(() => { const set = new Set<string>(); policies.forEach(p => set.add(getCategoryFromType(p.type))); return ["All", ...Array.from(set)]; }, [policies]);
  const statuses = useMemo(() => { const set = new Set<string>(); policies.forEach(p => set.add(p.status)); return ["All", ...Array.from(set)]; }, [policies]);
  const filteredPolicies = useMemo(() => policies.filter(p => {
    const matchesSearch = [p.type, p.insurer, p.policyNumber].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
    const category = getCategoryFromType(p.type);
    const matchesCategory = selectedCategory === "All" || category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }), [policies, searchTerm, selectedCategory, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPolicies = filteredPolicies.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);


  return (
    <main className="page-content p-8">
      <section className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Policy Bank</h1>
          <p className="text-gray-700 mt-1">Manage and organize all your insurance policies in one secure place</p>
        </div>
        <button
          onClick={() => openPolicyOnboarding()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-white flex items-center justify-center">
          <img
            src="/icons/plus.gif"
            alt="Add"
            className="w-[150%] h-[150%] object-cover object-center"
          />
        </div>

          Add New Policy
        </button>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center animate-stagger-fade" style={{ animationDelay: "100ms" }}>
          <div>
            <p className="text-gray-700 text-sm">Total Policies</p>
            <p className="text-3xl font-bold text-brand-gray-600">{policies.length}</p>
          </div>
          <div><img src="/icons/file-invoice.gif" alt="Policy" className="w-10 h-10" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center animate-stagger-fade" style={{ animationDelay: "200ms" }}>
          <div>
            <p className="text-gray-700 text-sm">Active Coverage</p>
            <p className="text-3xl font-bold text-brand-green">$2.4M</p>
          </div>
          <div><img src="/icons/shield.gif" alt="Shield" className="w-10 h-10" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center animate-stagger-fade" style={{ animationDelay: "300ms" }}>
          <div>
            <p className="text-gray-700 text-sm">Expiring Soon</p>
            <p className="text-3xl font-bold text-brand-orange">{policies.filter(p => p.status === "Expiring Soon").length}</p>
          </div>
          <div><img src="/icons/clock.gif" alt="Clock" className="w-10 h-10" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center animate-stagger-fade" style={{ animationDelay: "400ms" }}>
          <div>
            <p className="text-gray-700 text-sm">Monthly Premium</p>
            <p className="text-3xl font-bold text-brand-gray-600">$880</p>
          </div>
          <div><img src="/icons/dollar-sign.gif" alt="Dollar" className="w-10 h-10" /></div>
        </div>
      </section>

      <section className="bg-white p-4 rounded-xl shadow-sm mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4 w-full">
          <div className="relative flex-1">
            <img src="/icons/search.gif" alt="Search" className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 mix-blend-multiply" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search policies..." className="w-full bg-gray-100 border-none rounded-lg py-3 pl-11 pr-4 transition-all text-gray-800 placeholder-gray-500" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-gray-100 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 transition-all text-gray-800">
            {categories.map(c => (<option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>))}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-gray-100 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 transition-all text-gray-800">
            {statuses.map(s => (<option key={s} value={s}>{s === "All" ? "All Status" : s}</option>))}
          </select>
        </div>
        <div className="flex items-center gap-2 ms-4">
          <button 
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} 
            className="rounded-lg cursor-pointer transition-all duration-300"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img src="/icons/grid.gif" className={`w-10 h-10 mix-blend-multiply ${
                  viewMode === "grid" 
                    ? "hidden" 
                    : "block"
                  }`} />
              <img src="/icons/list.gif" className={`w-10 h-10 mix-blend-multiply ${
                  viewMode === "list" 
                    ? "hidden" 
                    : "block"
                }`} />
              </div>
          </button>
        </div>
      </section>

      {viewMode === "grid" ? (
        filteredPolicies.length === 0 ? (
          <EmptyDropZone isDragOver={isDragOver} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClickCta={() => openPolicyOnboarding()} />
        ) : (
          <div id="policy-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {paginatedPolicies.map((p, idx) => (
              <div key={p.policyNumber} onClick={() => { setActivePolicyNumber(p.policyNumber); setActivePage("policyDetailsPage"); }} className="relative group bg-white p-4 md:p-6 rounded-2xl shadow-sm animate-card-enter hover:shadow-lg transition-all duration-300 cursor-pointer min-h-[280px] flex flex-col" style={{ animationDelay: `${idx * 80}ms`}}>
                {/* Group icon in top right corner - overlaying outside */}
                <div className="bg-blue-500 absolute w-9 h-9 -top-2 -right-2 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg border-2">
                  <i className="fa-solid fa-users rounded-full"></i>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center justify-center rounded-lg">
                    <img src={p.icon} alt={p.type} className="w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      {p.status === "Active" && (
                        <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-700">Active</span>
                      )}
                      {p.status === "Expiring Soon" && (
                        <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold bg-brand-orange-light text-brand-orange">Expiring Soon</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Coverage</p>
                      <p className="text-sm sm:text-lg font-bold text-brand-gray-600">${p.coverageAmount || '0'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base sm:text-lg text-brand-gray-600 truncate">{p.type}</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4 truncate">{p.insurer}</p>
                <div className="space-y-2 text-sm flex-grow">
                  <div className="flex justify-between"><span className="text-gray-700">Policy:</span><span className="font-medium text-gray-800 truncate ml-2">{p.policyNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-700">Premium:</span><span className="font-medium text-gray-800">${p.premium}/mo</span></div>
                  <div className="flex justify-between"><span className="text-gray-700">Expires:</span><span className={`font-medium ${p.status === "Expiring Soon" ? "text-red-500" : "text-gray-800"}`}>{formatDate(p.expires)}</span></div>
                </div>
                <div className="border-t border-brand-gray-200 mt-4 pt-4">
                  <div className={`flex items-center ${p.missingDocuments.length > 0 ? "justify-between" : "justify-end"}`}>
                    <MissingDocuments missingDocuments={p.missingDocuments} />
                    <div className="relative flex-shrink-0 overflow-visible">
                      <button 
                        onClick={(e) => handleSettingsClick(e, p.policyNumber)}
                        className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors w-8 h-8"
                        title="Settings"
                      >
                        <img src="/icons/gear.gif" alt="Settings" className="w-6 h-6 text-gray-600" />
                      </button>
                      <SettingsDropdown 
                        isOpen={settingsMenuOpen === p.policyNumber}
                        policyNumber={p.policyNumber}
                        onAction={handlePolicyAction}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div id="add-policy-card" onClick={() => openPolicyOnboarding()} className="border-2 border-dashed border-brand-gray-200 rounded-2xl flex flex-col items-center justify-center p-4 md:p-6 text-center animate-card-enter hover:border-blue-500 hover:bg-white transition-all duration-300 cursor-pointer min-h-[280px]" style={{ animationDelay: `${filteredPolicies.length * 80}ms` }}>
              <div className="bg-brand-gray-100 text-gray-700 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full mb-4 overflow-hidden">
                <img 
                  src="/icons/plus.gif" 
                  alt="Add" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-brand-gray-600">Add New Policy</h3>
              <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6 px-2">Upload and organize your insurance documents securely</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">Get Started</button>
            </div>
          </div>
        )
      ) : (
        <PolicyListView
          policies={paginatedPolicies}
          filteredPoliciesLength={filteredPolicies.length}
          settingsMenuOpen={settingsMenuOpen}
          handleSettingsClick={handleSettingsClick}
          handlePolicyAction={handlePolicyAction}
        />
      )}

      {/* Pagination Controls */}
      {filteredPolicies.length > 0 && totalPages > 1 && (
        <div className="bg-white p-4 rounded-xl shadow-sm mt-8">
          <div className="flex items-center justify-between">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm border rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function PolicyListView({
  policies,
  filteredPoliciesLength,
  settingsMenuOpen,
  handleSettingsClick,
  handlePolicyAction
}: {
  policies: Array<{ policyNumber: string; type: string; insurer: string; premium: number; coverageAmount: number; expires: string; status: string; iconBg: string; iconColor: string; icon: string; documents: number; missingDocuments: string[] }>;
  filteredPoliciesLength: number;
  settingsMenuOpen: string | null;
  handleSettingsClick: (e: React.MouseEvent, policyNumber: string) => void;
  handlePolicyAction: (action: string, policyNumber: string) => void;
}) {
  const { setActivePolicyNumber, setActivePage } = useInsure();

  return (
    <main className="page-content">
      {/* Policies List */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Policy Details</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Coverage</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Premium</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Expiry</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</div>
          <div className="col-span-1"></div>
        </div>

        {/* Policies */}
        <div className="divide-y divide-gray-200">
          {policies.map((policy, idx) => (
            <div key={policy.policyNumber} className="group grid grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
              setActivePolicyNumber(policy.policyNumber);
              setActivePage("policyDetailsPage");
            }}>
              {/* Policy Details */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                    <img src={policy.icon} alt={policy.type} className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{policy.type}</p>
                    <p className="text-sm text-gray-600">{policy.insurer}</p>
                    <p className="text-xs text-gray-500">{policy.policyNumber}</p>
                  </div>
                </div>
              </div>

              {/* Coverage */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">${policy.coverageAmount.toLocaleString()}</p>
              </div>

              {/* Premium */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">${policy.premium}</p>
              </div>

              {/* Expiry */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">{formatDate(policy.expires)}</p>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                  policy.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {policy.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="relative flex-shrink-0 overflow-visible">
                  <button
                    onClick={(e) => handleSettingsClick(e, policy.policyNumber)}
                    className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors w-8 h-8"
                    title="Settings"
                  >
                    <img src="/icons/gear.gif" alt="Settings" className="w-6 h-6 text-gray-600" />
                  </button>
                  <SettingsDropdown
                    isOpen={settingsMenuOpen === policy.policyNumber}
                    policyNumber={policy.policyNumber}
                    onAction={handlePolicyAction}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPoliciesLength === 0 && (
          <div className="p-12 text-center">
            <img src="/icons/folder.gif" alt="No policies" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyDropZone({ isDragOver, onDragOver, onDragLeave, onDrop, onClickCta }: { isDragOver: boolean; onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void; onDrop: (e: React.DragEvent<HTMLDivElement>) => void; onClickCta: () => void; }) {
  return (
    <div className={`dropzone ${isDragOver ? "drag-over border-blue-500 bg-blue-50" : "border-brand-gray-200 bg-white"} flex flex-col items-center justify-center p-12 rounded-2xl`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className={`rounded-full flex items-center justify-center mb-4 transition-transform ${isDragOver ? "scale-110 animate-wiggle" : "animate-bounce-subtle"}`}>
        <img src="/icons/plus.gif" alt="Upload" className="w-20 h-20 mix-blend-multiply" />
      </div>
      <h3 className="text-xl font-bold text-brand-gray-600 mb-1">No policies found</h3>
      <p className="text-gray-700 mb-6">Drag and drop your policy file here, or click below to upload</p>
      <button onClick={onClickCta} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">Upload Policy</button>
    </div>
  );
}



import { useState, useMemo, useCallback } from "react";
import { useInsure, formatDate } from "../../store/insureStore";

export default function PolicyBank() {
  const { policies, openPolicyOnboarding, setActivePage, setActivePolicyNumber } = useInsure();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isDragOver, setIsDragOver] = useState(false);
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


  return (
    <main className="page-content p-8">
      <section className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Policy Bank</h1>
          <p className="text-gray-700 mt-1">Manage and organize all your insurance policies in one secure place</p>
        </div>
        <button onClick={() => openPolicyOnboarding()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 cursor-pointer">
          <i className="fa-solid fa-plus" /> Add New Policy
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center animate-stagger-fade" style={{ animationDelay: "100ms" }}>
          <div>
            <p className="text-gray-700 text-sm">Total Policies</p>
            <p className="text-3xl font-bold text-brand-gray-600">{policies.length}</p>
          </div>
          <div className="bg-blue-100 text-blue-500 p-4 rounded-lg"><i className="fa-solid fa-file-invoice text-xl" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center animate-stagger-fade" style={{ animationDelay: "200ms" }}>
          <div>
            <p className="text-gray-700 text-sm">Active Coverage</p>
            <p className="text-3xl font-bold text-brand-green">$2.4M</p>
          </div>
          <div className="bg-brand-green-light text-brand-green p-4 rounded-lg"><i className="fa-solid fa-shield-alt text-xl" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center animate-stagger-fade" style={{ animationDelay: "300ms" }}>
          <div>
            <p className="text-gray-700 text-sm">Expiring Soon</p>
            <p className="text-3xl font-bold text-brand-orange">{policies.filter(p => p.status === "Expiring Soon").length}</p>
          </div>
          <div className="bg-brand-orange-light text-brand-orange p-4 rounded-lg"><i className="fa-regular fa-clock text-xl" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center animate-stagger-fade" style={{ animationDelay: "400ms" }}>
          <div>
            <p className="text-gray-700 text-sm">Monthly Premium</p>
            <p className="text-3xl font-bold text-brand-gray-600">$880</p>
          </div>
          <div className="bg-blue-100 text-blue-500 p-4 rounded-lg"><i className="fa-solid fa-dollar-sign text-xl" /></div>
        </div>
      </section>

      <section className="bg-white p-4 rounded-xl shadow-sm mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4 w-full">
          <div className="relative w-1/3">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search policies..." className="w-full bg-gray-100 border-none rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 placeholder-gray-500" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-gray-100 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 transition-all text-gray-800">
            {categories.map(c => (<option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>))}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-gray-100 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 transition-all text-gray-800">
            {statuses.map(s => (<option key={s} value={s}>{s === "All" ? "All Status" : s}</option>))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode("grid")} className={`p-3 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-brand-gray-100"} cursor-pointer`}><i className="fa-solid fa-th-large" /></button>
          <button onClick={() => setViewMode("list")} className={`p-3 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-brand-gray-100"} cursor-pointer`}><i className="fa-solid fa-list" /></button>
        </div>
      </section>

      {viewMode === "grid" ? (
        filteredPolicies.length === 0 ? (
          <EmptyDropZone isDragOver={isDragOver} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClickCta={() => openPolicyOnboarding()} />
        ) : (
          <div id="policy-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((p, idx) => (
              <div key={p.policyNumber} onClick={() => { setActivePolicyNumber(p.policyNumber); setActivePage("policyDetailsPage"); }} className="bg-white p-6 rounded-2xl shadow-sm animate-card-enter hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative" style={{ animationDelay: `${idx * 80}ms` }}>
                {/* Group icon in top right corner - overlaying outside */}
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg border-2 border-white">
                  <i className="fa-solid fa-users text-white text-sm"></i>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`${p.iconBg} ${p.iconColor} w-12 h-12 flex items-center justify-center rounded-lg`}>
                    <i className={`${p.icon} text-2xl`} />
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      {p.status === "Active" && (
                        <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">Active</span>
                      )}
                      {p.status === "Expiring Soon" && (
                        <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-brand-orange-light text-brand-orange">Expiring Soon</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Coverage</p>
                      <p className="text-lg font-bold text-brand-gray-600">${p.coverageAmount || '0'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-brand-gray-600">{p.type}</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">{p.insurer}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-700">Policy Number:</span><span className="font-medium text-gray-800">{p.policyNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-700">Premium:</span><span className="font-medium text-gray-800">${p.premium}/month</span></div>
                  <div className="flex justify-between"><span className="text-gray-700">Expires:</span><span className={`font-medium ${p.status === "Expiring Soon" ? "text-red-500" : "text-gray-800"}`}>{formatDate(p.expires)}</span></div>
                </div>
                <div className="border-t border-brand-gray-200 mt-4 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <i className="fa-solid fa-paperclip" />
                    <span>{p.documents} documents</span>
                  </div>
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer"><i className="fa-solid fa-arrow-right" /></span>
                </div>
              </div>
            ))}
            <div id="add-policy-card" onClick={() => openPolicyOnboarding()} className="border-2 border-dashed border-brand-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-card-enter hover:border-blue-500 hover:bg-white transition-all duration-300 cursor-pointer" style={{ animationDelay: `${filteredPolicies.length * 80}ms` }}>
              <div className="bg-brand-gray-100 text-gray-700 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <i className="fa-solid fa-plus text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-brand-gray-600">Add New Policy</h3>
              <p className="text-sm text-gray-700 mb-6">Upload and organize your insurance documents securely</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">Get Started</button>
            </div>
          </div>
        )
      ) : (
        <PolicyListView policies={filteredPolicies} />
      )}
    </main>
  );
}

function PolicyListView({ policies }: { policies: Array<{ policyNumber: string; type: string; insurer: string; premium: number; coverageAmount: number; expires: string; status: string; iconBg: string; iconColor: string; icon: string }> }) {
  const { setActivePolicyNumber, setActivePage } = useInsure();
  const sorted = useMemo(() => [...policies].sort((a, b) => new Date(a.expires).getTime() - new Date(b.expires).getTime()), [policies]);
  const row = (p: { policyNumber: string; type: string; insurer: string; premium: number; coverageAmount: number; expires: string; status: string; iconBg: string; iconColor: string; icon: string }, idx: number) => (
    <div key={p.policyNumber} onClick={() => { setActivePolicyNumber(p.policyNumber); setActivePage("policyDetailsPage"); }} className="group grid grid-cols-12 gap-4 items-center px-4 py-4 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg animate-list-enter relative" style={{ animationDelay: `${idx * 60}ms` }}>
      {/* Group icon in top right corner - overlaying outside */}
      <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg border-2 border-white">
        <i className="fa-solid fa-users text-white text-sm"></i>
      </div>
      <div className="col-span-12 md:col-span-3 flex items-center space-x-3">
        <div className={`w-10 h-10 ${p.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}><i className={`${p.icon} ${p.iconColor} text-base`} /></div>
        <div>
          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{p.type}</p>
          <p className="text-xs text-gray-700">{p.insurer}</p>
        </div>
      </div>
      <div className="col-span-6 md:col-span-2 text-sm text-gray-600 font-mono">{p.policyNumber}</div>
      <div className="col-span-6 md:col-span-2 text-sm text-gray-800 font-medium">${p.premium}/mo</div>
      <div className="col-span-6 md:col-span-2 text-sm text-gray-800 font-medium">${p.coverageAmount}</div>
      <div className={`col-span-6 md:col-span-2 text-sm font-medium ${p.status === "Expiring Soon" ? "text-warning-red" : "text-gray-900"}`}>{formatDate(p.expires)}</div>
      <div className="col-span-6 md:col-span-1 flex items-center justify-start">
        {p.status === "Active" && (
          <span className="block rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">Active</span>
        )}
        {p.status === "Expiring Soon" && (
          <span className="block rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700">Expiring Soon</span>
        )}
      </div>
    </div>
  );

  return (
    <div id="policiesList" className="animate-fade-in">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-bold text-gray-700 uppercase rounded-t-lg bg-gray-50">
        <div className="col-span-3">Policy</div>
        <div className="col-span-2">Policy Number</div>
        <div className="col-span-2">Premium</div>
        <div className="col-span-2">Coverage</div>
        <div className="col-span-2">Expires</div>
        <div className="col-span-1">Status</div>
      </div>
      <div className="space-y-3 mt-2">
        {sorted.map((p, idx) => row(p, idx))}
      </div>
    </div>
  );
}

function EmptyDropZone({ isDragOver, onDragOver, onDragLeave, onDrop, onClickCta }: { isDragOver: boolean; onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void; onDrop: (e: React.DragEvent<HTMLDivElement>) => void; onClickCta: () => void; }) {
  return (
    <div className={`dropzone ${isDragOver ? "drag-over border-blue-500 bg-blue-50" : "border-brand-gray-200 bg-white"} flex flex-col items-center justify-center p-12 rounded-2xl`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform ${isDragOver ? "scale-110 bg-blue-500 text-white animate-wiggle" : "bg-brand-gray-100 text-gray-700 animate-bounce-subtle"}`}>
        <i className="fa-solid fa-cloud-arrow-up text-3xl" />
      </div>
      <h3 className="text-xl font-bold text-brand-gray-600 mb-1">No policies found</h3>
      <p className="text-gray-700 mb-6">Drag and drop your policy file here, or click below to upload</p>
      <button onClick={onClickCta} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">Upload Policy</button>
    </div>
  );
}



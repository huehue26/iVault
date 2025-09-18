"use client";

import { useState, useMemo, useCallback } from "react";
import { useInsure, formatDate } from "../../store/insureStore";

export default function PolicyManagement() {
  const { policies, setActivePage, setActivePolicyNumber, setIsAgentView } = useInsure();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");



  function getCategoryFromType(type: string) { return (type || "").split(" ")[0]; }
  const categories = useMemo(() => {
    const set = new Set<string>();
    policies.forEach(p => set.add(getCategoryFromType(p.type)));
    return ["All", ...Array.from(set)];
  }, [policies]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    policies.forEach(p => set.add(p.status));
    return ["All", ...Array.from(set)];
  }, [policies]);

  const filteredPolicies = useMemo(() => policies.filter(p => {
    const matchesSearch = [p.type, p.insurer, p.policyNumber].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const category = getCategoryFromType(p.type);
    const matchesCategory = selectedCategory === "All" || category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }), [policies, searchTerm, selectedCategory, selectedStatus]);

  return (
    <main className="page-content p-8">
      <section className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Policy Management</h1>
          <p className="text-gray-700 mt-1">Manage policies assigned to you - update details, generate insights, and track changes</p>
        </div>
      </section>


      {/* Search and Filters */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search policies by type, insurer, or policy number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat} Policies</option>)}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
            >
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          <span>{filteredPolicies.length} policies found</span>
        </div>
      </section>

      {/* Policies List */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Policy Details</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Coverage</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Premium</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Expiry</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</div>
        </div>

        {/* Policies */}
        <div className="divide-y divide-gray-200">
          {filteredPolicies.map((policy, idx) => (
            <div key={policy.policyNumber} className="group grid grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
              setActivePolicyNumber(policy.policyNumber);
              setIsAgentView(true);
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
                <div className="text-xs text-gray-400 transition-opacity">
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPolicies.length === 0 && (
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

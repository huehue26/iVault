"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useInsure, formatDate, Policy } from "../../store/insureStore";

export default function PolicyDashboard() {
  const { policies } = useInsure();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedInsurer, setSelectedInsurer] = useState("All");
  const [sortBy, setSortBy] = useState("policyNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  function getCategoryFromType(type: string) { return (type || "").split(" ")[0]; }

  const categories = useMemo(() => {
    const set = new Set<string>();
    policies.forEach(p => set.add(getCategoryFromType(p.type)));
    return ["All", ...Array.from(set)];
  }, [policies]);

  const insurers = useMemo(() => {
    const set = new Set<string>();
    policies.forEach(p => set.add(p.insurer));
    return ["All", ...Array.from(set)];
  }, [policies]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    policies.forEach(p => set.add(p.status));
    return ["All", ...Array.from(set)];
  }, [policies]);

  const filteredAndSortedPolicies = useMemo(() => {
    const filtered = policies.filter(p => {
      const matchesSearch = [p.type, p.insurer, p.policyNumber, p.premium.toString(), p.coverageAmount.toString()].some(v =>
        v.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const category = getCategoryFromType(p.type);
      const matchesCategory = selectedCategory === "All" || category === selectedCategory;
      const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
      const matchesInsurer = selectedInsurer === "All" || p.insurer === selectedInsurer;
      return matchesSearch && matchesCategory && matchesStatus && matchesInsurer;
    });

    // Sort policies
    filtered.sort((a, b) => {
      let aValue: string|number|Date, bValue: string|number|Date;

      switch (sortBy) {
        case "policyNumber":
          aValue = a.policyNumber;
          bValue = b.policyNumber;
          break;
        case "premium":
          aValue = a.premium;
          bValue = b.premium;
          break;
        case "coverageAmount":
          aValue = a.coverageAmount;
          bValue = b.coverageAmount;
          break;
        case "expires":
          aValue = new Date(a.expires);
          bValue = new Date(b.expires);
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "insurer":
          aValue = a.insurer;
          bValue = b.insurer;
          break;
        default:
          aValue = a.policyNumber;
          bValue = b.policyNumber;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [policies, searchTerm, selectedCategory, selectedStatus, selectedInsurer, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedPolicies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPolicies = filteredAndSortedPolicies.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, selectedInsurer, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleDownloadExcel = () => {
    // Mock Excel download - in real app this would generate actual Excel file
    const csvData = [
      ["Policy Number", "Type", "Insurer", "Premium", "Coverage Amount", "Expiry Date", "Status", "Documents"],
      ...filteredAndSortedPolicies.map(policy => [
        policy.policyNumber,
        policy.type,
        policy.insurer,
        policy.premium.toString(),
        policy.coverageAmount.toString(),
        policy.expires,
        policy.status,
        policy.documents.toString()
      ])
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "policies_export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return "fa-sort";
    return sortOrder === "asc" ? "fa-sort-up" : "fa-sort-down";
  };

  return (
    <main className="p-8">
      <section id="page-header" className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Policy Dashboard</h1>
          <p className="text-gray-700 mt-1">Comprehensive view of all policies with advanced filtering and export capabilities</p>
        </div>
        <button
          onClick={handleDownloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-download"></i>
          Export Excel
        </button>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-file-contract text-blue-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredAndSortedPolicies.length}</p>
              <p className="text-sm text-gray-600">Total Policies</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-dollar-sign text-green-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${filteredAndSortedPolicies.reduce((sum, p) => sum + p.premium, 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Premium</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-shield text-purple-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${filteredAndSortedPolicies.reduce((sum, p) => sum + p.coverageAmount, 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Coverage</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-clock text-yellow-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredAndSortedPolicies.filter(p => p.status === 'Expiring Soon').length}</p>
              <p className="text-sm text-gray-600">Expiring Soon</p>
            </div>
          </div>
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
                placeholder="Search policies by type, insurer, policy number, premium, or coverage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
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
              value={selectedInsurer}
              onChange={(e) => setSelectedInsurer(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
            >
              {insurers.map(insurer => <option key={insurer} value={insurer}>{insurer}</option>)}
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
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            {filteredAndSortedPolicies.length} policies found
            {filteredAndSortedPolicies.length > 0 && (
              <span className="ml-2 text-gray-500">
                (Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedPolicies.length)} of {filteredAndSortedPolicies.length})
              </span>
            )}
          </span>
          <div className="flex gap-4">
            <span>Total Premium: ${filteredAndSortedPolicies.reduce((sum, p) => sum + p.premium, 0).toLocaleString()}</span>
            <span>Total Coverage: ${filteredAndSortedPolicies.reduce((sum, p) => sum + p.coverageAmount, 0).toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Policies Table */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <button
              onClick={() => handleSort("policyNumber")}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              Policy Details
              <i className={`fa-solid ${getSortIcon("policyNumber")} text-xs`}></i>
            </button>
          </div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <button
              onClick={() => handleSort("insurer")}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              Insurer
              <i className={`fa-solid ${getSortIcon("insurer")} text-xs`}></i>
            </button>
          </div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <button
              onClick={() => handleSort("premium")}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              Premium
              <i className={`fa-solid ${getSortIcon("premium")} text-xs`}></i>
            </button>
          </div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <button
              onClick={() => handleSort("coverageAmount")}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              Coverage
              <i className={`fa-solid ${getSortIcon("coverageAmount")} text-xs`}></i>
            </button>
          </div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <button
              onClick={() => handleSort("expires")}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              Expiry
              <i className={`fa-solid ${getSortIcon("expires")} text-xs`}></i>
            </button>
          </div>
          <div className="col-span-1 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Status</div>
        </div>

        {/* Policies */}
        <div className="divide-y divide-gray-200">
          {currentPolicies.map((policy, idx) => (
            <div key={policy.policyNumber} className="group grid grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 transition-colors cursor-pointer animate-list-enter" style={{ animationDelay: `${idx * 30}ms` }}>
              {/* Policy Details */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                    <img src={policy.icon} alt={policy.type} className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{policy.type}</p>
                    <p className="text-sm text-gray-600">{policy.policyNumber}</p>
                  </div>
                </div>
              </div>

              {/* Insurer */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">{policy.insurer}</p>
              </div>

              {/* Premium */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">${policy.premium}</p>
              </div>

              {/* Coverage */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">${policy.coverageAmount.toLocaleString()}</p>
              </div>

              {/* Expiry */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">{formatDate(policy.expires)}</p>
              </div>

              {/* Status */}
              <div className="col-span-1 text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                  policy.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {policy.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedPolicies.length === 0 && (
          <div className="p-12 text-center">
            <img src="/icons/folder.gif" alt="No policies" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredAndSortedPolicies.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
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
      </section>

    </main>
  );
}
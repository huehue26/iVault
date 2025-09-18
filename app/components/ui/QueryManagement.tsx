"use client";

import React, { useState, useMemo } from "react";

interface Query {
  id: string;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Pending";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignedAgent: { name: string; id: string; avatar: string };
  customer: { name: string; email: string; phone: string };
  createdDate: string;
  lastUpdated: string;
  category: string;
}

export default function QueryManagement() {
  const [activeTab, setActiveTab] = useState<"Open" | "In Progress" | "Resolved" | "Pending">("Open");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  // Mock data - in real app this would come from API
  const [queries, setQueries] = useState<Query[]>([
    {
      id: "QRY-001",
      subject: "Policy renewal assistance",
      description: "Customer needs help renewing their auto insurance policy",
      status: "Open",
      priority: "High",
      assignedAgent: { name: "John Carter", id: "AGT-001", avatar: "/icons/agent.gif" },
      customer: { name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 (555) 123-4567" },
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-15",
      category: "Policy"
    },
    {
      id: "QRY-002",
      subject: "Claim processing delay",
      description: "Customer is experiencing delays in claim processing",
      status: "In Progress",
      priority: "Urgent",
      assignedAgent: { name: "Maria Garcia", id: "AGT-002", avatar: "/icons/agent.gif" },
      customer: { name: "Michael Chen", email: "michael.c@email.com", phone: "+1 (555) 234-5678" },
      createdDate: "2024-01-14",
      lastUpdated: "2024-01-16",
      category: "Claims"
    },
    {
      id: "QRY-003",
      subject: "Coverage clarification",
      description: "Customer needs clarification on coverage limits",
      status: "Pending",
      priority: "Medium",
      assignedAgent: { name: "David Lee", id: "AGT-003", avatar: "/icons/agent.gif" },
      customer: { name: "Emma Rodriguez", email: "emma.r@email.com", phone: "+1 (555) 345-6789" },
      createdDate: "2024-01-13",
      lastUpdated: "2024-01-15",
      category: "Policy"
    },
    {
      id: "QRY-004",
      subject: "Payment confirmation",
      description: "Customer requesting payment confirmation for processed claim",
      status: "Resolved",
      priority: "Low",
      assignedAgent: { name: "Sarah Wilson", id: "AGT-004", avatar: "/icons/agent.gif" },
      customer: { name: "Robert Kim", email: "robert.k@email.com", phone: "+1 (555) 456-7890" },
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-14",
      category: "Claims"
    }
  ]);

  // Mock agents for re-assignment
  const agents = [
    { id: "AGT-001", name: "John Carter" },
    { id: "AGT-002", name: "Maria Garcia" },
    { id: "AGT-003", name: "David Lee" },
    { id: "AGT-004", name: "Sarah Wilson" },
    { id: "AGT-005", name: "Alex Thompson" }
  ];

  const priorities = ["All", "Low", "Medium", "High", "Urgent"];
  const categories = ["All", "Policy", "Claims", "Billing", "General"];

  const filteredQueries = useMemo(() => {
    return queries.filter(query => {
      const matchesSearch = [query.subject, query.description, query.customer.name, query.customer.email].some(v =>
        v.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesPriority = selectedPriority === "All" || query.priority === selectedPriority;
      const matchesCategory = selectedCategory === "All" || query.category === selectedCategory;
      const matchesStatus = query.status === activeTab;
      return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
    });
  }, [queries, searchTerm, selectedPriority, selectedCategory, activeTab]);

  const handleReassign = (query: Query) => {
    setSelectedQuery(query);
    setIsReassignModalOpen(true);
  };

  const handleReassignSubmit = (newAgentId: string) => {
    if (selectedQuery) {
      const newAgent = agents.find(agent => agent.id === newAgentId);
      if (newAgent) {
        setQueries(prev => prev.map(query =>
          query.id === selectedQuery.id
            ? {
                ...query,
                assignedAgent: {
                  ...query.assignedAgent,
                  id: newAgent.id,
                  name: newAgent.name
                }
              }
            : query
        ));
      }
    }
    setIsReassignModalOpen(false);
    setSelectedQuery(null);
  };

  const handleStatusChange = (queryId: string, newStatus: Query["status"]) => {
    setQueries(prev => prev.map(query =>
      query.id === queryId ? { ...query, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : query
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-gray-100 text-gray-800";
      case "Medium": return "bg-blue-100 text-blue-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const tabCounts = useMemo(() => {
    return {
      Open: queries.filter(q => q.status === "Open").length,
      "In Progress": queries.filter(q => q.status === "In Progress").length,
      Resolved: queries.filter(q => q.status === "Resolved").length,
      Pending: queries.filter(q => q.status === "Pending").length
    };
  }, [queries]);

  return (
    <main className="p-8">
      <section id="page-header" className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Query Management</h1>
          <p className="text-gray-700 mt-1">Manage customer queries and reassign them to agents</p>
        </div>
      </section>

      {/* Status Tabs */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex space-x-1 mb-6">
          {(["Open", "In Progress", "Resolved", "Pending"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === status
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTab === status ? "bg-white bg-opacity-20 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {tabCounts[status]}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search queries by subject, description, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
            >
              {priorities.map(priority => <option key={priority} value={priority}>{priority} Priority</option>)}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
            >
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <span>{filteredQueries.length} queries found</span>
        </div>
      </section>

      {/* Queries List */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredQueries.map((query) => (
            <div key={query.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{query.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                      {query.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{query.description}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Query ID: {query.id}</span>
                    <span>Created: {query.createdDate}</span>
                    <span>Updated: {query.lastUpdated}</span>
                    <span>Category: {query.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Change Dropdown */}
                  <select
                    value={query.status}
                    onChange={(e) => handleStatusChange(query.id, e.target.value as Query["status"])}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Pending">Pending</option>
                  </select>

                  {/* Reassign Button */}
                  <button
                    onClick={() => handleReassign(query)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Reassign
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <img src={query.assignedAgent.avatar} alt={query.assignedAgent.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{query.assignedAgent.name}</p>
                      <p className="text-xs text-gray-500">Assigned Agent</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">{query.customer.name}</p>
                    <p className="text-xs text-gray-500">{query.customer.email}</p>
                    <p className="text-xs text-gray-500">{query.customer.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQueries.length === 0 && (
          <div className="p-12 text-center">
            <img src="/icons/search.gif" alt="No queries" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No queries found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </section>

      {/* Reassign Modal */}
      {isReassignModalOpen && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Reassign Query</h2>
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedQuery.subject}</h3>
              <p className="text-sm text-gray-600">Currently assigned to: {selectedQuery.assignedAgent.name}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select New Agent</label>
              <div className="space-y-2">
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => handleReassignSubmit(agent.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      agent.id === selectedQuery.assignedAgent.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src="/icons/agent.gif" alt={agent.name} className="w-8 h-8 rounded-full" />
                      <span className="font-medium">{agent.name}</span>
                      {agent.id === selectedQuery.assignedAgent.id && (
                        <span className="text-xs text-blue-600">(Current)</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

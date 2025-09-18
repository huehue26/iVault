"use client";

import React, { useState, useMemo } from "react";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: "Active" | "Inactive";
  avatar: string;
  joinDate: string;
  assignedQueries: number;
}

export default function AgentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Mock data - in real app this would come from API
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "AGT-001",
      name: "John Carter",
      email: "john.carter@insure.com",
      phone: "+1 (555) 123-4567",
      department: "Claims",
      status: "Active",
      avatar: "/icons/agent.gif",
      joinDate: "Jan 15, 2023",
      assignedQueries: 12
    },
    {
      id: "AGT-002",
      name: "Maria Garcia",
      email: "maria.garcia@insure.com",
      phone: "+1 (555) 234-5678",
      department: "Policy",
      status: "Active",
      avatar: "/icons/agent.gif",
      joinDate: "Mar 22, 2023",
      assignedQueries: 8
    },
    {
      id: "AGT-003",
      name: "David Lee",
      email: "david.lee@insure.com",
      phone: "+1 (555) 345-6789",
      department: "Claims",
      status: "Inactive",
      avatar: "/icons/agent.gif",
      joinDate: "Jun 10, 2023",
      assignedQueries: 0
    },
    {
      id: "AGT-004",
      name: "Sarah Wilson",
      email: "sarah.wilson@insure.com",
      phone: "+1 (555) 456-7890",
      department: "Customer Service",
      status: "Active",
      avatar: "/icons/agent.gif",
      joinDate: "Sep 05, 2023",
      assignedQueries: 15
    }
  ]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    agents.forEach(agent => set.add(agent.department));
    return ["All", ...Array.from(set)];
  }, [agents]);

  const statuses = ["All", "Active", "Inactive"];

  const filteredAgents = useMemo(() => agents.filter(agent => {
    const matchesSearch = [agent.name, agent.email, agent.phone, agent.department].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDepartment = selectedDepartment === "All" || agent.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All" || agent.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  }), [agents, searchTerm, selectedDepartment, selectedStatus]);

  const handleAddAgent = () => {
    setIsAddModalOpen(true);
    setEditingAgent(null);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setIsAddModalOpen(true);
  };

  const handleDeleteAgent = (agentId: string) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
    }
  };

  const handleToggleStatus = (_agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId
        ? { ...agent, status: agent.status === "Active" ? "Inactive" : "Active" }
        : agent
    ));
  };

  return (
    <main className="p-8">
      <section id="page-header" className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Agent Management</h1>
          <p className="text-gray-700 mt-1">Manage agents, their assignments, and departmental roles</p>
        </div>
        <button
          onClick={handleAddAgent}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          Add Agent
        </button>
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
                placeholder="Search agents by name, email, phone, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
            >
              {departments.map(dept => <option key={dept} value={dept}>{dept} Department</option>)}
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
          <span>{filteredAgents.length} agents found</span>
        </div>
      </section>

      {/* Agents List */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Agent Details</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Assignments</div>
          <div className="col-span-1 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</div>
        </div>

        {/* Agents */}
        <div className="divide-y divide-gray-200">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="group grid grid-cols-12 gap-4 p-6 items-center hover:bg-gray-50 transition-colors">
              {/* Agent Details */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-600">ID: {agent.id}</p>
                    <p className="text-xs text-gray-500">Joined: {agent.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="col-span-2">
                <p className="text-sm text-gray-900">{agent.email}</p>
                <p className="text-sm text-gray-600">{agent.phone}</p>
              </div>

              {/* Department */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">{agent.department}</p>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  agent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {agent.status}
                </span>
              </div>

              {/* Assignments */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-900">{agent.assignedQueries} queries</p>
              </div>

              {/* Actions */}
              <div className="col-span-1 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEditAgent(agent)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Agent"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Agent"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="p-12 text-center">
            <img src="/icons/users.gif" alt="No agents" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </section>

      {/* Add/Edit Agent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAgent ? 'Edit Agent' : 'Add New Agent'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter agent name"
                  defaultValue={editingAgent?.name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter email address"
                  defaultValue={editingAgent?.email}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter phone number"
                  defaultValue={editingAgent?.phone}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  defaultValue={editingAgent?.department}
                >
                  <option value="">Select Department</option>
                  <option value="Claims">Claims</option>
                  <option value="Policy">Policy</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Underwriting">Underwriting</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingAgent ? 'Update Agent' : 'Add Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

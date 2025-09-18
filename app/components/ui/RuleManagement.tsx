"use client";

import React, { useState, useMemo } from "react";

interface Rule {
  id: string;
  content: string;
  isActive: boolean;
}

export default function RuleManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    isActive: true
  });

  // Mock data - in real app this would come from API
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "RULE-001",
      content: "Send renewal reminders 30 days before auto policy expiry when policy type is auto and expiry date is within 30 days",
      isActive: true
    },
    {
      id: "RULE-002",
      content: "Automatically escalate claims above $10,000 to senior claims officer and send notification to management",
      isActive: true
    },
    {
      id: "RULE-003",
      content: "Flag policies with missing required documents and send document request to customer with follow-up task",
      isActive: false
    },
    {
      id: "RULE-004",
      content: "Send payment reminders for overdue premiums and create collection task when premium is unpaid",
      isActive: true
    }
  ]);

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = rule.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" ||
        (statusFilter === "Active" && rule.isActive) ||
        (statusFilter === "Inactive" && !rule.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [rules, searchTerm, statusFilter]);

  const handleAddRule = () => {
    setFormData({
      content: "",
      isActive: true
    });
    setEditingRule(null);
    setIsAddModalOpen(true);
  };

  const handleEditRule = (rule: Rule) => {
    setFormData({
      content: rule.content,
      isActive: rule.isActive
    });
    setEditingRule(rule);
    setIsAddModalOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive, lastModified: new Date().toISOString().split('T')[0] } : rule
    ));
  };

  const handleBulkToggle = (ruleIds: string[], enable: boolean) => {
    setRules(prev => prev.map(rule =>
      ruleIds.includes(rule.id) ? { ...rule, isActive: enable, lastModified: new Date().toISOString().split('T')[0] } : rule
    ));
  };

  const handleSelectAll = () => {
    const allRuleIds = filteredRules.map(rule => rule.id);
    handleBulkToggle(allRuleIds, true);
  };

  const handleDisableAll = () => {
    const allRuleIds = filteredRules.map(rule => rule.id);
    handleBulkToggle(allRuleIds, false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRule) {
      // Update existing rule
      setRules(prev => prev.map(rule =>
        rule.id === editingRule.id
          ? { ...rule, ...formData }
          : rule
      ));
    } else {
      // Add new rule
      const newRule: Rule = {
        id: `RULE-${String(rules.length + 1).padStart(3, '0')}`,
        ...formData
      };
      setRules(prev => [...prev, newRule]);
    }

    setIsAddModalOpen(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const activeRulesCount = rules.filter(rule => rule.isActive).length;
  const inactiveRulesCount = rules.filter(rule => rule.isActive === false).length;

  return (
    <main className="p-8">
      <section id="page-header" className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Rule Management</h1>
          <p className="text-gray-700 mt-1">Configure and manage business rules for policy processing and automation</p>
        </div>
        <button
          onClick={handleAddRule}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          Add Rule
        </button>
      </section>

      {/* Rule Status Summary */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rule Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">{activeRulesCount}</p>
              </div>
              <i className="fa-solid fa-play text-green-500 text-xl"></i>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Inactive Rules</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveRulesCount}</p>
              </div>
              <i className="fa-solid fa-pause text-gray-500 text-xl"></i>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Rules</p>
                <p className="text-2xl font-bold text-blue-600">{rules.length}</p>
              </div>
              <i className="fa-solid fa-cogs text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSelectAll}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <i className="fa-solid fa-play"></i>
            Enable All
          </button>
          <button
            onClick={handleDisableAll}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <i className="fa-solid fa-pause"></i>
            Disable All
          </button>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search rules by content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Rules</option>
              <option value="Inactive">Inactive Rules</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <span>{filteredRules.length} rules found</span>
        </div>
      </section>

      {/* Rules List */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredRules.map((rule, idx) => (
            <div key={rule.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Rule {rule.id.split('-')[1]}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      rule.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      <i className={`fa-solid ${rule.isActive ? 'fa-check-circle' : 'fa-circle-xmark'} text-xs`}></i>
                      {rule.isActive ? 'Active for Analysis' : 'Inactive for Analysis'}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{rule.content}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      rule.isActive
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                    }`}
                    title={rule.isActive ? 'Deactivate Rule for Geenie Analysis' : 'Activate Rule for Geenie Analysis'}
                  >
                    <i className={`fa-solid ${rule.isActive ? 'fa-pause' : 'fa-play'} mr-2`}></i>
                    {rule.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Rule"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Rule"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {filteredRules.length === 0 && (
          <div className="p-12 text-center">
            <img src="/icons/gear.gif" alt="No rules" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rules found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </section>

      {/* Add/Edit Rule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRule ? 'Edit Rule Content' : 'Add New Rule'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-600 hover:text-gray-800 p-1"
                title="Close"
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Rule Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600"
                  rows={6}
                  placeholder="Enter the rule content as received from backend..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Enable for Geenie Analysis</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {formData.isActive ? 'Rule is active and will be used in analysis' : 'Rule is inactive and will be ignored in analysis'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isActive', !formData.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.isActive ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

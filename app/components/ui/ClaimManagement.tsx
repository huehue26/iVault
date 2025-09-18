"use client";

import React, { useState } from "react";

interface ClaimQuestion {
  id: string;
  question: string;
  isRequired: boolean;
  fieldType: "text" | "textarea" | "select" | "date" | "file";
  options?: string[];
  order: number;
}

interface InsuranceType {
  id: string;
  name: string;
  icon: string;
  providers: {
    id: string;
    name: string;
    questions: ClaimQuestion[];
  }[];
}

export default function ClaimManagement() {
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ClaimQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState({
    question: "",
    isRequired: false,
    fieldType: "text" as ClaimQuestion["fieldType"],
    options: "",
    order: 1
  });

  // Mock data - in real app this would come from API
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([
    {
      id: "auto",
      name: "Auto Insurance",
      icon: "/icons/auto-insurance.gif",
      providers: [
        { id: "state-farm", name: "State Farm", questions: [] },
        { id: "geico", name: "Geico", questions: [] },
        { id: "progressive", name: "Progressive", questions: [] },
        { id: "farmers", name: "Farmers Insurance", questions: [] },
        { id: "allstate", name: "Allstate", questions: [] },
        { id: "liberty-mutual", name: "Liberty Mutual", questions: [] },
        { id: "nationwide", name: "Nationwide", questions: [] },
        { id: "travelers", name: "Travelers", questions: [] }
      ]
    },
    {
      id: "health",
      name: "Health Insurance",
      icon: "/icons/health-insurance.gif",
      providers: [
        { id: "bluecross-blueshield", name: "BlueCross BlueShield", questions: [] },
        { id: "aetna", name: "Aetna", questions: [] },
        { id: "unitedhealthcare", name: "UnitedHealthcare", questions: [] },
        { id: "cigna", name: "Cigna", questions: [] },
        { id: "humana", name: "Humana", questions: [] },
        { id: "anthem", name: "Anthem Blue Cross", questions: [] },
        { id: "kaiser", name: "Kaiser Permanente", questions: [] },
        { id: "molina", name: "Molina Healthcare", questions: [] }
      ]
    },
    {
      id: "life",
      name: "Life Insurance",
      icon: "/icons/life-insurance.gif",
      providers: [
        { id: "metlife", name: "MetLife", questions: [] },
        { id: "prudential", name: "Prudential", questions: [] },
        { id: "northwestern", name: "Northwestern Mutual", questions: [] },
        { id: "guardian", name: "Guardian Life", questions: [] },
        { id: "new-york-life", name: "New York Life", questions: [] },
        { id: "massmutual", name: "MassMutual", questions: [] },
        { id: "thrivent", name: "Thrivent Financial", questions: [] },
        { id: "american-national", name: "American National", questions: [] }
      ]
    },
    {
      id: "home",
      name: "Home Insurance",
      icon: "/icons/home-insurance.gif",
      providers: [
        { id: "allstate-home", name: "Allstate", questions: [] },
        { id: "liberty-mutual-home", name: "Liberty Mutual", questions: [] },
        { id: "nationwide-home", name: "Nationwide", questions: [] },
        { id: "chubb", name: "Chubb", questions: [] },
        { id: "usaa", name: "USAA", questions: [] },
        { id: "amica", name: "Amica Mutual", questions: [] },
        { id: "erie", name: "Erie Insurance", questions: [] },
        { id: "homesite", name: "Homesite Insurance", questions: [] }
      ]
    },
    {
      id: "travel",
      name: "Travel Insurance",
      icon: "/icons/travel-insurance.gif",
      providers: [
        { id: "world-nomads", name: "World Nomads", questions: [] },
        { id: "travel-guard", name: "Travel Guard", questions: [] },
        { id: "squaremouth", name: "Squaremouth", questions: [] },
        { id: "allianz", name: "Allianz Global", questions: [] },
        { id: "seven-corners", name: "Seven Corners", questions: [] },
        { id: "roamright", name: "RoamRight", questions: [] },
        { id: "travelex", name: "Travelex Insurance", questions: [] },
        { id: "generali", name: "Generali", questions: [] }
      ]
    },
    {
      id: "business",
      name: "Business Insurance",
      icon: "/icons/folder.gif",
      providers: [
        { id: "hiscox", name: "Hiscox", questions: [] },
        { id: "chubb-business", name: "Chubb", questions: [] },
        { id: "travelers-business", name: "Travelers", questions: [] },
        { id: "liberty-mutual-business", name: "Liberty Mutual", questions: [] }
      ]
    },
    {
      id: "liability",
      name: "Liability Insurance",
      icon: "/icons/shield.gif",
      providers: [
        { id: "hartford", name: "The Hartford", questions: [] },
        { id: "safeco", name: "Safeco Insurance", questions: [] },
        { id: "21st-century", name: "21st Century Insurance", questions: [] },
        { id: "mercury", name: "Mercury Insurance", questions: [] }
      ]
    },
    {
      id: "flood",
      name: "Flood Insurance",
      icon: "/icons/dollar-sign.gif",
      providers: [
        { id: "nfip", name: "NFIP", questions: [] },
        { id: "austin-mutual", name: "Austin Mutual", questions: [] },
        { id: "wright-national", name: "Wright National Flood", questions: [] },
        { id: "neptune-flood", name: "Neptune Flood", questions: [] }
      ]
    }
  ]);

  const selectedType = insuranceTypes.find(type => type.id === selectedInsuranceType);
  const selectedProv = selectedType?.providers.find(provider => provider.id === selectedProvider);

  const handleAddQuestion = () => {
    if (!selectedProvider) return;

    setQuestionForm({
      question: "",
      isRequired: false,
      fieldType: "text",
      options: "",
      order: (selectedProv?.questions.length || 0) + 1
    });
    setEditingQuestion(null);
    setIsAddQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: ClaimQuestion) => {
    setQuestionForm({
      question: question.question,
      isRequired: question.isRequired,
      fieldType: question.fieldType,
      options: question.options?.join(", ") || "",
      order: question.order
    });
    setEditingQuestion(question);
    setIsAddQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedProvider || !window.confirm("Are you sure you want to delete this question?")) return;

    setInsuranceTypes(prev => prev.map(type =>
      type.id === selectedInsuranceType
        ? {
            ...type,
            providers: type.providers.map(provider =>
              provider.id === selectedProvider
                ? { ...provider, questions: provider.questions.filter(q => q.id !== questionId) }
                : provider
            )
          }
        : type
    ));
  };

  const handleMoveQuestion = (questionId: string, direction: "up" | "down") => {
    if (!selectedProvider) return;

    setInsuranceTypes(prev => prev.map(type =>
      type.id === selectedInsuranceType
        ? {
            ...type,
            providers: type.providers.map(provider =>
              provider.id === selectedProvider
                ? {
                    ...provider,
                    questions: reorderQuestions(provider.questions, questionId, direction)
                  }
                : provider
            )
          }
        : type
    ));
  };

  const reorderQuestions = (questions: ClaimQuestion[], questionId: string, direction: "up" | "down") => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return questions;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= questions.length) return questions;

    const reordered = [...questions];
    [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];

    // Update order numbers
    return reordered.map((q, index) => ({ ...q, order: index + 1 }));
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    const newQuestion: ClaimQuestion = {
      id: editingQuestion?.id || `q${Date.now()}`,
      question: questionForm.question,
      isRequired: questionForm.isRequired,
      fieldType: questionForm.fieldType,
      options: questionForm.options ? questionForm.options.split(",").map(opt => opt.trim()) : undefined,
      order: questionForm.order
    };

    setInsuranceTypes(prev => prev.map(type =>
      type.id === selectedInsuranceType
        ? {
            ...type,
            providers: type.providers.map(provider =>
              provider.id === selectedProvider
                ? {
                    ...provider,
                    questions: editingQuestion
                      ? provider.questions.map(q => q.id === editingQuestion.id ? newQuestion : q)
                      : [...provider.questions, newQuestion].sort((a, b) => a.order - b.order)
                  }
                : provider
            )
          }
        : type
    ));

    setIsAddQuestionModalOpen(false);
  };

  const getFieldTypeIcon = (fieldType: string) => {
    switch (fieldType) {
      case "text": return "fa-font";
      case "textarea": return "fa-align-left";
      case "select": return "fa-list";
      case "date": return "fa-calendar";
      case "file": return "fa-upload";
      default: return "fa-question";
    }
  };

  return (
    <main className="p-8">
      <section id="page-header" className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Claim Management</h1>
          <p className="text-gray-700 mt-1">Configure claim questions for different insurance types and providers</p>
        </div>
      </section>

      {/* Insurance Type and Provider Selection */}
      <section className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="space-y-6">
          {/* Insurance Type Selection */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-shield text-blue-600"></i>
              Insurance Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {insuranceTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedInsuranceType(type.id);
                    setSelectedProvider("");
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-center ${
                    selectedInsuranceType === type.id
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-center mx-auto mb-2">
                    <img src={type.icon} alt={type.name} className="w-12 h-12 mix-blend-multiply" />
                  </div>
                  <div className={`font-medium text-sm ${
                    selectedInsuranceType === type.id ? 'text-blue-800' : 'text-gray-900'
                  }`}>{type.name}</div>
                  <div className={`text-xs mt-1 ${
                    selectedInsuranceType === type.id ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {type.providers.length} provider{type.providers.length !== 1 ? 's' : ''}
                  </div>
                  {selectedInsuranceType === type.id && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mx-auto mt-2">
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Selection */}
          {selectedType && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-building text-green-600"></i>
                Select Provider
              </h3>
              <div className="space-y-2">
                {selectedType.providers.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-sm text-left ${
                      selectedProvider === provider.id
                        ? "border-green-500 bg-green-50 text-green-800"
                        : "border-gray-200 hover:border-green-300 bg-white hover:bg-gray-50 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <i className={`fa-solid fa-building text-sm ${
                            selectedProvider === provider.id ? 'text-green-700' : 'text-gray-700'
                          }`}></i>
                        </div>
                        <div>
                          <div className={`font-medium text-sm ${
                            selectedProvider === provider.id ? 'text-green-800' : 'text-gray-900'
                          }`}>{provider.name}</div>
                          <div className={`text-xs ${
                            selectedProvider === provider.id ? 'text-green-700' : 'text-gray-600'
                          }`}>
                            {provider.questions.length} question{provider.questions.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      {selectedProvider === provider.id && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <i className="fa-solid fa-check text-white text-xs"></i>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Questions Management */}
      {selectedProv && (
        <section className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedType?.name} - {selectedProv.name}
                </h2>
                <p className="text-gray-600 mt-1">Manage claim questions for this provider</p>
              </div>
              <button
                onClick={handleAddQuestion}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <i className="fa-solid fa-plus"></i>
                Add Question
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {selectedProv.questions.length === 0 ? (
              <div className="p-12 text-center">
                <img src="/icons/file-invoice.gif" alt="No questions" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions configured</h3>
                <p className="text-gray-600 mb-4">Add questions to customize the claim filing process for this provider.</p>
                <button
                  onClick={handleAddQuestion}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Add First Question
                </button>
              </div>
            ) : (
              selectedProv.questions
                .sort((a, b) => a.order - b.order)
                .map((question, index) => (
                  <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                            {question.order}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            question.isRequired ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {question.isRequired ? 'Required' : 'Optional'}
                          </span>
                          <i className={`fa-solid ${getFieldTypeIcon(question.fieldType)} text-gray-500`}></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{question.question}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Field Type: {question.fieldType}</span>
                          {question.options && (
                            <span>Options: {question.options.join(", ")}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveQuestion(question.id, "up")}
                          disabled={index === 0}
                          className={`p-1 rounded ${
                            index === 0
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Move Up"
                        >
                          <i className="fa-solid fa-arrow-up"></i>
                        </button>
                        <button
                          onClick={() => handleMoveQuestion(question.id, "down")}
                          disabled={index === selectedProv.questions.length - 1}
                          className={`p-1 rounded ${
                            index === selectedProv.questions.length - 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Move Down"
                        >
                          <i className="fa-solid fa-arrow-down"></i>
                        </button>
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Question"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Question"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>
      )}

      {/* Add/Edit Question Modal */}
      {isAddQuestionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button
                onClick={() => setIsAddQuestionModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter the question text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                  <select
                    value={questionForm.fieldType}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, fieldType: e.target.value as ClaimQuestion["fieldType"] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="text">Text Input</option>
                    <option value="textarea">Text Area</option>
                    <option value="select">Select Dropdown</option>
                    <option value="date">Date Picker</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    min="1"
                    value={questionForm.order}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  />
                </div>
              </div>

              {questionForm.fieldType === "select" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma-separated)</label>
                  <input
                    type="text"
                    value={questionForm.options}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, options: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={questionForm.isRequired}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, isRequired: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Required field</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddQuestionModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

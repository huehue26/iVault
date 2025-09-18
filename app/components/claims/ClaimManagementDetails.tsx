"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useInsure } from "../../store/insureStore";

function ClaimStatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Denied':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm ${getStatusStyles(status)}`}>
      <div className={`w-2 h-2 rounded-full ${
        status === 'Approved' ? 'bg-green-500' :
        status === 'Processing' ? 'bg-blue-500' :
        status === 'Denied' ? 'bg-red-500' :
        'bg-gray-500'
      }`}></div>
      <span>{status}</span>
    </div>
  );
}

export default function ClaimManagementDetails() {
  const { claims, policies, activeClaimId, setActivePage, appendClaimUpdate, updateClaimStatus } = useInsure();
  const claim = useMemo(() => claims.find(c => c.id === activeClaimId), [claims, activeClaimId]);
  const policy = useMemo(() => policies.find(p => p.policyNumber === claim?.policyNumber), [policies, claim]);
  const [showStatusUpdateSuccess, setShowStatusUpdateSuccess] = useState(false);

  if (!claim) return null;

  const isDenied = claim.status === "Denied";

  function sendMessage(messageText: string) {
    if (!messageText.trim() || isDenied || !claim) return;
    const now = new Date();
    const timestamp = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    appendClaimUpdate(claim.id, { from: "agent", message: messageText.trim(), timestamp });
  }

  return (
    <main className="page-content p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <button onClick={() => setActivePage("claimsManagementPage")} className="text-sm font-medium text-gray-600 hover:text-insurance-blue transition-colors flex items-center space-x-2 transform hover:translate-x-0.5">
          <i className="fa-solid fa-arrow-left" />
          <span>Back to Claims Management</span>
        </button>
      </div>

      <div className="bg-white/80 rounded-xl shadow-sm p-6 mb-8 animate-slide-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <p className="text-sm text-gray-700">Claim ID</p>
            <h1 className="text-3xl font-bold text-gray-900">{claim.id}</h1>
            <p className="text-gray-600 mt-1">{policy?.type} - {policy?.policyNumber}</p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <p className="text-sm text-gray-700 mb-2">Claim Status</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <ClaimStatusBadge status={claim.status} />
                <StatusUpdateDropdown
                  currentStatus={claim.status}
                  onStatusChange={(newStatus) => {
                    updateClaimStatus(claim.id, newStatus);
                    setShowStatusUpdateSuccess(true);
                    setTimeout(() => setShowStatusUpdateSuccess(false), 3000);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                {showStatusUpdateSuccess && (
                  <div className="flex items-center gap-2 text-green-600 text-xs font-medium animate-fade-in">
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Status updated successfully</span>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/80 rounded-xl shadow-sm flex flex-col animate-slide-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={{ animationDelay: "80ms" }}>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto h-[calc(100vh-200px)]">
            {claim.updates.map((u, idx) => {
              const isAgent = u.from === "agent";
              const avatar = isAgent ? claim.agent.avatar : "https://placehold.co/32x32/E2E8F0/475569?text=U";
              const name = isAgent ? claim.agent.name : claim.user.name;
              const bubbleClass = isAgent
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-tl-none";
              return (
                <div key={idx} className={`${isAgent ? "agent-message flex justify-end" : "user-message flex justify-start"} animate-slide-in-up`}>
                  <div className="flex items-start space-x-3 max-w-md">
                    {!isAgent && <Image src={avatar} alt="Avatar" width={32} height={32} className="w-10 h-10 rounded-full flex-shrink-0" />}
                    <div>
                      <div className={`chat-bubble p-4 rounded-2xl shadow-sm ${bubbleClass}`}><p className="text-sm">{u.message}</p></div>
                      <p className="text-xs text-gray-600 mt-1.5 px-2">{name}, {u.timestamp}</p>
                    </div>
                    {isAgent && <Image src={avatar} alt="Avatar" width={32} height={32} className="w-10 h-10 rounded-full flex-shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
          <MessageInput disabled={isDenied} onSend={sendMessage} />
        </div>
        <div className="space-y-8">
          <div className="bg-white/80 rounded-xl shadow-sm p-6 animate-slide-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={{ animationDelay: "100ms" }}>
            <h3 className="font-semibold text-gray-800 mb-4">Claimant Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <Image src="/icons/users.gif" alt="User" width={40} height={40} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">{claim.user.name}</p>
                  <p className="text-xs text-gray-700">Policy holder</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="font-medium text-gray-900">{claim.user.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span className="font-medium text-gray-900">{claim.user.phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Address:</span><span className="font-medium text-gray-900">{claim.user.address}</span></div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 rounded-xl shadow-sm p-6 animate-slide-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={{ animationDelay: "140ms" }}>
            <h3 className="font-semibold text-gray-800 mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {claim.documents.length > 0 ? (
                claim.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 mix-blend-multiply rounded-full bg-blue-100 flex items-center justify-center">
                        <img
                          src={`/icons/${doc.type === 'pdf' ? 'file-invoice' : doc.type === 'zip' ? 'folder' : 'file-uploaded'}.gif`}
                          alt={doc.type}
                          className="w-5 h-5"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-600">Uploaded on {doc.uploadedAt}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(doc.url, '_blank')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">No documents uploaded</p>
              )}
            </div>
          </div>
          <div className="bg-white/80 rounded-xl shadow-sm p-6 animate-slide-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={{ animationDelay: "120ms" }}>
            <h3 className="font-semibold text-gray-800 mb-4">Incident Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-700 font-medium">Description:</span>
                <p className="text-gray-900 mt-1">{claim.claimDetails.incidentDescription}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Location:</span>
                <span className="font-medium text-gray-900">{claim.claimDetails.incidentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Estimated Damage:</span>
                <span className="font-medium text-gray-900">{claim.claimDetails.estimatedDamage}</span>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Witnesses:</span>
                <p className="text-gray-900 mt-1">{claim.claimDetails.witnesses}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusUpdateDropdown({ currentStatus, onStatusChange }: {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setSelectedStatus] = useState(currentStatus);

  const statusOptions = [
    { value: "Processing", label: "Processing", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { value: "Approved", label: "Approved", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
    { value: "Denied", label: "Denied", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" }
  ];

  const currentOption = statusOptions.find(opt => opt.value === currentStatus);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md ${
          currentOption?.bgColor || 'bg-gray-50'
        } ${currentOption?.borderColor || 'border-gray-200'} ${currentOption?.color || 'text-gray-600'}`}
      >
        <span>Update Status</span>
        <i className={`fa-solid fa-chevron-down transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusSelect(option.value)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 ${
                  currentStatus === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  option.value === 'Processing' ? 'bg-blue-500' :
                  option.value === 'Approved' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></div>
                <span>{option.label}</span>
                {currentStatus === option.value && (
                  <i className="fa-solid fa-check ml-auto text-blue-600"></i>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MessageInput({ disabled, onSend }: { disabled: boolean; onSend: (text: string) => void }) {
  let inputRef: HTMLInputElement | null = null;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && inputRef) {
      const message = inputRef.value.trim();
      if (message) {
        onSend(message);
        inputRef.value = "";
      }
    }
  };

  return (
    <div className="p-4 bg-transparent">
      <div className="relative">
        <input
          ref={(r) => { inputRef = r; }}
          type="text"
          placeholder={disabled ? "Messaging is disabled for denied claims." : "Send message to claimant..."}
          disabled={disabled}
          onKeyPress={handleKeyPress}
          className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border-2 border-gray-300 focus:ring-2 focus:ring-insurance-blue focus:border-insurance-blue text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 shadow-sm"
        />
        <button onClick={() => { if (inputRef) { onSend(inputRef.value); inputRef.value = ""; } }} disabled={disabled} className={`${disabled ? "hidden" : "block"} absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-colors shadow-sm`}>
          <img src="/icons/send.gif" alt="Send Message" className="w-8 h-8 text-center" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useInsure } from "../../store/insureStore";

function ClaimStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Approved: "bg-success-green/10 text-success-green",
    Processing: "bg-processing-blue/10 text-processing-blue",
    Denied: "bg-denied-red/10 text-denied-red",
  };
  const cls = map[status] || "bg-gray-100 text-gray-600";
  return <span className={`${cls} text-xs font-medium px-3 py-1 rounded-full`}>{status}</span>;
}

export default function ClaimDetails() {
  const { claims, policies, activeClaimId, setActivePage, appendClaimUpdate } = useInsure();
  const claim = useMemo(() => claims.find(c => c.id === activeClaimId), [claims, activeClaimId]);
  const policy = useMemo(() => policies.find(p => p.policyNumber === claim?.policyNumber), [policies, claim]);

  if (!claim) return null;

  const isDenied = claim.status === "Denied";

  function sendMessage(messageText: string) {
    if (!messageText.trim() || isDenied || !claim) return;
    const now = new Date();
    const timestamp = `${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    appendClaimUpdate(claim.id, { from: "user", message: messageText.trim(), timestamp });
  }

  return (
    <main className="page-content p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <button onClick={() => setActivePage("claimsPage")} className="text-sm font-medium text-gray-600 hover:text-insurance-blue transition-colors flex items-center space-x-2 transform hover:translate-x-0.5">
          <i className="fa-solid fa-arrow-left" />
          <span>Back to All Claims</span>
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
            <p className="text-sm text-gray-700 mb-1">Status</p>
            <div><ClaimStatusBadge status={claim.status} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/80 rounded-xl shadow-sm flex flex-col animate-slide-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={{ animationDelay: "80ms" }}>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto h-[calc(100vh-200px)]">
            {claim.updates.map((u, idx) => {
              const isUser = u.from === "user";
              const avatar = isUser ? "https://placehold.co/32x32/E2E8F0/475569?text=S" : claim.agent.avatar;
              const name = isUser ? "You" : claim.agent.name;
              const bubbleClass = isUser
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-tl-none";
              return (
                <div key={idx} className={`${isUser ? "user-message flex justify-end" : "agent-message flex justify-start"} animate-slide-in-up`}>
                  <div className="flex items-start space-x-3 max-w-md">
                    {!isUser && <Image src={avatar} alt="Avatar" width={32} height={32} className="w-8 h-8 rounded-full flex-shrink-0" />}
                    <div>
                      <div className={`chat-bubble p-4 rounded-2xl shadow-sm ${bubbleClass}`}><p className="text-sm">{u.message}</p></div>
                      <p className="text-xs text-gray-600 mt-1.5 px-2">{name}, {u.timestamp}</p>
                    </div>
                    {isUser && <Image src={avatar} alt="Avatar" width={32} height={32} className="w-8 h-8 rounded-full flex-shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
          <MessageInput disabled={isDenied} onSend={sendMessage} />
        </div>
        <div className="space-y-8">
          <div className="bg-white/80 rounded-xl shadow-sm p-6 animate-slide-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={{ animationDelay: "100ms" }}>
            <h3 className="font-semibold text-gray-800 mb-4">Assigned Agent</h3>
            <div className="flex items-center space-x-4">
              <Image src={claim.agent.avatar} alt="Agent" width={40} height={40} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-gray-900">{claim.agent.name}</p>
                <p className="text-xs text-gray-700">Your point of contact</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 rounded-xl shadow-sm p-6 animate-slide-up transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" style={{ animationDelay: "120ms" }}>
            <h3 className="font-semibold text-gray-800 mb-4">Key Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-700">Date of Incident</span><span className="font-medium text-gray-900">{claim.dateOfIncident}</span></div>
              <div className="flex justify-between"><span className="text-gray-700">Date Filed</span><span className="font-medium text-gray-900">{claim.dateFiled}</span></div>
              <div className="flex justify-between"><span className="text-gray-700">Policy Holder</span><span className="font-medium text-gray-900">Sarah Johnson</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
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
          placeholder={disabled ? "Messaging is disabled for denied claims." : "Ask your agent a question..."} 
          disabled={disabled} 
          onKeyPress={handleKeyPress}
          className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border-2 border-gray-300 focus:ring-2 focus:ring-insurance-blue focus:border-insurance-blue text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 shadow-sm" 
        />
        <button onClick={() => { if (inputRef) { onSend(inputRef.value); inputRef.value = ""; } }} disabled={disabled} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-insurance-blue hover:bg-insurance-blue/90 text-white rounded-lg flex items-center justify-center transition-colors disabled:bg-gray-400 shadow-sm">
          <i className="fa-solid fa-paper-plane" />
        </button>
      </div>
    </div>
  );
}



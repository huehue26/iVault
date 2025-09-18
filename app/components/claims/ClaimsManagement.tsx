"use client";

import { useInsure } from "../../store/insureStore";

export default function ClaimsManagement() {
  const { setActivePage, setActiveClaimId } = useInsure();
  const rows = [
    { id: "CLM-001", policy: { iconBg: "bg-blue-100", iconColor: "text-blue-500", icon: "/icons/auto-insurance.gif", name: "Auto Insurance", number: "AI-2024-002" }, date: "Jul 22, 2024", status: { text: "Approved", bg: "bg-brand-green-light", color: "text-brand-green" } },
    { id: "CLM-002", policy: { iconBg: "bg-red-100", iconColor: "text-red-500", icon: "/icons/health-insurance.gif", name: "Health Insurance", number: "HI-2024-001" }, date: "Aug 05, 2024", status: { text: "Processing", bg: "bg-brand-blue-light", color: "text-brand-blue" } },
    { id: "CLM-003", policy: { iconBg: "bg-green-100", iconColor: "text-green-500", icon: "/icons/home-insurance.gif", name: "Home Insurance", number: "HO-2024-004" }, date: "Sep 01, 2024", status: { text: "Denied", bg: "bg-brand-red-light", color: "text-brand-red" } },
  ];

  return (
    <main className="p-8">
      <section id="page-header" className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-gray-600">Claims Management</h1>
          <p className="text-gray-700 mt-1">Manage and process claims assigned to you</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-brand-gray-600 mb-6">Assigned Claims</h2>
        <div className="grid grid-cols-12 gap-4 px-4 pb-4 border-b border-brand-gray-200">
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Claim ID</div>
          <div className="col-span-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Policy</div>
          <div className="col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Filed</div>
          <div className="col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</div>
          <div className="col-span-1 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">Action</div>
        </div>
        <div className="space-y-2 mt-4">
          {rows.map((r, idx) => (
            <div key={r.id} onClick={() => { setActiveClaimId(r.id); setActivePage("claimManagementDetailsPage"); }} className="grid grid-cols-12 gap-4 items-center p-4 rounded-lg hover:bg-brand-gray-100 transition-all duration-200 cursor-pointer animate-list-enter" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="col-span-2 font-medium text-brand-gray-600">{r.id}</div>
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                  <img src={r.policy.icon} alt="Settings" className="w-10 h-10 mix-blend-multiply" />
                </div>
                <div>
                  <p className="font-semibold text-brand-gray-600">{r.policy.name}</p>
                  <p className="text-sm text-gray-700">{r.policy.number}</p>
                </div>
              </div>
              <div className="col-span-3 text-brand-gray-500">{r.date}</div>
              <div className="col-span-2">
                <span className={`${r.status.bg} ${r.status.color} text-xs font-semibold px-3 py-1 rounded-full`}>{r.status.text}</span>
              </div>
              <div className="col-span-1 text-right text-gray-700">
                <i className="fa-solid fa-chevron-right" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

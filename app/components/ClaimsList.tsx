"use client";

import { useInsure } from "../store/insureStore";

function ClaimStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Approved: "bg-success-green/10 text-success-green",
    Processing: "bg-processing-blue/10 text-processing-blue",
    Denied: "bg-denied-red/10 text-denied-red",
  };
  const cls = map[status] || "bg-gray-100 text-gray-600";
  return <span className={`${cls} text-xs font-medium px-3 py-1 rounded-full`}>{status}</span>;
}

export default function ClaimsList() {
  const { claims, policies, setActivePage, setActiveClaimId, openFileClaim } = useInsure();

  return (
    <main className="page-content p-6 md:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claims Tracking</h1>
          <p className="text-gray-600 mt-1">File a new claim or track the status of your existing claims</p>
        </div>
        <button onClick={openFileClaim} className="bg-insurance-blue hover:bg-insurance-blue/90 text-white px-5 py-2.5 rounded-xl font-medium flex items-center space-x-2 shadow-sm cta-button transform hover:scale-105">
          <i className="fa-solid fa-plus" />
          <span>File a New Claim</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-slide-up">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Previous Claims</h2>
        </div>
        <div className="p-2 overflow-x-auto">
          <div className="divide-y divide-gray-100">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-bold text-gray-700 uppercase rounded-t-lg">
              <div className="col-span-3">Claim ID</div>
              <div className="col-span-4">Policy</div>
              <div className="col-span-2">Date Filed</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-center">Action</div>
            </div>
            {claims.map(claim => {
              const policy = policies.find(p => p.policyNumber === claim.policyNumber);
              return (
                <div key={claim.id} className="claim-item-row grid grid-cols-12 gap-4 items-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer" onClick={() => { setActiveClaimId(claim.id); setActivePage("claimDetailsPage"); }}>
                  <div className="col-span-12 md:col-span-3"><p className="font-medium text-gray-800 text-sm">{claim.id}</p></div>
                  <div className="col-span-12 md:col-span-4 flex items-center space-x-3">
                    <div className={`w-8 h-8 ${policy?.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <i className={`${policy?.icon} ${policy?.iconColor} text-base`} />
                    </div>
                    <div><p className="text-sm font-medium text-gray-800">{policy?.type}</p><p className="text-xs text-gray-700">{policy?.policyNumber}</p></div>
                  </div>
                  <div className="col-span-6 md:col-span-2 text-sm text-gray-600">{claim.dateFiled}</div>
                  <div className="col-span-6 md:col-span-2"><ClaimStatusBadge status={claim.status} /></div>
                  <div className="col-span-12 md:col-span-1 text-center"><p className="text-gray-600"><i className="fa-solid fa-chevron-right" /></p></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}



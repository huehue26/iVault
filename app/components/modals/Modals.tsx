"use client";

import { useInsure } from "../../store/insureStore";

export function AddPolicyModal() {
  const { modals, closeAddPolicy } = useInsure();
  if (!modals.addPolicyOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all animate-scale-in">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Add New Policy</h2>
            <button onClick={closeAddPolicy} className="text-gray-600 hover:text-gray-600 text-3xl font-light">&times;</button>
          </div>
        </div>
        <div className="p-8" style={{ minHeight: 350 }}>
          <h3 className="font-semibold text-lg text-gray-800 mb-6 text-center">Start by uploading your policy document</h3>
          <label className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 dropzone">
            <div className="mx-auto w-16 h-16 bg-insurance-blue/10 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 transform">
              <i className="fa-solid fa-cloud-arrow-up text-insurance-blue text-2xl" />
            </div>
            <div className="font-semibold text-gray-700">Drag & drop files here or <span className="text-insurance-blue">click to browse</span></div>
            <p className="text-sm text-gray-700 mt-1">PDF, PNG, JPG supported</p>
            <input type="file" className="hidden" />
          </label>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end items-center">
          <button onClick={closeAddPolicy} className="bg-insurance-blue hover:bg-insurance-blue/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

export function FileClaimModal() {
  const { modals, closeFileClaim, policies } = useInsure();
  if (!modals.fileClaimOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all animate-scale-in">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">File a New Claim</h2>
            <button onClick={closeFileClaim} className="text-gray-600 hover:text-gray-600 text-3xl font-light">&times;</button>
          </div>
        </div>
        <div className="p-8" style={{ minHeight: 300 }}>
          <h3 className="font-semibold text-center text-lg text-gray-800 mb-6">Which policy are you filing a claim for?</h3>
          <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
            {policies.map(p => (
              <div key={p.policyNumber} className="claim-policy-card flex items-center space-x-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div className={`w-10 h-10 ${p.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}><i className={`${p.icon} ${p.iconColor} text-lg`} /></div>
                <div><p className="font-semibold text-gray-800 text-sm">{p.type}</p><p className="text-xs text-gray-700">{p.policyNumber}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end items-center">
          <button onClick={closeFileClaim} className="bg-insurance-blue hover:bg-insurance-blue/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">Close</button>
        </div>
      </div>
    </div>
  );
}



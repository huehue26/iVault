"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { useInsure } from "../store/insureStore";

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <span className="text-sm font-bold text-blue-700">{(value/10).toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function PolicyDetails() {
  const { activePolicyNumber, policies, setActivePage, setActivePolicyNumber } = useInsure();
  const policy = policies.find(p => p.policyNumber === activePolicyNumber);
  if (!policy) return null;
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; sizeKb: number; url?: string; mime?: string }[]>([
    { name: "Policy_Document.pdf", sizeKb: 128, url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", mime: "application/pdf" },
    { name: "Vehicle_Photo.jpg", sizeKb: 256, url: "https://placehold.co/1024x768?text=Vehicle+Photo", mime: "image/jpeg" },
  ]);
  const [missingDocs, setMissingDocs] = useState<string[]>(["Policy Document", "Photo ID", "Address Proof"]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMime, setPreviewMime] = useState<string | undefined>(undefined);
  function handleUploadClick() { uploadInputRef.current?.click(); }
  function onFilesSelected(files: FileList | null) {
    if (!files) return;
    const newItems = Array.from(files).map(f => ({ name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)), url: URL.createObjectURL(f), mime: f.type }));
    setUploadedDocs(prev => [...prev, ...newItems]);
    setMissingDocs(prev => prev.filter(req => !newItems.some(n => n.name.toLowerCase().includes(req.split(" ")[0].toLowerCase()))));
  }
  const missingStatus = useMemo(() => {
    return missingDocs
      .map(req => ({ name: req, satisfied: uploadedDocs.some(u => u.name.toLowerCase().includes(req.toLowerCase().split(" ")[0])) }))
      .filter(item => !item.satisfied);
  }, [missingDocs, uploadedDocs]);
  function openPreview(url?: string, mime?: string) { if (!url) return; setPreviewUrl(url); setPreviewMime(mime); }
  function closePreview() { setPreviewUrl(null); setPreviewMime(undefined); }
  const [isDropOver, setIsDropOver] = useState(false);
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDropOver(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDropOver(false); }, []);
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDropOver(false); const files = e.dataTransfer.files; onFilesSelected(files); }, []);

  return (
    <main className="page-content p-8 animate-fade-in">
      <header className="flex items-center mb-6">
        <button onClick={() => { setActivePolicyNumber(null); setActivePage("policyBankPage"); }} className="text-gray-700 hover:text-gray-800 mr-3">
          <i className="fa-solid fa-arrow-left text-lg" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Policy Details</h1>
      </header>

      <div className="p-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-start animate-slide-up">
            <div className="flex items-start space-x-5">
              <div className={`w-16 h-16 ${policy.iconBg} rounded-xl flex items-center justify-center`}>
                <i className={`${policy.icon} text-3xl ${policy.iconColor}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{policy.type}</h2>
                <p className="text-gray-700">Policy No: {policy.policyNumber}</p>
              </div>
            </div>
            <div className="text-center">
              <button className="mt-1 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Renew Now</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-3 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-5 text-gray-800">Policy Features</h3>
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Core Coverage</p>
                <div className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-bed-pulse text-blue-500" /></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">In-patient Hospitalization</h4>
                    <p className="text-sm text-gray-700">Covers room rent, ICU charges, doctor's fees, and other related expenses.</p>
                  </div>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-notes-medical text-green-500" /></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Pre & Post-Hospitalization</h4>
                    <p className="text-sm text-gray-700">Covers medical expenses for 60 days before and 90 days after hospitalization.</p>
                  </div>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-clock text-purple-500" /></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Day Care Procedures</h4>
                    <p className="text-sm text-gray-700">Covers medical treatments that do not require 24-hour hospitalization.</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider pt-4">Additional Benefits</p>
                <div className="p-4 border border-gray-100 rounded-xl flex items-start space-x-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0"><i className="fa-solid fa-baby text-pink-500" /></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Maternity and Newborn Care</h4>
                    <p className="text-sm text-gray-700">Coverage for childbirth and newborn baby expenses up to $5,000.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-28 animate-slide-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><i className="fa-solid fa-wand-magic-sparkles text-2xl text-blue-600" /></div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Genie Analysis</h3>
              <p className="text-sm text-gray-700">AI-powered insights for your policy</p>
            </div>
          </div>
          <div className="space-y-5 mb-6">
            <div className="bg-blue-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600"><i className="fa-solid fa-wand-magic-sparkles" /></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Genie Score</p>
                  <p className="text-xs text-gray-600">Overall policy quality by Genie</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-extrabold text-blue-600">85%</div>
              </div>
            </div>
            <ProgressRow label="Market Score" value={85} color="bg-blue-500" />
            <ProgressRow label="Coverage Quality" value={92} color="bg-green-500" />
            <ProgressRow label="Premium Value" value={78} color="bg-orange-500" />
          </div>
          <div>
            <h4 className="font-bold mb-3 text-gray-800">Key Insights</h4>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg flex items-start space-x-3"><i className="fa-solid fa-check-circle text-green-500 mt-1" /><p className="text-sm text-green-800">Excellent coverage for major medical expenses.</p></div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r-lg flex items-start space-x-3"><i className="fa-solid fa-triangle-exclamation text-yellow-500 mt-1" /><p className="text-sm text-yellow-800">Consider adding dental coverage for better value.</p></div>
            </div>
          </div>
          <div className="mt-8 space-y-5">
            <h4 className="font-bold mb-3 text-gray-800">Policy Documents</h4>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center dropzone ${isDropOver ? "border-blue-500 bg-blue-50 drag-over" : "border-gray-300"}`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 dropzone-icon"><i className="fa-solid fa-cloud-arrow-up text-xl text-gray-600" /></div>
              <p className="text-sm font-semibold text-gray-800">Upload Documents</p>
              <p className="text-xs text-gray-600 mb-4">Drag & drop or click to upload</p>
              <input ref={uploadInputRef} type="file" multiple className="hidden" onChange={(e) => onFilesSelected(e.target.files)} />
              <button onClick={handleUploadClick} className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors animate-shimmer">Upload File</button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Missing Documents</h5>
              {missingStatus.length === 0 ? (
                <p className="text-sm text-green-700">All required documents are uploaded.</p>
              ) : (
                <ul className="space-y-2">
                  {missingStatus.map(item => (
                    <li key={item.name} className="flex items-center justify-between px-3 py-2 rounded-lg border bg-orange-50 border-orange-200">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation text-orange-600" />
                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      </div>
                      <button onClick={handleUploadClick} title="Upload" aria-label="Upload missing document" className="text-orange-700 hover:text-orange-800 bg-white border border-orange-300 rounded-full w-8 h-8 flex items-center justify-center">
                        <i className="fa-solid fa-upload" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h5 className="font-semibold text-gray-800 mb-2">Uploaded Documents</h5>
              {uploadedDocs.length === 0 ? (
                <p className="text-sm text-gray-600">No documents uploaded yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {uploadedDocs.map((d, i) => (
                    <li key={`${d.name}-${i}`} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-700 icon-hover-bounce"><i className={`fa-solid ${d.mime?.includes("pdf") ? "fa-file-pdf" : d.mime?.startsWith("image/") ? "fa-file-image" : "fa-file"}`} /></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{d.name}</p>
                          <p className="text-xs text-gray-700">{d.sizeKb} KB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {d.url && (
                          <button title="Preview" aria-label="Preview" className="text-blue-600 hover:text-blue-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-50 icon-hover-wiggle" onClick={() => openPreview(d.url, d.mime)}>
                            <i className="fa-solid fa-eye" />
                          </button>
                        )}
                        <button title="Remove" aria-label="Remove" className="text-red-600 hover:text-red-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 icon-hover-wiggle" onClick={() => setUploadedDocs(prev => prev.filter((_, idx) => idx !== i))}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={closePreview}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3 border-b">
              <h4 className="font-semibold text-gray-800">Document Preview</h4>
              <button onClick={closePreview} className="text-gray-700 hover:text-gray-700"><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="p-0 h-[70vh] overflow-auto">
              {previewMime?.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" className="w-full h-auto" />
              ) : (
                <iframe src={previewUrl} title="Preview" className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



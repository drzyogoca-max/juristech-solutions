import React, { useState, useEffect } from 'react';

export interface StagedProposalItem {
  id: string;
  companyName: string;
  targetEmail: string;
  proposalContent: string;
  status: string;
  createdAt: string;
}

export default function LeadApprovalWidget() {
  const [stagedProposals, setStagedProposals] = useState<StagedProposalItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending human-in-the-loop proposals
  useEffect(() => {
    fetch('/api/leads/get-staged')
      .then(res => res.json())
      .then(data => setStagedProposals(data.proposals || []))
      .catch(() => setStagedProposals([]));
  }, []);

  const handleManualDispatch = async (stagedId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads/dispatch-approved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stagedId })
      });
      const data = await res.json();
      if (data.success) {
        setStagedProposals(prev => prev.filter(p => p.id !== stagedId));
        alert('تم إرسال العرض بنجاح وبشكل حقيقي للشركة المستهدفة!');
      } else {
        alert(data.error || 'فشل عملية الإرسال.');
      }
    } catch (err) {
      alert('فشل عملية الإرسال.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-white space-y-4 max-w-4xl mx-auto mt-6 shadow-2xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-amber-400 font-bold text-sm">محطة الاعتماد اليدوي (Human-in-the-Loop Control Panel)</h3>
        <span className="text-xs bg-emerald-900 text-emerald-200 px-3 py-1 rounded-full font-mono">تحكم بشري كامل 100%</span>
      </div>

      {stagedProposals.length === 0 ? (
        <p className="text-slate-400 text-xs py-4 text-center">لا توجد مسودات معلقة حالياً. الرادار يبحث عن شركات جديدة فريدة.</p>
      ) : (
        stagedProposals.map(proposal => (
          <div key={proposal.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-blue-400">الشركة المستهدفة: {proposal.companyName}</span>
              <span className="text-xs text-slate-500 font-mono">{proposal.targetEmail}</span>
            </div>
            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg max-h-32 overflow-y-auto whitespace-pre-wrap font-sans border border-slate-850">
              {proposal.proposalContent}
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => handleManualDispatch(proposal.id)} 
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
              >
                {loading ? 'جاري الإرسال...' : 'اعتماد وإرسال فوري للشركة 🚀'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

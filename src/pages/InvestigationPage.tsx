import ContractInspectionRoom from '../components/ContractInspectionRoom';

export default function InvestigationPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <ContractInspectionRoom />
      </div>
    </main>
  );
}

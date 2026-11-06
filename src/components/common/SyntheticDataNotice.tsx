import React from 'react';
import { AlertCircle } from 'lucide-react';

export const SyntheticDataNotice: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border-b border-cyan-900/40 text-slate-300 text-xs py-1.5 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-cyan-300 font-semibold">SYNTHETIC DEMO ENVIRONMENT:</strong> Structured surveillance records shown are simulated for Nigerian jurisdictions to demonstrate One Health early warning and response workflows.
        </span>
      </div>
      <div className="hidden md:flex items-center gap-3 text-slate-400 font-mono text-[11px]">
        <span>Simulated Sentinel Feeds</span>
        <span aria-hidden="true">·</span>
        <span>No Live Gov/Met Connections</span>
      </div>
    </div>
  );
};

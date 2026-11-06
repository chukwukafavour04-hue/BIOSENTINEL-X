import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ShieldAlert, Search, Filter, Lock, ShieldCheck, Clock, User } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        log.action.toLowerCase().includes(q) ||
        log.performedBy.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (roleFilter !== 'All' && log.userRole !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Lock className="w-4 h-4" />
            <span>SECURITY, GOVERNANCE & ACCESS CONTROL</span>
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            System Audit Trail & Cryptographic Traceability
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Immutable activity log recording all epidemiological data creations, field officer dispatches, status elevations, and AI anomaly synthesis executions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ZERO-TRUST AUDITING ACTIVE</span>
        </div>
      </div>

      {/* Security Architecture Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            ROLE-BASED ACCESS CONTROL (RBAC)
          </div>
          <div className="text-sm font-semibold text-white">5 Authorized Institutional Roles</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Separates human epidemiology, veterinary clinical, environmental health, and incident command permissions.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            JURISDICTIONAL RESTRICTIONS
          </div>
          <div className="text-sm font-semibold text-white">State & Federal Federation</div>
          <p className="text-[11px] text-slate-400 mt-1">
            State-level health officers restricted to assigned geographic boundaries with federal escalation triggers.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            DATA MINIMIZATION
          </div>
          <div className="text-sm font-semibold text-white">PII Masking & Anonymization</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Patient identifiable information strictly anonymized at hospital sentinel ingestion prior to cross-sectoral sharing.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, officer name, or audit details..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
          <span className="text-slate-500 text-[10px] font-mono">ROLE:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900">All Roles</option>
            <option value="incident_commander" className="bg-slate-900">Incident Commander</option>
            <option value="epidemiologist" className="bg-slate-900">Epidemiologist</option>
            <option value="veterinary_officer" className="bg-slate-900">Veterinary Officer</option>
            <option value="environmental_officer" className="bg-slate-900">Environmental Officer</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Timestamp & ID</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4">Officer & Role</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4 font-sans">Details & Operation Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400">
                    <div className="text-slate-200 font-semibold">{new Date(log.createdAt).toLocaleTimeString()}</div>
                    <div className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleDateString()} · {log.id}</div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-emerald-400">
                    {log.action}
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <div className="text-white font-medium">{log.performedBy}</div>
                    <div className="text-[10px] font-mono text-slate-400 capitalize">{log.userRole.replace(/_/g, ' ')}</div>
                  </td>

                  <td className="py-3 px-4 text-cyan-300">
                    <div>{log.entityId}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{log.entityType}</div>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-300 text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

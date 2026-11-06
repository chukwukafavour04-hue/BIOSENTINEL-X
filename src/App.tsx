import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Header } from './components/navigation/Header';
import { Sidebar } from './components/navigation/Sidebar';
import { SyntheticDataNotice } from './components/common/SyntheticDataNotice';
import { CommandCentre } from './components/dashboard/CommandCentre';
import { ZoonoticModule } from './components/zoonotic/ZoonoticModule';
import { EnvironmentalModule } from './components/environmental/EnvironmentalModule';
import { VectorModule } from './components/vector/VectorModule';
import { BiosentinelAI } from './components/ai/BiosentinelAI';
import { GeospatialIntelligence } from './components/map/GeospatialIntelligence';
import { EmergencyModule } from './components/emergency/EmergencyModule';
import { ReportingModule } from './components/analytics/ReportingModule';
import { AuditLogView } from './components/audit/AuditLogModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('command_centre');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#03060F] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Synthetic Demonstration Notice Banner */}
      <SyntheticDataNotice />

      {/* Main Top Header (Zone 1: Brand, Zone 2: Nav, Zone 3: User/Jurisdiction) */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Platform Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Content Viewport Frame */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'command_centre' && <CommandCentre onNavigate={setActiveTab} />}
          {activeTab === 'zoonotic' && <ZoonoticModule />}
          {activeTab === 'environmental' && <EnvironmentalModule />}
          {activeTab === 'vector' && <VectorModule />}
          {activeTab === 'ai_analyst' && <BiosentinelAI />}
          {activeTab === 'geospatial' && <GeospatialIntelligence />}
          {activeTab === 'emergency' && <EmergencyModule />}
          {activeTab === 'reporting' && <ReportingModule />}
          {activeTab === 'audit' && <AuditLogView />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

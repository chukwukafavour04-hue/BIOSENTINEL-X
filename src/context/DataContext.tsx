import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ZoonoticReport,
  EnvironmentalReport,
  VectorReport,
  Investigation,
  AuditLog,
} from '../types';
import {
  INITIAL_ZOONOTIC_REPORTS,
  INITIAL_ENVIRONMENTAL_REPORTS,
  INITIAL_VECTOR_REPORTS,
  INITIAL_INVESTIGATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';
import { useAuth } from './AuthContext';
import { db, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';

interface DataContextType {
  zoonoticReports: ZoonoticReport[];
  environmentalReports: EnvironmentalReport[];
  vectorReports: VectorReport[];
  investigations: Investigation[];
  auditLogs: AuditLog[];
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedLga: string;
  setSelectedLga: (lga: string) => void;
  addZoonoticReport: (report: Omit<ZoonoticReport, 'id' | 'createdAt' | 'updatedAt' | 'reportedBy' | 'reportedByEmail'>) => Promise<void>;
  updateZoonoticReport: (id: string, updates: Partial<ZoonoticReport>) => Promise<void>;
  addEnvironmentalReport: (report: Omit<EnvironmentalReport, 'id' | 'createdAt' | 'updatedAt' | 'reportedBy' | 'reportedByEmail'>) => Promise<void>;
  addVectorReport: (report: Omit<VectorReport, 'id' | 'createdAt' | 'updatedAt' | 'reportedBy' | 'reportedByEmail'>) => Promise<void>;
  addInvestigation: (investigation: Omit<Investigation, 'id' | 'investigationNumber' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByEmail'>) => Promise<void>;
  updateInvestigation: (id: string, updates: Partial<Investigation>) => Promise<void>;
  addAuditLog: (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => Promise<void>;
  resetToDefaultSeed: () => void;
  // Computed metrics
  filteredZoonotic: ZoonoticReport[];
  filteredEnvironmental: EnvironmentalReport[];
  filteredVectors: VectorReport[];
  filteredInvestigations: Investigation[];
  stats: {
    totalHumanCases: number;
    totalHumanDeaths: number;
    totalAnimalCases: number;
    criticalAlertsCount: number;
    activeInvestigationsCount: number;
    spilloverRiskScore: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [selectedState, setSelectedState] = useState<string>('All Nigeria');
  const [selectedLga, setSelectedLga] = useState<string>('All LGAs');

  const [zoonoticReports, setZoonoticReports] = useState<ZoonoticReport[]>(() => {
    const saved = localStorage.getItem('biosentinel_zoonotic');
    return saved ? JSON.parse(saved) : INITIAL_ZOONOTIC_REPORTS;
  });

  const [environmentalReports, setEnvironmentalReports] = useState<EnvironmentalReport[]>(() => {
    const saved = localStorage.getItem('biosentinel_environmental');
    return saved ? JSON.parse(saved) : INITIAL_ENVIRONMENTAL_REPORTS;
  });

  const [vectorReports, setVectorReports] = useState<VectorReport[]>(() => {
    const saved = localStorage.getItem('biosentinel_vectors');
    return saved ? JSON.parse(saved) : INITIAL_VECTOR_REPORTS;
  });

  const [investigations, setInvestigations] = useState<Investigation[]>(() => {
    const saved = localStorage.getItem('biosentinel_investigations');
    return saved ? JSON.parse(saved) : INITIAL_INVESTIGATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('biosentinel_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Verify connection once on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Save to local cache
  useEffect(() => {
    localStorage.setItem('biosentinel_zoonotic', JSON.stringify(zoonoticReports));
  }, [zoonoticReports]);

  useEffect(() => {
    localStorage.setItem('biosentinel_environmental', JSON.stringify(environmentalReports));
  }, [environmentalReports]);

  useEffect(() => {
    localStorage.setItem('biosentinel_vectors', JSON.stringify(vectorReports));
  }, [vectorReports]);

  useEffect(() => {
    localStorage.setItem('biosentinel_investigations', JSON.stringify(investigations));
  }, [investigations]);

  useEffect(() => {
    localStorage.setItem('biosentinel_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Audit logging helper
  const addAuditLog = async (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      action,
      entityType,
      entityId,
      performedBy: currentUser.displayName,
      performedByEmail: currentUser.email,
      userRole: currentUser.role,
      details,
      createdAt: new Date().toISOString(),
    };

    setAuditLogs((prev) => [newLog, ...prev]);

    try {
      await setDoc(doc(collection(db, 'audit_logs'), newLog.id), newLog);
    } catch (e) {
      // Non-fatal if offline/unauthenticated
      console.warn('Audit log firestore write skipped or offline:', e);
    }
  };

  // Zoonotic report actions
  const addZoonoticReport = async (
    report: Omit<ZoonoticReport, 'id' | 'createdAt' | 'updatedAt' | 'reportedBy' | 'reportedByEmail'>
  ) => {
    const id = `ZN-${new Date().getFullYear()}-${String(zoonoticReports.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newReport: ZoonoticReport = {
      ...report,
      id,
      reportedBy: currentUser.displayName,
      reportedByEmail: currentUser.email,
      createdAt: now,
      updatedAt: now,
    };

    setZoonoticReports((prev) => [newReport, ...prev]);
    await addAuditLog(
      'SUBMIT_ZOONOTIC_REPORT',
      'zoonotic',
      id,
      `Reported ${newReport.diseaseName} in ${newReport.lga}, ${newReport.state} (${newReport.humanCases} human cases, ${newReport.animalCases} animal cases).`
    );

    try {
      await setDoc(doc(collection(db, 'zoonotic_reports'), id), newReport);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, `zoonotic_reports/${id}`);
      } catch (err) {
        console.warn('Firestore fallback to local cache:', err);
      }
    }
  };

  const updateZoonoticReport = async (id: string, updates: Partial<ZoonoticReport>) => {
    const now = new Date().toISOString();
    setZoonoticReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: now } : r))
    );
    await addAuditLog(
      'UPDATE_ZOONOTIC_REPORT',
      'zoonotic',
      id,
      `Updated status or metrics for record ${id}.`
    );

    try {
      await updateDoc(doc(db, 'zoonotic_reports', id), { ...updates, updatedAt: now });
    } catch (error) {
      console.warn('Firestore update skipped/offline:', error);
    }
  };

  // Environmental report actions
  const addEnvironmentalReport = async (
    report: Omit<EnvironmentalReport, 'id' | 'createdAt' | 'updatedAt' | 'reportedBy' | 'reportedByEmail'>
  ) => {
    const id = `EV-${new Date().getFullYear()}-${String(environmentalReports.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newReport: EnvironmentalReport = {
      ...report,
      id,
      reportedBy: currentUser.displayName,
      reportedByEmail: currentUser.email,
      createdAt: now,
      updatedAt: now,
    };

    setEnvironmentalReports((prev) => [newReport, ...prev]);
    await addAuditLog(
      'SUBMIT_ENVIRONMENTAL_REPORT',
      'environmental',
      id,
      `Logged ${newReport.indicatorType} alert in ${newReport.lga}, ${newReport.state} (Severity: ${newReport.severity}).`
    );

    try {
      await setDoc(doc(collection(db, 'environmental_reports'), id), newReport);
    } catch (error) {
      console.warn('Firestore write skipped/offline:', error);
    }
  };

  // Vector report actions
  const addVectorReport = async (
    report: Omit<VectorReport, 'id' | 'createdAt' | 'updatedAt' | 'reportedBy' | 'reportedByEmail'>
  ) => {
    const id = `VC-${new Date().getFullYear()}-${String(vectorReports.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newReport: VectorReport = {
      ...report,
      id,
      reportedBy: currentUser.displayName,
      reportedByEmail: currentUser.email,
      createdAt: now,
      updatedAt: now,
    };

    setVectorReports((prev) => [newReport, ...prev]);
    await addAuditLog(
      'SUBMIT_VECTOR_REPORT',
      'vector',
      id,
      `Recorded ${newReport.species} surveillance in ${newReport.lga}, ${newReport.state}.`
    );

    try {
      await setDoc(doc(collection(db, 'vector_reports'), id), newReport);
    } catch (error) {
      console.warn('Firestore write skipped/offline:', error);
    }
  };

  // Investigation actions
  const addInvestigation = async (
    inv: Omit<Investigation, 'id' | 'investigationNumber' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByEmail'>
  ) => {
    const num = `BSX-INV-${new Date().getFullYear()}-${String(investigations.length + 100).slice(-3)}`;
    const id = `INV-${new Date().getFullYear()}-${String(investigations.length + 100).slice(-3)}`;
    const now = new Date().toISOString();
    const newInv: Investigation = {
      ...inv,
      id,
      investigationNumber: num,
      createdBy: currentUser.displayName,
      createdByEmail: currentUser.email,
      createdAt: now,
      updatedAt: now,
    };

    setInvestigations((prev) => [newInv, ...prev]);
    await addAuditLog(
      'INITIATE_INVESTIGATION',
      'investigation',
      id,
      `Launched One Health Investigation ${num}: ${newInv.title} (${newInv.priority} priority).`
    );

    try {
      await setDoc(doc(collection(db, 'investigations'), id), newInv);
    } catch (error) {
      console.warn('Firestore write skipped/offline:', error);
    }
  };

  const updateInvestigation = async (id: string, updates: Partial<Investigation>) => {
    const now = new Date().toISOString();
    setInvestigations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updates, updatedAt: now } : inv))
    );
    await addAuditLog(
      'UPDATE_INVESTIGATION',
      'investigation',
      id,
      `Updated investigation ${id} status to ${updates.status || 'modified'}.`
    );

    try {
      await updateDoc(doc(db, 'investigations', id), { ...updates, updatedAt: now });
    } catch (error) {
      console.warn('Firestore update skipped/offline:', error);
    }
  };

  const resetToDefaultSeed = () => {
    setZoonoticReports(INITIAL_ZOONOTIC_REPORTS);
    setEnvironmentalReports(INITIAL_ENVIRONMENTAL_REPORTS);
    setVectorReports(INITIAL_VECTOR_REPORTS);
    setInvestigations(INITIAL_INVESTIGATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem('biosentinel_zoonotic');
    localStorage.removeItem('biosentinel_environmental');
    localStorage.removeItem('biosentinel_vectors');
    localStorage.removeItem('biosentinel_investigations');
    localStorage.removeItem('biosentinel_audit_logs');
  };

  // State filtering logic
  const isMatch = (stateName: string, lgaName?: string) => {
    if (selectedState !== 'All Nigeria' && stateName !== selectedState) return false;
    if (selectedLga !== 'All LGAs' && lgaName && lgaName !== selectedLga) return false;
    return true;
  };

  const filteredZoonotic = zoonoticReports.filter((r) => isMatch(r.state, r.lga));
  const filteredEnvironmental = environmentalReports.filter((r) => isMatch(r.state, r.lga));
  const filteredVectors = vectorReports.filter((r) => isMatch(r.state, r.lga));
  const filteredInvestigations = investigations.filter((r) => isMatch(r.state, r.lga));

  // Computed metrics
  const totalHumanCases = filteredZoonotic.reduce((acc, curr) => acc + (curr.humanCases || 0), 0);
  const totalHumanDeaths = filteredZoonotic.reduce((acc, curr) => acc + (curr.humanDeaths || 0), 0);
  const totalAnimalCases = filteredZoonotic.reduce((acc, curr) => acc + (curr.animalCases || 0), 0);
  const criticalAlertsCount =
    filteredEnvironmental.filter((e) => e.severity === 'critical' || e.severity === 'elevated').length +
    filteredZoonotic.filter((z) => z.riskScore >= 80).length;
  const activeInvestigationsCount = filteredInvestigations.filter((i) => i.status !== 'resolved').length;

  // Composite Risk Index calculation (0-100)
  const avgZoonoticRisk =
    filteredZoonotic.length > 0
      ? filteredZoonotic.reduce((acc, curr) => acc + curr.riskScore, 0) / filteredZoonotic.length
      : 30;
  const envFactor =
    filteredEnvironmental.filter((e) => e.severity === 'critical').length * 15 +
    filteredEnvironmental.filter((e) => e.severity === 'elevated').length * 8;
  const vectorFactor = filteredVectors.filter((v) => v.larvalIndexBreteau > 50 || v.pathogenDetected !== 'none').length * 10;
  const rawScore = avgZoonoticRisk * 0.5 + envFactor * 0.3 + vectorFactor * 0.2;
  const spilloverRiskScore = Math.min(Math.round(rawScore), 98);

  return (
    <DataContext.Provider
      value={{
        zoonoticReports,
        environmentalReports,
        vectorReports,
        investigations,
        auditLogs,
        selectedState,
        setSelectedState: (s) => {
          setSelectedState(s);
          setSelectedLga('All LGAs');
        },
        selectedLga,
        setSelectedLga,
        addZoonoticReport,
        updateZoonoticReport,
        addEnvironmentalReport,
        addVectorReport,
        addInvestigation,
        updateInvestigation,
        addAuditLog,
        resetToDefaultSeed,
        filteredZoonotic,
        filteredEnvironmental,
        filteredVectors,
        filteredInvestigations,
        stats: {
          totalHumanCases,
          totalHumanDeaths,
          totalAnimalCases,
          criticalAlertsCount,
          activeInvestigationsCount,
          spilloverRiskScore,
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

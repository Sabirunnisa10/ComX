/**
 * SAPCleanCorePage.tsx
 * Page 2 of ComX — wraps the full SAP Clean Core ABAP Suite application.
 * All original SAPCleanCore logic is preserved; this component hosts it inside
 * the ComX top-level page navigation.
 */

import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Send,
  RefreshCw,
  FileText,
  Undo,
  Sparkles,
  Compass,
  Building2,
  Workflow,
  FileCode
} from 'lucide-react';
import { SpecificationInput } from './cleancore/SpecificationInput';
import { StandardDiscovery } from './cleancore/StandardDiscovery';
import { TechnicalSpecViewer } from './cleancore/TechnicalSpecViewer';
import { AbapCodeViewer } from './cleancore/AbapCodeViewer';
import { ExtensibilityGuide } from './cleancore/ExtensibilityGuide';
import { VisualArtifacts } from './cleancore/VisualArtifacts';

// ── Types (subset from SAPCleanCore types.ts) ────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isCodeImprovement?: boolean;
}

interface AnalysisResult {
  id: string;
  timestamp: string;
  businessArea: string;
  developmentObject: string;
  requirementTitle: string;
  manualRequirements: string;
  fileName?: string;
  module: string;
  sapTransactions: string[];
  impactedTables: string[];
  standardObjects: any[];
  techSpec: any;
  abapCode: any;
  extensibilityGuide?: any;
  odataRapGuide?: any;
  sandbox: any;
  visualDiagrams: {
    flowchartSvg: string;
    sequenceSvg: string;
    dataFlowSvg: string;
  };
  chatAssistantReply?: string;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SAPCleanCorePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [improving, setImproving] = useState<boolean>(false);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'architecture' | 'tsd' | 'abap' | 'extensibility'>('architecture');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // ── Analyze handler ──────────────────────────────────────────────────────
  const handleAnalyze = async (inputs: {
    businessArea: any;
    developmentObject: any;
    manualRequirements: string;
    fileName?: string;
    fileContent?: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (response.ok) {
        setActiveAnalysis(data);
        setActiveTab('architecture');
        setChatHistory([{
          id: 'init',
          role: 'assistant',
          content: `Hello! I have completed the Solution Architecture design for: **"${data.requirementTitle || 'SAP Custom Requirement'}"**.\n\nI have mapped suitable S/4HANA objects, designed a Clean Core TSD, written ABAP 7.4+ source code, and prepared unit tests. How can I help refine this design?`,
          timestamp: new Date().toLocaleTimeString(),
        }]);
      } else {
        alert(data.error || 'Failed to complete analysis.');
      }
    } catch (err: any) {
      alert('Network error connecting to S/4HANA Architect AI.');
    } finally {
      setLoading(false);
    }
  };

  // ── Chat handler ─────────────────────────────────────────────────────────
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeAnalysis) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentAnalysis: activeAnalysis,
          chatHistory: chatHistory.concat(userMsg),
          userMessage: userMsg.content,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setActiveAnalysis(data);
        setChatHistory(prev => [...prev, {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.chatAssistantReply || `Updated all technical specifications for: "${userMsg.content}". Check the tabs.`,
          timestamp: new Date().toLocaleTimeString(),
        }]);
      } else {
        alert(data.error || 'Chat processing failed.');
      }
    } catch (err: any) {
      alert('Error updating artifacts via chat.');
    } finally {
      setChatLoading(false);
    }
  };

  // ── Improve code handler ─────────────────────────────────────────────────
  const handleImproveCode = async (improvementType: string) => {
    if (!activeAnalysis) return;
    setImproving(true);
    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCode: activeAnalysis.abapCode.code,
          currentAnalysis: activeAnalysis,
          improvementType,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setActiveAnalysis(prev => {
          if (!prev) return null;
          return {
            ...prev,
            abapCode: {
              code: data.improvedCode,
              originalCode: prev.abapCode.originalCode || prev.abapCode.code,
              cleanCoreScore: data.cleanCoreScore,
              atcComplianceChecklist: data.atcComplianceChecklist,
              s4HanaReadinessNotes: data.s4HanaReadinessNotes,
              improvementsApplied: [...(prev.abapCode.improvementsApplied || []), improvementType],
              reviewFeedback: data.reviewFeedback,
            },
          };
        });
        setChatHistory(prev => [...prev, {
          id: `imp-${Date.now()}`,
          role: 'assistant',
          content: `✅ **Applied: "${improvementType}"** — Clean Core Score boosted to **${data.cleanCoreScore}%**. View the diff in the ABAP Code tab.`,
          timestamp: new Date().toLocaleTimeString(),
          isCodeImprovement: true,
        }]);
        setActiveTab('abap');
      }
    } catch (err) {
      alert('Error improving ABAP source code.');
    } finally {
      setImproving(false);
    }
  };

  const resetProject = () => {
    if (window.confirm('Start a new solution architecture specification?')) {
      setActiveAnalysis(null);
      setChatHistory([]);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#32363A] flex flex-col font-sans">

      {/* SAP Header */}
      <header className="h-12 bg-[#0040B0] text-white flex items-center justify-between px-6 shadow-md shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
            <div className="font-bold text-sm tracking-tight">
              SAP <span className="font-light text-blue-100">Clean Core ABAP Suite</span>
            </div>
          </div>
          <div className="h-4 w-px bg-blue-400 hidden sm:block" />
          <div className="text-[10px] text-blue-100 uppercase tracking-widest font-medium hidden sm:block">
            S/4HANA Extensibility Architect
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[11px]">Connected: BTP-ABAP-ENV</span>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-md border border-white/20 text-[11px] font-mono">System: P21/100</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {!activeAnalysis ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Intro card */}
              <div className="bg-white border border-[#D1D9E0] rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm">
                <div className="space-y-3 flex-1">
                  <h2 className="text-2xl font-bold tracking-tight text-[#32363A]">
                    S/4HANA Clean Core Technical Governance
                  </h2>
                  <p className="text-[#6A6D70] text-xs leading-relaxed">
                    Upload your Functional Specification or type business criteria. The engine recommends
                    upgrade-safe released BAdIs / CDS Views, generates comprehensive Technical Specs,
                    and outputs production ABAP 7.4+ source classes — all clean core compliant.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {['No core modifications', 'Released OData V4 Services', 'ATC Checked Source Classes'].map(tag => (
                      <span key={tag} className="bg-[#FAFAFB] border border-[#D1D9E0] text-[#515457] text-[10px] px-2.5 py-1 rounded font-medium">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full md:w-auto flex-shrink-0">
                  <div className="bg-[#FAFAFB] p-4 border border-[#D1D9E0] rounded-lg text-center shadow-sm">
                    <Building2 className="w-5 h-5 text-[#0040B0] mx-auto mb-1" />
                    <span className="text-lg font-bold font-mono block text-[#32363A]">15+</span>
                    <span className="text-[9px] text-[#6A6D70] uppercase tracking-wider block font-semibold">SAP Areas</span>
                  </div>
                  <div className="bg-[#FAFAFB] p-4 border border-[#D1D9E0] rounded-lg text-center shadow-sm">
                    <Workflow className="w-5 h-5 text-[#0070F2] mx-auto mb-1" />
                    <span className="text-lg font-bold font-mono block text-[#32363A]">100%</span>
                    <span className="text-[9px] text-[#6A6D70] uppercase tracking-wider block font-semibold">Upgrade-Safe</span>
                  </div>
                </div>
              </div>
              <SpecificationInput onAnalyze={handleAnalyze} loading={loading} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active project bar */}
              <div className="bg-white border border-[#D1D9E0] rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FAFAFB] border border-[#D1D9E0] rounded-lg">
                    <Compass className="w-5 h-5 text-[#0040B0]" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#6A6D70] uppercase tracking-wider font-bold font-mono">ACTIVE S/4HANA OBJECT DESIGN</span>
                    <h2 className="text-base font-bold text-[#32363A] mt-0.5">{activeAnalysis.requirementTitle}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className="text-xs bg-[#FAFAFB] border border-[#D1D9E0] text-[#32363A] rounded-lg px-3 py-1.5 font-medium">
                    Object: <strong className="text-[#0040B0] font-mono text-[11px] uppercase">{activeAnalysis.developmentObject}</strong>
                  </span>
                  <button
                    onClick={resetProject}
                    className="text-xs bg-white hover:bg-[#FAFAFB] hover:text-rose-600 text-[#32363A] font-semibold px-3 py-1.5 rounded-lg border border-[#D1D9E0] shadow-sm transition flex items-center gap-1 cursor-pointer"
                  >
                    <Undo className="w-3.5 h-3.5" /> New Design
                  </button>
                </div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#D1D9E0] p-4 rounded-xl shadow-sm">
                  <div className="text-[10px] uppercase text-[#6A6D70] font-bold tracking-wider mb-1">Clean Core Score</div>
                  <div className="text-xl font-bold text-[#009245]">{activeAnalysis.abapCode?.cleanCoreScore || 95}%</div>
                </div>
                <div className="bg-white border border-[#D1D9E0] p-4 rounded-xl shadow-sm">
                  <div className="text-[10px] uppercase text-[#6A6D70] font-bold tracking-wider mb-1">Governance Tier</div>
                  <div className="text-xl font-bold text-[#0040B0]">
                    {['BADI','RAP_BO','CDS_VIEW'].includes(activeAnalysis.developmentObject) ? 'Tier 1' : 'Tier 2'}
                  </div>
                </div>
                <div className="bg-white border border-[#D1D9E0] p-4 rounded-xl shadow-sm">
                  <div className="text-[10px] uppercase text-[#6A6D70] font-bold tracking-wider mb-1">Standard APIs</div>
                  <div className="text-xl font-bold text-[#32363A]">{activeAnalysis.standardObjects?.length || 0}</div>
                </div>
                <div className="bg-white border border-[#D1D9E0] p-4 rounded-xl shadow-sm">
                  <div className="text-[10px] uppercase text-[#6A6D70] font-bold tracking-wider mb-1">Risk Rating</div>
                  <div className="text-xl font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />LOW
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto bg-[#FAFAFB] p-1.5 rounded-xl border border-[#D1D9E0] shadow-inner">
                {([
                  { key: 'architecture', icon: <Compass className="w-4 h-4" />, label: '1. Architecture Blueprint' },
                  { key: 'tsd',          icon: <FileText className="w-4 h-4" />, label: '2. Technical Specs (TSD)' },
                  { key: 'abap',         icon: <FileCode className="w-4 h-4" />, label: '3. Modern ABAP Code' },
                  ...(activeAnalysis.extensibilityGuide || activeAnalysis.odataRapGuide
                    ? [{ key: 'extensibility', icon: <Layers className="w-4 h-4" />, label: '4. Extensibility & RAP' }]
                    : []),
                ] as { key: string; icon: React.ReactNode; label: string }[]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-2 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition cursor-pointer flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'border-[#0040B0] text-[#0040B0] bg-white rounded-lg shadow-sm'
                        : 'border-transparent text-[#6A6D70] hover:text-[#32363A] hover:bg-[#F4F7F9] rounded-md'
                    }`}
                  >
                    {tab.icon}{tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div>
                {activeTab === 'architecture' && (
                  <>
                    <StandardDiscovery standardObjects={activeAnalysis.standardObjects} moduleName={activeAnalysis.module} />
                    <VisualArtifacts diagrams={activeAnalysis.visualDiagrams} />
                  </>
                )}
                {activeTab === 'tsd' && <TechnicalSpecViewer techSpec={activeAnalysis.techSpec} />}
                {activeTab === 'abap' && (
                  <AbapCodeViewer abapCode={activeAnalysis.abapCode} onImproveCode={handleImproveCode} improving={improving} />
                )}
                {activeTab === 'extensibility' && (
                  <ExtensibilityGuide extensibilityGuide={activeAnalysis.extensibilityGuide} odataRapGuide={activeAnalysis.odataRapGuide} />
                )}
              </div>

              {/* Chat Co-Pilot */}
              {chatHistory.length > 0 && (
                <div className="bg-white border border-[#D1D9E0] rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-[#0040B0] px-5 py-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span className="text-sm font-bold text-white">SAP Architect AI Co-Pilot</span>
                  </div>
                  <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                    {chatHistory.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] text-xs px-3 py-2 rounded-lg whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#0040B0] text-white rounded-br-none'
                            : 'bg-[#FAFAFB] border border-[#D1D9E0] text-[#32363A] rounded-bl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-[#FAFAFB] border border-[#D1D9E0] text-[#6A6D70] text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing...
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSendChatMessage} className="flex border-t border-[#D1D9E0]">
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Ask to refine code, add validations, convert to RAP..."
                      className="flex-1 px-4 py-3 text-xs bg-white outline-none text-[#32363A] placeholder-[#6A6D70]"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="px-4 py-3 bg-[#0040B0] hover:bg-[#0053CC] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Settings, 
  ShieldAlert, 
  Terminal, 
  Workflow
} from 'lucide-react';
import { TechnicalSpecification } from '../types';

interface TechnicalSpecViewerProps {
  techSpec: TechnicalSpecification;
}

export const TechnicalSpecViewer: React.FC<TechnicalSpecViewerProps> = ({ techSpec }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'design' | 'architecture'>('overview');

  const tabs = [
    { id: 'overview', label: 'Solution Overview', icon: FileText },
    { id: 'design', label: 'Detailed Design', icon: Settings },
    { id: 'architecture', label: 'Security & Auth', icon: ShieldAlert },
  ] as const;

  return (
    <div className="bg-white border border-[#D1D9E0] rounded-xl p-6 shadow-sm space-y-6" id="tech-spec-container">
      <div className="flex justify-between items-center border-b border-[#D1D9E0] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#32363A] flex items-center gap-2">
            <FileText className="text-[#0040B0] w-5 h-5" />
            Technical Specification Document (TSD)
          </h2>
          <p className="text-[#6A6D70] text-xs mt-0.5">
            Enterprise-ready documentation for SAP Technical Design Review committees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-blue-50 border border-blue-200 text-[#0040B0] px-2.5 py-1 rounded-lg font-mono font-bold uppercase tracking-wider">
            Format: S/4HANA TSD v2.1
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#D1D9E0] gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-t-lg border-t-2 border-x transition cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'border-t-[#0040B0] border-x-[#D1D9E0] bg-white text-[#0040B0]'
                  : 'border-t-transparent border-x-transparent bg-transparent hover:bg-slate-50 text-[#6A6D70] hover:text-[#32363A]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#0040B0]' : 'text-[#6A6D70]'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="bg-white border border-[#D1D9E0] rounded-xl p-5 min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Overview Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#515457] uppercase tracking-wider">Executive Overview</h3>
              <p className="text-[#32363A] text-sm leading-relaxed whitespace-pre-wrap">{techSpec.overview}</p>
            </div>

            {/* Core Business Requirement */}
            <div className="space-y-2 pt-4 border-t border-[#D1D9E0]">
              <h3 className="text-xs font-bold text-[#515457] uppercase tracking-wider">Business Requirement</h3>
              <p className="text-[#515457] text-sm leading-relaxed whitespace-pre-wrap">{techSpec.businessRequirement}</p>
            </div>

            {/* Created Development Objects List */}
            <div className="space-y-4 p-5 bg-[#FAFAFB] border border-[#D1D9E0] rounded-xl shadow-sm hover:shadow-md transition-all duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#D1D9E0]">
                <h3 className="text-xs font-bold text-[#32363A] uppercase tracking-wider flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-[#0040B0]" />
                  Target Development Object Inventory
                </h3>
                <span className="text-[9px] bg-[#E1E4E6] text-[#32363A] border border-[#C2C8CD] font-mono px-2 py-0.5 rounded uppercase font-bold">
                  {techSpec.objectList?.length || 0} Objects Defined
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#D1D9E0] text-[#6A6D70]">
                      <th className="pb-3 font-bold w-[30%]">Object Name</th>
                      <th className="pb-3 font-bold w-[20%]">Type</th>
                      <th className="pb-3 font-bold w-[50%]">Specification Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techSpec.objectList?.map((obj, i) => (
                      <tr key={i} className="border-b border-[#E1E4E6]/50 last:border-b-0 hover:bg-[#FAFAFB] transition-colors">
                        <td className="py-3.5 font-mono text-[#0040B0] font-bold select-all">{obj.name}</td>
                        <td className="py-3.5">
                          <span className="bg-white border border-[#D1D9E0] text-[#0040B0] px-2.5 py-1 rounded-lg text-[9px] uppercase font-mono font-bold shadow-sm">
                            {obj.type}
                          </span>
                        </td>
                        <td className="py-3.5 text-[#32363A] leading-relaxed font-sans">{obj.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-6 animate-fade-in">
            {/* Technical Solution Design */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#515457] uppercase tracking-wider">Technical Solution Design</h3>
              <p className="text-[#32363A] text-sm leading-relaxed whitespace-pre-wrap">{techSpec.solutionDesign}</p>
            </div>

            {/* Program & Code Flow */}
            <div className="space-y-2 pt-4 border-t border-[#D1D9E0]">
              <h3 className="text-xs font-bold text-[#515457] uppercase tracking-wider">Program / Execution Flow</h3>
              <p className="text-[#515457] text-sm leading-relaxed whitespace-pre-wrap">{techSpec.programFlow}</p>
            </div>

            {/* Pseudocode block */}
            <div className="space-y-3 pt-6 border-t border-[#D1D9E0]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#32363A] uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0070F2]" />
                  Procedural Pseudocode
                </h3>
                <span className="text-[10px] bg-slate-100 border border-[#D1D9E0] text-[#515457] font-mono px-2 py-0.5 rounded font-bold">
                  ABAP Pseudo-dialect v1.2
                </span>
              </div>
              <pre className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-xl p-6 text-[13px] font-mono text-[#1E222B] overflow-x-auto whitespace-pre leading-relaxed shadow-inner min-h-[160px]">
                {techSpec.pseudocode}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-fade-in">
            {/* Security Audit */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider">Security &amp; Core Protection</h3>
              <p className="text-[#32363A] text-sm leading-relaxed whitespace-pre-wrap">{techSpec.securityReview}</p>
            </div>

            {/* Authorizations requirements */}
            <div className="space-y-2 pt-4 border-t border-[#D1D9E0]">
              <h3 className="text-xs font-bold text-[#0040B0] uppercase tracking-wider">Authorization Profiles Required</h3>
              <div className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-xl p-3 text-xs font-mono text-[#32363A] leading-relaxed whitespace-pre-wrap shadow-inner">
                {techSpec.authorizations}
              </div>
            </div>

            {/* Error Handling */}
            <div className="space-y-2 pt-4 border-t border-[#D1D9E0]">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Error &amp; Exception Handling</h3>
              <p className="text-[#515457] text-sm leading-relaxed whitespace-pre-wrap">{techSpec.errorHandling}</p>
            </div>

            {/* Performance and Optimization */}
            <div className="space-y-2 pt-4 border-t border-[#D1D9E0]">
              <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Runtime Performance Guidelines</h3>
              <p className="text-[#515457] text-sm leading-relaxed whitespace-pre-wrap">{techSpec.performanceNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Compass, 
  Search, 
  Zap, 
  ShieldCheck, 
  Info, 
  Award
} from 'lucide-react';
import { StandardObject } from '../types';

interface StandardDiscoveryProps {
  standardObjects: StandardObject[];
  moduleName: string;
}

export const StandardDiscovery: React.FC<StandardDiscoveryProps> = ({ standardObjects, moduleName }) => {
  // Sort recommendations: SAP Recommended first, then by Clean Core Score descending
  const sortedObjects = [...standardObjects].sort((a, b) => {
    if (a.isSapRecommended && !b.isSapRecommended) return -1;
    if (!a.isSapRecommended && b.isSapRecommended) return 1;
    return b.cleanCoreScore - a.cleanCoreScore;
  });

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'Excellent': return 'bg-emerald-50 text-[#009245] border-emerald-200';
      case 'Good': return 'bg-blue-50 text-[#0040B0] border-blue-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#009245] border-emerald-300 bg-emerald-50/50';
    if (score >= 70) return 'text-[#0040B0] border-blue-300 bg-blue-50/50';
    if (score >= 50) return 'text-amber-700 border-amber-300 bg-amber-50/50';
    return 'text-rose-700 border-rose-300 bg-rose-50/50';
  };

  return (
    <div className="bg-white border border-[#D1D9E0] rounded-xl p-6 shadow-sm space-y-6" id="standard-discovery-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#D1D9E0] pb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#32363A] flex items-center gap-2">
            <Compass className="text-[#0040B0] w-5 h-5" />
            Standard SAP Object Discovery
          </h2>
          <p className="text-[#6A6D70] text-xs mt-0.5">
            Analyzing standard capabilities to prevent custom code waste and respect Clean Core guidelines.
          </p>
        </div>
        <div>
          <span className="text-xs bg-[#FAFAFB] border border-[#D1D9E0] text-[#32363A] px-3 py-1.5 rounded-lg font-medium">
            Target Module: <strong className="text-[#0040B0]">{moduleName || "S/4HANA"}</strong>
          </span>
        </div>
      </div>

      {sortedObjects.length === 0 ? (
        <div className="text-center py-8 bg-[#FAFAFB] border border-[#D1D9E0] rounded-lg">
          <Search className="w-10 h-10 text-[#6A6D70] mx-auto mb-2" />
          <p className="text-[#32363A] font-semibold">No standard object matches found</p>
          <p className="text-[#6A6D70] text-xs px-4 mt-1 max-w-md mx-auto">
            Try adjusting your manual requirement details to search for transactions, standard CDS views, or APIs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {sortedObjects.map((obj, idx) => (
            <div 
              key={obj.id || idx}
              className={`bg-white border rounded-lg p-3.5 transition duration-150 relative overflow-visible flex flex-col justify-between ${
                obj.isSapRecommended 
                  ? 'border-[#0040B0] shadow-md shadow-blue-50/50' 
                  : 'border-[#D1D9E0] hover:border-[#C2C8CD]'
              }`}
            >
              {/* Highlight ribbon for SAP recommended */}
              {obj.isSapRecommended && (
                <div className="absolute top-0 right-0 bg-[#0040B0] text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Award className="w-3 h-3" /> SAP Recommended Option
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#0040B0] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      {obj.type}
                    </span>
                    <h3 className="text-sm font-bold text-[#32363A] mt-1.5 font-mono">{obj.name}</h3>
                  </div>
                  
                  {/* Clean core Score */}
                  <div className={`border rounded-lg p-1 text-center flex flex-col items-center justify-center w-11 h-11 ${getScoreColor(obj.cleanCoreScore)}`}>
                    <span className="text-[8px] uppercase tracking-wider text-[#6A6D70] font-bold leading-none mb-0.5">Score</span>
                    <span className="text-sm font-bold font-mono leading-none">{obj.cleanCoreScore}</span>
                  </div>
                </div>

                <p className="text-[#6A6D70] text-[11px] mb-2 font-sans line-clamp-2 leading-relaxed">
                  {obj.description}
                </p>
              </div>

              {/* Badges footer */}
              <div className="flex items-center justify-between border-t border-[#D1D9E0] pt-2.5 mt-2.5">
                <div className="flex gap-1.5">
                  <div className={`text-[9px] font-bold border px-2 py-0.5 rounded-full flex items-center gap-1 ${getSafetyColor(obj.upgradeSafety)}`}>
                    <ShieldCheck className="w-2.5 h-2.5" /> Upgrade: {obj.upgradeSafety}
                  </div>
                  
                  <div className="text-[9px] bg-[#FAFAFB] border border-[#D1D9E0] text-[#32363A] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-[#0040B0]" /> Performance: {obj.performanceRating}
                  </div>
                </div>

                {/* Clean Core Reasoning Tooltip */}
                <div className="relative group flex items-center z-40">
                  <button className="flex items-center gap-1 text-[9px] font-bold text-[#0040B0] bg-blue-50/70 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded transition-colors focus:outline-none cursor-pointer">
                    <Info className="w-3 h-3 text-[#0040B0]" />
                    <span>Why this?</span>
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 w-72 bg-white border border-[#D1D9E0] rounded-xl p-3 shadow-xl z-50 text-[11px] text-[#515457] leading-relaxed font-sans normal-case tracking-normal transition-all duration-150 transform translate-y-1 group-hover:translate-y-0">
                    <div className="absolute -bottom-1.5 right-4 w-3 h-3 rotate-45 bg-white border-r border-b border-[#D1D9E0]"></div>
                    <strong className="text-[#32363A] block mb-1">Clean Core Reasoning:</strong>
                    {obj.recommendationReason}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

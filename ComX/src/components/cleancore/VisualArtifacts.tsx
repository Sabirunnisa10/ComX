/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Workflow, 
  Layers, 
  GitCommit, 
  FileCode,
  Download
} from 'lucide-react';

interface VisualArtifactsProps {
  diagrams: {
    flowchartSvg: string;
    sequenceSvg: string;
    dataFlowSvg: string;
  };
}

export const VisualArtifacts: React.FC<VisualArtifactsProps> = ({ diagrams }) => {
  const [selectedDiagram, setSelectedDiagram] = useState<'flowchart' | 'dataflow'>('flowchart');

  const getActiveSvg = () => {
    switch (selectedDiagram) {
      case 'dataflow': return diagrams.dataFlowSvg;
      default: return diagrams.flowchartSvg;
    }
  };

  const downloadSvg = () => {
    const svgStr = getActiveSvg();
    if (!svgStr) return;
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `S4_Architect_${selectedDiagram}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-[#D1D9E0] rounded-xl p-6 shadow-sm space-y-6" id="visual-diagrams-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#D1D9E0] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#32363A] flex items-center gap-2">
            <Workflow className="text-[#0040B0] w-5 h-5" />
            Interactive SAP Solution Blueprints
          </h2>
          <p className="text-[#6A6D70] text-xs mt-0.5">
            Visual vector specifications outlining data models and program flow charts
          </p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="flex bg-[#FAFAFB] p-1 rounded-xl border border-[#D1D9E0] self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedDiagram('flowchart')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedDiagram === 'flowchart' ? 'bg-white text-[#0040B0] shadow-sm' : 'text-[#6A6D70] hover:text-[#32363A]'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" /> Program Flowchart
          </button>
          <button
            onClick={() => setSelectedDiagram('dataflow')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedDiagram === 'dataflow' ? 'bg-white text-[#0040B0] shadow-sm' : 'text-[#6A6D70] hover:text-[#32363A]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Data Pipeline
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-xl p-4 relative flex items-center justify-center min-h-[350px]">
        
        {/* Downloader action floating */}
        <button
          onClick={downloadSvg}
          className="absolute bottom-3 right-3 bg-white hover:bg-[#FAFAFB] text-[#32363A] hover:text-[#0040B0] border border-[#D1D9E0] rounded-lg py-1.5 px-3 text-xs font-bold shadow-sm transition flex items-center gap-1.5 z-10 cursor-pointer"
          title="Download vector SVG"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export SVG</span>
        </button>

        {/* Svg frame */}
        <div 
          className="w-full max-w-2xl text-center self-center"
          dangerouslySetInnerHTML={{ __html: getActiveSvg() || '' }}
        />
      </div>

      {/* Canvas footer metadata details */}
      <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg flex items-center gap-3.5 text-xs text-blue-950 font-sans leading-relaxed">
        <FileCode className="w-4 h-4 text-[#0040B0] flex-shrink-0" />
        <div>
          <span className="font-bold text-[#0040B0]">Architect Specification:</span> All diagrams are dynamically synchronized. If you adjust selection parameters or refine code patterns using the AI chat, these architectural vectors will re-align automatically to keep your visual models up-to-date with your source code.
        </div>
      </div>
    </div>
  );
};

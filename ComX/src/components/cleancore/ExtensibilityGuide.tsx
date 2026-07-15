/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle, 
  Key, 
  Layers, 
  ListOrdered, 
  Map, 
  Settings, 
  Workflow,
  Zap
} from 'lucide-react';
import { ExtensibilityGuide as ExtGuide, OdataRapGuide } from '../types';

interface ExtensibilityGuideProps {
  extensibilityGuide?: ExtGuide;
  odataRapGuide?: OdataRapGuide;
}

export const ExtensibilityGuide: React.FC<ExtensibilityGuideProps> = ({ extensibilityGuide, odataRapGuide }) => {
  const [activeSubTab, setActiveSubTab] = useState<'extensibility' | 'rap'>('extensibility');

  const hasExt = !!extensibilityGuide && extensibilityGuide.steps?.length > 0;
  const hasRap = !!odataRapGuide && odataRapGuide.steps?.length > 0;

  // Sync tab selection based on available data
  React.useEffect(() => {
    if (!hasExt && hasRap) {
      setActiveSubTab('rap');
    } else if (hasExt && !hasRap) {
      setActiveSubTab('extensibility');
    }
  }, [hasExt, hasRap]);

  return (
    <div className="bg-white border border-[#D1D9E0] rounded-xl p-6 shadow-sm space-y-6" id="extensibility-guide-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#D1D9E0] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#32363A] flex items-center gap-2">
            <Layers className="text-[#0040B0] w-5 h-5" />
            S/4HANA Extensibility &amp; RAP Integration Portal
          </h2>
          <p className="text-[#6A6D70] text-xs mt-0.5">
            Official configuration, SPRO paths, and service registration workflows
          </p>
        </div>

        {/* Toggle between BAdI and RAP/OData */}
        <div className="flex bg-[#FAFAFB] p-1 rounded-xl border border-[#D1D9E0] self-start sm:self-auto overflow-x-auto max-w-full">
          {hasExt && (
            <button
              onClick={() => setActiveSubTab('extensibility')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeSubTab === 'extensibility' ? 'bg-white text-[#0040B0] shadow-sm' : 'text-[#6A6D70] hover:text-[#32363A]'
              }`}
            >
              Enhancement Spots &amp; BAdIs
            </button>
          )}
          {hasRap && (
            <button
              onClick={() => setActiveSubTab('rap')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeSubTab === 'rap' ? 'bg-white text-[#0040B0] shadow-sm' : 'text-[#6A6D70] hover:text-[#32363A]'
              }`}
            >
              RAP Services &amp; OData APIs
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'extensibility' && extensibilityGuide && (
        <div className="space-y-6 animate-fade-in">
          {/* Why required */}
          <div className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#0040B0] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Enhancement Architectural Reasoning
            </h3>
            <p className="text-[#32363A] text-sm leading-relaxed">{extensibilityGuide.whyRequired}</p>
          </div>

          {/* Key metadata properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extensibilityGuide.spotName && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">Enhancement Spot</span>
                <span className="text-xs text-[#32363A] font-bold">{extensibilityGuide.spotName}</span>
              </div>
            )}
            {extensibilityGuide.badiName && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">BAdI Definition</span>
                <span className="text-xs text-[#32363A] font-bold">{extensibilityGuide.badiName}</span>
              </div>
            )}
            {extensibilityGuide.implementationClass && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">Implementation Class</span>
                <span className="text-xs text-[#0040B0] font-bold">{extensibilityGuide.implementationClass}</span>
              </div>
            )}
            {extensibilityGuide.interfaceName && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">Interface Name</span>
                <span className="text-xs text-[#32363A] font-bold">{extensibilityGuide.interfaceName}</span>
              </div>
            )}
            {extensibilityGuide.filterValues && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">Filter Bindings</span>
                <span className="text-xs text-amber-750 font-bold">{extensibilityGuide.filterValues}</span>
              </div>
            )}
            {extensibilityGuide.sproPath && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">SPRO Path</span>
                <span className="text-xs text-blue-900 font-sans font-medium">{extensibilityGuide.sproPath}</span>
              </div>
            )}
          </div>

          {/* Interactive BAdI Code Viewer */}
          {(extensibilityGuide.interfaceCode || extensibilityGuide.implementationCode) && (
            <BadiCodeTabs 
              interfaceName={extensibilityGuide.interfaceName || 'ZIF_MM_PO_CLOSURE_CHECK'} 
              implementationClass={extensibilityGuide.implementationClass || 'ZCL_IM_PO_CLOSURE_CHECK_DEFAULT'}
              interfaceCode={extensibilityGuide.interfaceCode} 
              implementationCode={extensibilityGuide.implementationCode} 
            />
          )}

          {/* Step by step Implementation instructions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#32363A] uppercase tracking-wider flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-[#0040B0]" />
              S/4HANA BAdI Creation Steps
            </h3>
            <div className="space-y-2">
              {extensibilityGuide.steps?.map((step, idx) => (
                <div key={idx} className="flex gap-3 bg-white border border-[#D1D9E0] p-3 rounded-lg text-xs leading-relaxed text-[#32363A] shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#FAFAFB] border border-[#D1D9E0] flex items-center justify-center font-bold text-[#0040B0] font-mono text-[11px] flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="pt-0.5">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'rap' && odataRapGuide && (
        <div className="space-y-6 animate-fade-in">
          {/* RAP/OData overview property details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {odataRapGuide.cdsRootView && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">CDS Root View</span>
                <span className="text-xs text-[#0040B0] font-bold">{odataRapGuide.cdsRootView}</span>
              </div>
            )}
            {odataRapGuide.projectionView && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">Projection View</span>
                <span className="text-xs text-[#32363A] font-bold">{odataRapGuide.projectionView}</span>
              </div>
            )}
            {odataRapGuide.behaviorDefinition && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">Behavior Definition (BDEF)</span>
                <span className="text-xs text-[#0070F2] font-bold">{odataRapGuide.behaviorDefinition}</span>
              </div>
            )}
            {odataRapGuide.serviceDefinition && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">Service Definition</span>
                <span className="text-xs text-[#32363A] font-bold">{odataRapGuide.serviceDefinition}</span>
              </div>
            )}
            {odataRapGuide.serviceBinding && (
              <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
                <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">Service Binding</span>
                <span className="text-xs text-amber-700 font-bold">{odataRapGuide.serviceBinding}</span>
              </div>
            )}
            <div className="bg-[#FAFAFB] p-3.5 border border-[#D1D9E0] rounded-lg font-mono shadow-sm">
              <span className="text-[10px] text-[#6A6D70] font-sans uppercase font-bold block mb-1">OData Protocol</span>
              <span className="text-xs text-emerald-700 font-bold">V4 RESTful API</span>
            </div>
          </div>

          {/* Interactive RAP Artifact Tabs - Codes for every section */}
          <RapCodeTabs odataRapGuide={odataRapGuide} />

          {/* How to create OData V4 RESTful API Steps */}
          <div className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#0040B0] uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Comprehensive S/4HANA V4 RESTful API Creation Tutorial (ADT)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#32363A]">
              <div className="space-y-4">
                <div className="border-l-2 border-[#0040B0] pl-3 space-y-1">
                  <strong className="block text-[#0040B0]">Step 1: Create Data Model (CDS Root View)</strong>
                  <p className="text-[#6A6D70] leading-relaxed">
                    In ABAP Development Tools (ADT), right-click your package <code className="bg-white px-1 py-0.5 border text-[#32363A] rounded">ZMM_PO_CLOSURE</code>, select <strong>New -&gt; Data Definition</strong>. Name it <code className="font-mono text-[#0040B0]">{odataRapGuide.cdsRootView || 'ZI_PurchaseOrderClosure'}</code>, specify the standard parent table or released CDS entity, and define the composition to its children.
                  </p>
                </div>
                <div className="border-l-2 border-[#0040B0] pl-3 space-y-1">
                  <strong className="block text-[#0040B0]">Step 2: Define Transactional Behaviors (BDEF)</strong>
                  <p className="text-[#6A6D70] leading-relaxed">
                    Right-click the CDS Root View and select <strong>New -&gt; Behavior Definition</strong>. Name it identical to your root view. Set implementation type to <code className="font-mono text-xs bg-white px-1 border rounded">managed</code> and define actions (like <em className="font-semibold text-slate-800">closePurchaseOrder</em>), and validations on save.
                  </p>
                </div>
                <div className="border-l-2 border-[#0040B0] pl-3 space-y-1">
                  <strong className="block text-[#0040B0]">Step 3: Implement Business Handler Class</strong>
                  <p className="text-[#6A6D70] leading-relaxed">
                    Click the orange lightbulb in the BDEF file to generate the Behavior Implementation structure <code className="font-mono text-xs bg-white px-1 border rounded">{odataRapGuide.behaviorImplementation || 'ZBP_I_PURCHASEORDERCLOSURE'}</code>. Implement custom verification routines and call your released BAdIs here.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-amber-600 pl-3 space-y-1">
                  <strong className="block text-amber-700">Step 4: Design Exposure Layer (CDS Projection)</strong>
                  <p className="text-[#6A6D70] leading-relaxed">
                    Right-click the Root View entity and select <strong>New -&gt; Data Definition</strong>, choosing <strong>Projection View</strong>. Define the subset of fields to project, and annotate elements with metadata references for UI5 / Fiori consumption.
                  </p>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3 space-y-1">
                  <strong className="block text-emerald-700">Step 5: Create Service Definition (ZUI_PO_CLOSURE)</strong>
                  <p className="text-[#6A6D70] leading-relaxed">
                    Right-click the Projection view, choose <strong>New -&gt; Service Definition</strong>. Give it the name <code className="font-mono text-emerald-700 font-bold">{odataRapGuide.serviceDefinition || 'ZUI_PO_CLOSURE'}</code>. Use the syntax <code className="font-mono text-[10px] bg-white border px-1 rounded">expose ZC_PurchaseOrderClosure as PurchaseOrder;</code> to specify exposed endpoints.
                  </p>
                </div>
                <div className="border-l-2 border-purple-600 pl-3 space-y-1">
                  <strong className="block text-purple-700">Step 6: Instantiate Service Binding (V4 Protocol)</strong>
                  <p className="text-[#6A6D70] leading-relaxed">
                    Right-click the Service Definition and select <strong>New -&gt; Service Binding</strong>. Choose binding type <strong>ODATA V4 - UI</strong> (or Web Service) and name it <code className="font-mono text-xs bg-white px-1 border rounded">{odataRapGuide.serviceBinding || 'ZUI_PO_CLOSURE_02'}</code>. Click <strong>Activate</strong>, select the exposed entity, and click <strong>Preview</strong> to launch the Fiori elements sandbox!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Creation Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#32363A] uppercase tracking-wider flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-[#0040B0]" />
              ADT &amp; Service Activation Workflow
            </h3>
            <div className="space-y-2">
              {odataRapGuide.steps?.map((step, idx) => (
                <div key={idx} className="flex gap-3 bg-white border border-[#D1D9E0] p-3 rounded-lg text-xs leading-relaxed text-[#32363A] shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#FAFAFB] border border-[#D1D9E0] flex items-center justify-center font-bold text-[#0040B0] font-mono text-[11px] flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="pt-0.5">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gateway Client & Postman Testing guide */}
          <div className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-bold text-[#32363A] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-700" />
              Gateway Client (/IWFND/GW_CLIENT) Integration Testing
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#32363A] block">1. Service Registration</span>
                <span className="text-[#6A6D70] leading-relaxed">Launch transaction <strong className="font-mono text-[#32363A] bg-white border border-[#D1D9E0] px-1 py-0.5 rounded">/IWFND/MAINT_SERVICE</strong>. Click 'Add Service', locate the service binding, and select package to generate the metadata endpoint.</span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-[#32363A] block">2. Testing OData Query</span>
                <span className="text-[#6A6D70] leading-relaxed">Add URI suffix: <code className="bg-white border border-[#D1D9E0] px-1 py-0.5 rounded text-amber-700 font-mono text-[10px]">/sap/opu/odata4/sap/{odataRapGuide.entitySetName || "ZAPI_SERVICE"}/srvd_ref4/sap/zpo_srv/0001/{odataRapGuide.entitySetName || "PurchaseOrders"}?$top=5</code> and click GET to test retrieval payload.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extensibility Fallback Message */}
      {!hasExt && !hasRap && (
        <div className="text-center py-6 text-[#6A6D70] text-xs">
          Select standard objects first or configure BAdI/RAP developments to inspect implementation pathways.
        </div>
      )}
    </div>
  );
};

/* Additional Subcomponents to render high fidelity codes cleanly with copy controls */

interface BadiCodeTabsProps {
  interfaceName: string;
  implementationClass: string;
  interfaceCode?: string;
  implementationCode?: string;
}

const BadiCodeTabs: React.FC<BadiCodeTabsProps> = ({ interfaceName, implementationClass, interfaceCode, implementationCode }) => {
  const [activeTab, setActiveTab] = useState<'interface' | 'class'>('interface');
  const [copied, setCopied] = useState(false);

  const activeCode = activeTab === 'interface' ? interfaceCode : implementationCode;

  const handleCopy = () => {
    if (activeCode) {
      navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border border-[#D1D9E0] rounded-xl overflow-hidden shadow-sm bg-white space-y-3 p-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#D1D9E0] pb-2">
        <div className="flex gap-1 bg-[#FAFAFB] p-1 border border-[#D1D9E0] rounded-lg text-xs self-start">
          <button
            onClick={() => setActiveTab('interface')}
            className={`px-3 py-1 rounded-md font-mono font-bold transition cursor-pointer ${
              activeTab === 'interface' ? 'bg-white text-[#0040B0] shadow-xs' : 'text-[#6A6D70] hover:text-[#32363A]'
            }`}
          >
            Interface {interfaceName}
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`px-3 py-1 rounded-md font-mono font-bold transition cursor-pointer ${
              activeTab === 'class' ? 'bg-white text-[#0040B0] shadow-xs' : 'text-[#6A6D70] hover:text-[#32363A]'
            }`}
          >
            Class {implementationClass}
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="text-[11px] bg-white hover:bg-[#FAFAFB] border border-[#D1D9E0] rounded-lg px-2.5 py-1 flex items-center gap-1 cursor-pointer font-bold transition self-end sm:self-auto"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <pre className="bg-[#1E222B] text-slate-300 p-4 font-mono text-[11px] overflow-x-auto max-h-[250px] overflow-y-auto leading-relaxed whitespace-pre rounded-lg shadow-inner">
        {activeCode || "* No ABAP code block generated"}
      </pre>
    </div>
  );
};

interface RapCodeTabsProps {
  odataRapGuide: OdataRapGuide;
}

const RapCodeTabs: React.FC<RapCodeTabsProps> = ({ odataRapGuide }) => {
  const tabs = [
    { id: 'root', label: 'Root CDS View', code: odataRapGuide.cdsRootViewCode, filename: odataRapGuide.cdsRootView },
    { id: 'proj', label: 'Projection View', code: odataRapGuide.projectionViewCode, filename: odataRapGuide.projectionView },
    { id: 'bdef', label: 'Behavior Def (BDEF)', code: odataRapGuide.behaviorDefinitionCode, filename: odataRapGuide.behaviorDefinition },
    { id: 'class', label: 'Behavior Class', code: odataRapGuide.behaviorImplementationCode, filename: odataRapGuide.behaviorImplementation },
    { id: 'srvd', label: 'Service Def (SRVD)', code: odataRapGuide.serviceDefinitionCode, filename: odataRapGuide.serviceDefinition },
    { id: 'srvb', label: 'Service Binding', code: odataRapGuide.serviceBindingCode, filename: odataRapGuide.serviceBinding }
  ].filter(t => t.code); // Only show tabs that have code populated

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || 'root');
  const [copied, setCopied] = useState(false);

  if (tabs.length === 0) {
    // If no explicit codes are loaded, fall back to standard metadata displays
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {odataRapGuide.behaviorImplementation && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[#6A6D70] uppercase tracking-wider flex items-center gap-1">
              <Workflow className="w-3.5 h-3.5 text-[#0040B0]" />
              Behavior Implementation Structure
            </span>
            <pre className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-lg p-3 text-[10px] font-mono text-[#32363A] overflow-x-auto max-h-[180px] overflow-y-auto leading-relaxed whitespace-pre shadow-inner">
              {odataRapGuide.behaviorImplementation}
            </pre>
          </div>
        )}

        {odataRapGuide.metadata && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[#6A6D70] uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#0070F2]" />
              Service Metadata / Annotation details
            </span>
            <pre className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-lg p-3 text-[10px] font-mono text-[#32363A] overflow-x-auto max-h-[180px] overflow-y-auto leading-relaxed whitespace-pre shadow-inner">
              {odataRapGuide.metadata}
            </pre>
          </div>
        )}
      </div>
    );
  }

  const selected = tabs.find(t => t.id === activeTab) || tabs[0];

  const handleCopy = () => {
    if (selected?.code) {
      navigator.clipboard.writeText(selected.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border border-[#D1D9E0] rounded-xl overflow-hidden shadow-sm bg-white p-4 space-y-4">
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold text-[#6A6D70] uppercase tracking-wider">
          📂 RAP RESTFUL V4 API SPECIFICATION ARTIFACTS
        </span>
        
        {/* Scrollable File Tabs list */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 bg-[#FAFAFB] p-1 border border-[#D1D9E0] rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCopied(false);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id ? 'bg-white text-[#0040B0] shadow-sm' : 'text-[#6A6D70] hover:text-[#32363A]'
              }`}
            >
              📄 {tab.filename || tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center bg-[#FAFAFB] border border-[#D1D9E0] px-3 py-1.5 rounded-lg text-xs font-mono">
          <span className="text-[#6A6D70]">Selected Artifact: <strong className="text-[#32363A]">{selected.label}</strong></span>
          <button
            onClick={handleCopy}
            className="text-[11px] bg-white hover:bg-slate-50 border border-[#D1D9E0] rounded px-2.5 py-1 cursor-pointer font-bold transition flex items-center gap-1"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <pre className="bg-[#1E222B] text-[#ABB2BF] p-4 font-mono text-[11px] overflow-x-auto max-h-[300px] overflow-y-auto leading-relaxed whitespace-pre rounded-lg shadow-inner">
          {selected.code}
        </pre>
      </div>
    </div>
  );
};

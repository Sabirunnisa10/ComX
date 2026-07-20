/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Cpu, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  GitCompare,
  Sparkles,
  Zap,
  Bookmark
} from 'lucide-react';
import { AbapCode } from '../types';

interface AbapCodeViewerProps {
  abapCode: AbapCode;
  onImproveCode: (improvementType: string) => void;
  improving: boolean;
}

const IMPROVEMENT_PRESETS = [
  { id: 'sql', label: 'Optimize SQL (Joins/Indexes)', icon: Zap, desc: 'Avoid nested queries, use JOINs or FOR ALL ENTRIES' },
  { id: 'cleancore', label: 'Enforce Clean Core Rules', icon: ShieldCheck, desc: 'Bypass direct DB tables, query released S/4HANA views' },
  { id: 'dbcalls', label: 'Reduce DB Roundtrips', icon: Sparkles, desc: 'Introduce buffer states, bulk processing constructs' },
  { id: 'cds', label: 'Convert Logic to CDS View', desc: 'Push data logic directly down to SAP HANA DB tier', icon: FileCode },
  { id: 'rap', label: 'Convert Report to RAP BO', desc: 'Refactor classic ALV lists into standard OData V4 services', icon: RefreshCw },
];

export const AbapCodeViewer: React.FC<AbapCodeViewerProps> = ({ abapCode, onImproveCode, improving }) => {
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [comparisonTab, setComparisonTab] = useState<'current' | 'diff'>('current');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(abapCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Full ABAP syntax tokenizer ────────────────────────────────────────────
  // Token categories rendered with strict, distinct colors (One Dark Pro palette)
  const highlightAbap = (code: string): React.ReactNode[] => {
    if (!code) return [];

    // ── Token definitions — ordered: longest/most-specific first ─────────
    const TOKEN_RULES: { type: string; re: RegExp }[] = [
      // 1. Line comments  (* or ")
      { type: 'comment',     re: /^(\*.*|".*)/                     },
      // 2. Inline comment after statement
      { type: 'inline-cmt',  re: /"[^']*$/                         },
      // 3. String literal  '...' or `...`
      { type: 'string',      re: /('(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/  },
      // 4. Template literal  |...|
      { type: 'template',    re: /(\|[^|]*\|)/                     },
      // 5. Number literal
      { type: 'number',      re: /\b(\d+(?:\.\d+)?)\b/             },
      // 6. Host / escape variable  @<symbol>
      { type: 'host-var',    re: /(@\w+)/                          },
      // 7. Field symbol  <...>
      { type: 'field-sym',   re: /(<[\w-]+>)/                      },
      // 8. Pragma / annotation  ##... or @
      { type: 'pragma',      re: /(##\w+)/                         },
      // 9. Type / built-in types
      { type: 'type-name',   re: /\b(TYPE|TYPES|LIKE|STRUCTURE|TABLE|OF|REF|TO|STANDARD|SORTED|HASHED|INITIAL|SIZE|ABAP_BOOL|STRING|I|F|P|C|N|X|D|T|DECFLOAT16|DECFLOAT34|INT8)\b/i },
      // 10. Statement-level keywords (control flow, OO, data)
      { type: 'keyword',     re: /\b(SELECT|FROM|INTO|WHERE|AND|OR|NOT|ON|INNER|OUTER|LEFT|RIGHT|CROSS|JOIN|GROUP|BY|HAVING|ORDER|ASCENDING|DESCENDING|UNION|DISTINCT|FOR|ALL|ENTRIES|UP|ROWS|SINGLE|APPENDING|BYPASSING|BUFFER|CLIENT|SPECIFIED|USING|KEY|DATA|VALUE|NEW|REDUCE|FILTER|CORRESPONDING|BASE|LOOP|AT|ASSIGNING|FIELD-SYMBOL|ENDLOOP|IF|ELSE|ELSEIF|ENDIF|CASE|WHEN|ENDCASE|WHILE|ENDWHILE|DO|ENDDO|TRY|CATCH|FINALLY|ENDTRY|CLASS|DEFINITION|IMPLEMENTATION|ENDCLASS|INTERFACE|ENDINTERFACE|PUBLIC|PROTECTED|PRIVATE|FINAL|ABSTRACT|SECTION|METHODS|METHOD|ENDMETHOD|RAISING|EXCEPTIONS|CREATE|OBJECT|CALL|FUNCTION|INCLUDE|REPORT|PROGRAM|MODULE|ENDMODULE|FORM|ENDFORM|PERFORM|MOVE|APPEND|INSERT|MODIFY|DELETE|READ|WRITE|CLEAR|FREE|SORT|DESCRIBE|FIELD-GROUPS|OCCURS|ADD|SUBTRACT|MULTIPLY|DIVIDE|COMPUTE|ASSIGN|UNASSIGN|CHECK|EXIT|RETURN|CONTINUE|STOP|REJECT|CONCATENATE|SPLIT|TRANSLATE|CONDENSE|STRLEN|LINES|FIND|REPLACE|MATCH|SHIFT|OVERLAY|PACK|UNPACK|COLLECT|AUTHORITY-CHECK|MESSAGE|RAISE|RESUME|RESUME|SUSPEND|WAIT|COMMIT|ROLLBACK|WORK|OPEN|CLOSE|READ|WRITE|TRANSFER|GET|SET|AT|SELECTION-SCREEN|PARAMETERS|SELECT-OPTIONS|TABLES|NODES|EVENTS|INITIALIZATION|START-OF-SELECTION|END-OF-SELECTION|TOP-OF-PAGE|END-OF-PAGE|REPORT|PROCESS|BEFORE|OUTPUT|AFTER|INPUT|MODULE|CLASS-POOL|FUNCTION-POOL|INTERFACE-POOL|TYPE-POOL|DECIMAL|PLACES|LENGTH|DECIMALS)\b/i },
      // 11. OO instance / class ref keywords
      { type: 'oo-kw',       re: /\b(->|=>|::|~)\b/                },
      // 12. Operator / punctuation tokens
      { type: 'operator',    re: /([=<>!&+\-*/{}[\]().,;:])/       },
      // 13. Identifier (everything else)
      { type: 'ident',       re: /([A-Za-z_][\w-]*)/               },
      // 14. Whitespace (preserved)
      { type: 'ws',          re: /(\s+)/                            },
    ];

    // ── Color map ────────────────────────────────────────────────────────
    // One Dark Pro extended for ABAP — each token class visually distinct
    const COLOR: Record<string, string> = {
      'comment':    '#5C6370',   // muted grey-green italic
      'inline-cmt': '#5C6370',
      'string':     '#98C379',   // green
      'template':   '#56B6C2',   // cyan
      'number':     '#D19A66',   // orange
      'host-var':   '#E5C07B',   // gold  @variable
      'field-sym':  '#61AFEF',   // sky blue  <FS_MAT>
      'pragma':     '#BE5046',   // red-brown  ##NEEDED
      'type-name':  '#E06C75',   // rose  TYPE / STRING / I / F
      'keyword':    '#C678DD',   // purple  SELECT / IF / CLASS
      'oo-kw':      '#ABB2BF',   // light grey  ->  =>
      'operator':   '#ABB2BF',   // light grey  = ( ) , .
      'ident':      '#ABB2BF',   // default text
      'ws':         'inherit',
    };

    // ── Tokenise one line ────────────────────────────────────────────────
    const tokeniseLine = (line: string): React.ReactNode[] => {
      const nodes: React.ReactNode[] = [];
      let rest = line;
      let pos = 0;

      // Full-line comment shortcut
      const trimmed = line.trimStart();
      if (trimmed.startsWith('*') || (trimmed.startsWith('"') && !trimmed.startsWith('"|'))) {
        return [<span key={0} style={{ color: COLOR['comment'], fontStyle: 'italic' }}>{line}</span>];
      }

      while (rest.length > 0) {
        let matched = false;
        for (const rule of TOKEN_RULES) {
          const m = rest.match(rule.re);
          if (m && m.index === 0) {
            const token = m[0];
            const color = COLOR[rule.type] ?? 'inherit';
            const isItalic = rule.type === 'comment' || rule.type === 'inline-cmt';
            const isBold = rule.type === 'keyword' || rule.type === 'type-name';
            nodes.push(
              <span
                key={pos}
                style={{
                  color,
                  fontStyle: isItalic ? 'italic' : undefined,
                  fontWeight: isBold ? '700' : undefined,
                }}
              >
                {token}
              </span>
            );
            rest = rest.slice(token.length);
            pos += token.length;
            matched = true;
            break;
          }
        }
        // Fallback: emit char verbatim
        if (!matched) {
          nodes.push(<span key={pos} style={{ color: COLOR['ident'] }}>{rest[0]}</span>);
          rest = rest.slice(1);
          pos++;
        }
      }
      return nodes;
    };

    const lines = code.split('\n');
    return lines.map((line, idx) => (
      <div
        key={idx}
        className="hover:bg-[#2C313C] flex select-text transition-colors duration-75"
        style={{ minHeight: '1.4em' }}
      >
        {/* Line number gutter */}
        <span
          className="select-none text-right pr-4 font-sans shrink-0"
          style={{ color: '#4B5263', fontSize: '10px', width: '2.6rem', lineHeight: '1.6', paddingTop: '1px' }}
        >
          {idx + 1}
        </span>
        {/* Highlighted line */}
        <span className="flex-1 whitespace-pre leading-relaxed">{tokeniseLine(line)}</span>
      </div>
    ));
  };

  return (
    <div className="bg-white border border-[#D1D9E0] rounded-xl p-6 shadow-sm space-y-6" id="abap-code-viewer-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#D1D9E0] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#32363A] flex items-center gap-2">
            <FileCode className="text-[#0040B0] w-5 h-5" />
            Production-Ready ABAP 7.4+ Source Code
          </h2>
          <p className="text-[#6A6D70] text-xs mt-0.5">
            Standard-compliant, ATC-audited, and upgrade-safe source structure
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {abapCode.originalCode && (
            <div className="bg-[#FAFAFB] border border-[#D1D9E0] p-1 rounded-xl flex gap-1">
              <button
                onClick={() => setComparisonTab('current')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  comparisonTab === 'current' ? 'bg-white text-[#0040B0] shadow-sm' : 'text-[#6A6D70] hover:text-[#32363A]'
                }`}
              >
                Code View
              </button>
              <button
                onClick={() => setComparisonTab('diff')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  comparisonTab === 'diff' ? 'bg-blue-50 text-[#0040B0] shadow-sm' : 'text-[#6A6D70] hover:text-[#32363A]'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" /> Compare Optimizations
              </button>
            </div>
          )}

          <button
            onClick={copyToClipboard}
            className="bg-white hover:bg-[#FAFAFB] text-[#32363A] hover:text-[#0040B0] border border-[#D1D9E0] rounded-lg py-1.5 px-3.5 text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Layout: Code Area */}
      <div className="space-y-4">
        {comparisonTab === 'current' ? (
          <div className="relative rounded-xl overflow-hidden shadow-inner border border-[#D1D9E0]">
            {/* Clean Core Score indicator badge */}
            <div className="absolute top-3 right-3 bg-[#1E222B]/90 border border-[#3E4452] rounded px-3 py-1.5 flex items-center gap-1.5 text-xs z-10 shadow">
              <ShieldCheck className="w-4 h-4 text-[#98C379]" />
              <span className="text-slate-300">Clean Core Score:</span>
              <strong className="text-[#98C379] font-mono font-bold text-sm">{abapCode.cleanCoreScore}%</strong>
            </div>

            <div className="bg-[#1E222B] text-[#ABB2BF] p-5 font-mono text-xs overflow-x-auto leading-relaxed max-h-[550px] overflow-y-auto rounded-xl">
              <div className="space-y-1">{highlightAbap(abapCode.code)}</div>
            </div>
          </div>
        ) : (
          /* Comparison Diff view */
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Original Generated Code
                </span>
                <div className="bg-[#1E222B] border border-[#3E4452] rounded-xl p-3 font-mono text-[10px] max-h-[350px] overflow-y-auto overflow-x-auto leading-relaxed shadow-inner">
                  <div className="space-y-0">{highlightAbap(abapCode.originalCode ?? '')}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> AI Optimized Clean Code
                </span>
                <div className="bg-[#1E222B] border border-[#3E4452] rounded-xl p-3 font-mono text-[10px] max-h-[350px] overflow-y-auto overflow-x-auto leading-relaxed shadow-inner">
                  <div className="space-y-0">{highlightAbap(abapCode.code)}</div>
                </div>
              </div>
            </div>

            {/* Comparison review feedback */}
            {abapCode.reviewFeedback && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-[#0040B0] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0040B0]" /> Code Optimization Breakdown
                </h4>
                <div className="text-xs text-blue-950 font-medium leading-relaxed whitespace-pre-wrap">
                  {abapCode.reviewFeedback}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ATC Compliance Checklist Banner */}
        <div className="bg-[#FAFAFB] border border-[#D1D9E0] rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
          <div>
            <h4 className="text-xs font-bold text-[#32363A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0040B0]" />
              ABAP Test Cockpit (ATC) Audit Checks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {abapCode.atcComplianceChecklist?.map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#6A6D70] font-medium">
                  <Check className="w-3.5 h-3.5 text-[#009245] flex-shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-[#D1D9E0] md:pl-4">
            <h4 className="text-xs font-bold text-[#32363A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-[#0040B0]" />
              S/4HANA Readiness &amp; HANA Porting
            </h4>
            <p className="text-xs text-[#6A6D70] leading-relaxed">
              {abapCode.s4HanaReadinessNotes || "Code is prepared for HANA DB optimization. Direct queries are mapped to released CDS structures to prevent DB table locking during parallel writes."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

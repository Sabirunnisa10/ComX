// ============================================================
//  ScenarioRelationshipViewer.tsx
//  Pure SVG-based SAP document flow diagram
//  Shows 5 parallel procurement flows with swim lanes
// ============================================================

import React from "react";

// ── Box component (reusable rounded rectangle) ────────────────────────────────
interface BoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  subLabel?: string;
  bg: string;
  border: string;
}

function Box({ x, y, width, height, label, subLabel, bg, border }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={bg}
        stroke={border}
        strokeWidth={2}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - (subLabel ? 4 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight="600"
        fill="#1e293b"
      >
        {label}
      </text>
      {subLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={9}
          fill="#64748b"
        >
          {subLabel}
        </text>
      )}
    </g>
  );
}

// ── Arrow connector ──────────────────────────────────────────────────────────
interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}

function Arrow({ x1, y1, x2, y2, color = "#64748b" }: ArrowProps) {
  const arrowSize = 6;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowX = x2 - arrowSize * Math.cos(angle);
  const arrowY = y2 - arrowSize * Math.sin(angle);
  const arrowLeft = {
    x: arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
    y: arrowY - arrowSize * Math.sin(angle + Math.PI / 6),
  };
  const arrowRight = {
    x: arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
    y: arrowY - arrowSize * Math.sin(angle - Math.PI / 6),
  };

  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />
      <polygon
        points={`${x2},${y2} ${arrowLeft.x},${arrowLeft.y} ${arrowRight.x},${arrowRight.y}`}
        fill={color}
      />
    </>
  );
}

// ── Swim lane label ──────────────────────────────────────────────────────────
interface LaneProps {
  y: number;
  label: string;
}

function LaneLabel({ y, label }: LaneProps) {
  return (
    <text
      x={8}
      y={y}
      fontSize={12}
      fontWeight="700"
      fill="#334155"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ScenarioRelationshipViewer() {
  const BOX_W = 160;
  const BOX_H = 48;
  const GAP = 30;
  const LANE_H = 140;
  const START_X = 50;

  // ── Define color scheme ────────────────────────────────────────────────────
  const colors = {
    purchasing: { bg: "#e0e7ff", border: "#6366f1" }, // indigo
    delivery: { bg: "#d1fae5", border: "#10b981" },   // emerald
    inventory: { bg: "#fef3c7", border: "#f59e0b" },  // amber
    financial: { bg: "#fce7f3", border: "#ec4899" },  // pink
    special: { bg: "#ede9fe", border: "#8b5cf6" },    // violet
  };

  // ── Flow 1: Purchase-to-Pay (Standard) ─────────────────────────────────────
  const flow1Y = 50;
  const f1b1 = { x: START_X, y: flow1Y };
  const f1b2 = { x: START_X + BOX_W + GAP, y: flow1Y };
  const f1b3 = { x: START_X + 2 * (BOX_W + GAP), y: flow1Y };
  const f1b4 = { x: START_X + 3 * (BOX_W + GAP), y: flow1Y };
  const f1b5 = { x: START_X + 4 * (BOX_W + GAP), y: flow1Y };

  // ── Flow 2: Scheduling Agreement ───────────────────────────────────────────
  const flow2Y = flow1Y + LANE_H;
  const f2b1 = { x: START_X, y: flow2Y };
  const f2b2 = { x: START_X + BOX_W + GAP, y: flow2Y };
  const f2b3 = { x: START_X + 2 * (BOX_W + GAP), y: flow2Y };
  const f2b4 = { x: START_X + 3 * (BOX_W + GAP), y: flow2Y };
  const f2b5 = { x: START_X + 4 * (BOX_W + GAP), y: flow2Y };

  // ── Flow 3: Intercompany / STO ─────────────────────────────────────────────
  const flow3Y = flow2Y + LANE_H;
  const f3b1 = { x: START_X, y: flow3Y };
  const f3b2 = { x: START_X + BOX_W + GAP, y: flow3Y };
  const f3b3 = { x: START_X + 2 * (BOX_W + GAP), y: flow3Y };
  const f3b4 = { x: START_X + 3 * (BOX_W + GAP), y: flow3Y };
  const f3b5 = { x: START_X + 4 * (BOX_W + GAP), y: flow3Y };

  // ── Flow 4: Special Procurement – Subcontracting ───────────────────────────
  const flow4Y = flow3Y + LANE_H;
  const f4b1 = { x: START_X, y: flow4Y };
  const f4b2 = { x: START_X + BOX_W + GAP, y: flow4Y };
  const f4b3 = { x: START_X + 2 * (BOX_W + GAP), y: flow4Y };
  const f4b4 = { x: START_X + 3 * (BOX_W + GAP), y: flow4Y };
  const f4b5 = { x: START_X + 4 * (BOX_W + GAP), y: flow4Y };

  // ── Flow 5: Inventory Management ───────────────────────────────────────────
  const flow5Y = flow4Y + LANE_H;
  const f5b1 = { x: START_X, y: flow5Y };
  const f5b2 = { x: START_X + BOX_W + GAP, y: flow5Y };
  const f5b3 = { x: START_X + 2 * (BOX_W + GAP), y: flow5Y };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-indigo-950">
        <h2 className="text-base font-bold text-white tracking-tight">
          SAP Document Relationship Flow
        </h2>
        <p className="text-[11px] text-indigo-300 mt-0.5">
          End-to-end procurement process orchestration across MM, WM, and IM modules
        </p>
      </div>

      {/* ── SVG diagram (scrollable container) ────────────────────────────── */}
      <div className="overflow-auto p-6 bg-slate-50">
        <svg
          viewBox="0 0 1200 850"
          className="w-full h-auto"
          style={{ minWidth: "1000px" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
            </marker>
          </defs>

          {/* ── Lane Labels ──────────────────────────────────────────────── */}
          <LaneLabel y={flow1Y + BOX_H / 2} label="1. Purchase-to-Pay" />
          <LaneLabel y={flow2Y + BOX_H / 2} label="2. Scheduling Agreement" />
          <LaneLabel y={flow3Y + BOX_H / 2} label="3. Intercompany STO" />
          <LaneLabel
            y={flow4Y + BOX_H / 2}
            label="4. Special Procurement"
          />
          <LaneLabel
            y={flow5Y + BOX_H / 2}
            label="5. Inventory Management"
          />

          {/* ════════════════════════════════════════════════════════════════
              FLOW 1: Purchase-to-Pay (Standard)
          ════════════════════════════════════════════════════════════════ */}
          <Box
            {...f1b1}
            width={BOX_W}
            height={BOX_H}
            label="PO"
            subLabel="EKKO/EKPO"
            {...colors.purchasing}
          />
          <Box
            {...f1b2}
            width={BOX_W}
            height={BOX_H}
            label="Inbound Delivery"
            {...colors.delivery}
          />
          <Box
            {...f1b3}
            width={BOX_W}
            height={BOX_H}
            label="GR"
            subLabel="MIGO"
            {...colors.inventory}
          />
          <Box
            {...f1b4}
            width={BOX_W}
            height={BOX_H}
            label="Invoice Verification"
            {...colors.financial}
          />
          <Box
            {...f1b5}
            width={BOX_W}
            height={BOX_H}
            label="Payment"
            {...colors.financial}
          />
          <Arrow
            x1={f1b1.x + BOX_W}
            y1={f1b1.y + BOX_H / 2}
            x2={f1b2.x}
            y2={f1b2.y + BOX_H / 2}
          />
          <Arrow
            x1={f1b2.x + BOX_W}
            y1={f1b2.y + BOX_H / 2}
            x2={f1b3.x}
            y2={f1b3.y + BOX_H / 2}
          />
          <Arrow
            x1={f1b3.x + BOX_W}
            y1={f1b3.y + BOX_H / 2}
            x2={f1b4.x}
            y2={f1b4.y + BOX_H / 2}
          />
          <Arrow
            x1={f1b4.x + BOX_W}
            y1={f1b4.y + BOX_H / 2}
            x2={f1b5.x}
            y2={f1b5.y + BOX_H / 2}
          />

          {/* ════════════════════════════════════════════════════════════════
              FLOW 2: Scheduling Agreement Flow
          ════════════════════════════════════════════════════════════════ */}
          <Box
            {...f2b1}
            width={BOX_W}
            height={BOX_H}
            label="Scheduling Agmt"
            subLabel="SA"
            {...colors.purchasing}
          />
          <Box
            {...f2b2}
            width={BOX_W}
            height={BOX_H}
            label="Delivery Schedule"
            {...colors.purchasing}
          />
          <Box
            {...f2b3}
            width={BOX_W}
            height={BOX_H}
            label="Inbound Delivery"
            {...colors.delivery}
          />
          <Box
            {...f2b4}
            width={BOX_W}
            height={BOX_H}
            label="GR Posting"
            {...colors.inventory}
          />
          <Box
            {...f2b5}
            width={BOX_W}
            height={BOX_H}
            label="Invoice"
            {...colors.financial}
          />
          <Arrow
            x1={f2b1.x + BOX_W}
            y1={f2b1.y + BOX_H / 2}
            x2={f2b2.x}
            y2={f2b2.y + BOX_H / 2}
          />
          <Arrow
            x1={f2b2.x + BOX_W}
            y1={f2b2.y + BOX_H / 2}
            x2={f2b3.x}
            y2={f2b3.y + BOX_H / 2}
          />
          <Arrow
            x1={f2b3.x + BOX_W}
            y1={f2b3.y + BOX_H / 2}
            x2={f2b4.x}
            y2={f2b4.y + BOX_H / 2}
          />
          <Arrow
            x1={f2b4.x + BOX_W}
            y1={f2b4.y + BOX_H / 2}
            x2={f2b5.x}
            y2={f2b5.y + BOX_H / 2}
          />

          {/* ════════════════════════════════════════════════════════════════
              FLOW 3: Intercompany / STO Flow
          ════════════════════════════════════════════════════════════════ */}
          <Box
            {...f3b1}
            width={BOX_W}
            height={BOX_H}
            label="Intercompany STO"
            {...colors.purchasing}
          />
          <Box
            {...f3b2}
            width={BOX_W}
            height={BOX_H}
            label="Outbound Delivery"
            subLabel="issuing plant"
            {...colors.delivery}
          />
          <Box
            {...f3b3}
            width={BOX_W}
            height={BOX_H}
            label="GI Posting"
            {...colors.inventory}
          />
          <Box
            {...f3b4}
            width={BOX_W}
            height={BOX_H}
            label="Inbound Delivery"
            subLabel="receiving plant"
            {...colors.delivery}
          />
          <Box
            {...f3b5}
            width={BOX_W}
            height={BOX_H}
            label="GR & IC Billing"
            {...colors.financial}
          />
          <Arrow
            x1={f3b1.x + BOX_W}
            y1={f3b1.y + BOX_H / 2}
            x2={f3b2.x}
            y2={f3b2.y + BOX_H / 2}
          />
          <Arrow
            x1={f3b2.x + BOX_W}
            y1={f3b2.y + BOX_H / 2}
            x2={f3b3.x}
            y2={f3b3.y + BOX_H / 2}
          />
          <Arrow
            x1={f3b3.x + BOX_W}
            y1={f3b3.y + BOX_H / 2}
            x2={f3b4.x}
            y2={f3b4.y + BOX_H / 2}
          />
          <Arrow
            x1={f3b4.x + BOX_W}
            y1={f3b4.y + BOX_H / 2}
            x2={f3b5.x}
            y2={f3b5.y + BOX_H / 2}
          />

          {/* ════════════════════════════════════════════════════════════════
              FLOW 4: Special Procurement – Subcontracting
          ════════════════════════════════════════════════════════════════ */}
          <Box
            {...f4b1}
            width={BOX_W}
            height={BOX_H}
            label="Subcontracting PO"
            {...colors.special}
          />
          <Box
            {...f4b2}
            width={BOX_W}
            height={BOX_H}
            label="Components Issue"
            subLabel="mvt 541"
            {...colors.special}
          />
          <Box
            {...f4b3}
            width={BOX_W}
            height={BOX_H}
            label="Subcontractor Work"
            {...colors.special}
          />
          <Box
            {...f4b4}
            width={BOX_W}
            height={BOX_H}
            label="GR Finished"
            subLabel="mvt 101"
            {...colors.special}
          />
          <Box
            {...f4b5}
            width={BOX_W}
            height={BOX_H}
            label="Consumption"
            subLabel="mvt 543"
            {...colors.special}
          />
          <Arrow
            x1={f4b1.x + BOX_W}
            y1={f4b1.y + BOX_H / 2}
            x2={f4b2.x}
            y2={f4b2.y + BOX_H / 2}
          />
          <Arrow
            x1={f4b2.x + BOX_W}
            y1={f4b2.y + BOX_H / 2}
            x2={f4b3.x}
            y2={f4b3.y + BOX_H / 2}
          />
          <Arrow
            x1={f4b3.x + BOX_W}
            y1={f4b3.y + BOX_H / 2}
            x2={f4b4.x}
            y2={f4b4.y + BOX_H / 2}
          />
          <Arrow
            x1={f4b4.x + BOX_W}
            y1={f4b4.y + BOX_H / 2}
            x2={f4b5.x}
            y2={f4b5.y + BOX_H / 2}
          />

          {/* ════════════════════════════════════════════════════════════════
              FLOW 5: Inventory Management
          ════════════════════════════════════════════════════════════════ */}
          <Box
            {...f5b1}
            width={BOX_W}
            height={BOX_H}
            label="Physical Inventory"
            {...colors.inventory}
          />
          <Box
            {...f5b2}
            width={BOX_W}
            height={BOX_H}
            label="Count Entry"
            {...colors.inventory}
          />
          <Box
            {...f5b3}
            width={BOX_W}
            height={BOX_H}
            label="Diff Posting"
            subLabel="mvt 701/702"
            {...colors.inventory}
          />
          <Arrow
            x1={f5b1.x + BOX_W}
            y1={f5b1.y + BOX_H / 2}
            x2={f5b2.x}
            y2={f5b2.y + BOX_H / 2}
          />
          <Arrow
            x1={f5b2.x + BOX_W}
            y1={f5b2.y + BOX_H / 2}
            x2={f5b3.x}
            y2={f5b3.y + BOX_H / 2}
          />

          {/* Additional Transfer Posting box (separate mini-lane) */}
          <Box
            x={START_X}
            y={flow5Y + 70}
            width={BOX_W}
            height={BOX_H}
            label="Transfer Posting"
            subLabel="mvt 311/344"
            {...colors.inventory}
          />
          <Box
            x={START_X + BOX_W + GAP}
            y={flow5Y + 70}
            width={BOX_W}
            height={BOX_H}
            label="Stock Update"
            {...colors.inventory}
          />
          <Arrow
            x1={START_X + BOX_W}
            y1={flow5Y + 70 + BOX_H / 2}
            x2={START_X + BOX_W + GAP}
            y2={flow5Y + 70 + BOX_H / 2}
          />

          {/* Consignment / Pipeline (separate line under special procurement) */}
          <Box
            x={START_X}
            y={flow4Y + 70}
            width={BOX_W}
            height={BOX_H}
            label="Consignment"
            {...colors.special}
          />
          <Box
            x={START_X + BOX_W + GAP}
            y={flow4Y + 70}
            width={BOX_W}
            height={BOX_H}
            label="Withdrawal"
            subLabel="mvt 201K"
            {...colors.special}
          />
          <Box
            x={START_X + 2 * (BOX_W + GAP)}
            y={flow4Y + 70}
            width={BOX_W}
            height={BOX_H}
            label="Settlement"
            {...colors.financial}
          />
          <Arrow
            x1={START_X + BOX_W}
            y1={flow4Y + 70 + BOX_H / 2}
            x2={START_X + BOX_W + GAP}
            y2={flow4Y + 70 + BOX_H / 2}
          />
          <Arrow
            x1={START_X + BOX_W + GAP + BOX_W}
            y1={flow4Y + 70 + BOX_H / 2}
            x2={START_X + 2 * (BOX_W + GAP)}
            y2={flow4Y + 70 + BOX_H / 2}
          />

          <Box
            x={START_X + 3 * (BOX_W + GAP)}
            y={flow4Y + 70}
            width={BOX_W}
            height={BOX_H}
            label="Pipeline Material"
            {...colors.special}
          />
          <Box
            x={START_X + 4 * (BOX_W + GAP)}
            y={flow4Y + 70}
            width={BOX_W}
            height={BOX_H}
            label="Meter Settlement"
            subLabel="mvt 201P"
            {...colors.financial}
          />
          <Arrow
            x1={START_X + 3 * (BOX_W + GAP) + BOX_W}
            y1={flow4Y + 70 + BOX_H / 2}
            x2={START_X + 4 * (BOX_W + GAP)}
            y2={flow4Y + 70 + BOX_H / 2}
          />
        </svg>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 bg-white px-6 py-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Colour Legend
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border-2"
              style={{
                backgroundColor: colors.purchasing.bg,
                borderColor: colors.purchasing.border,
              }}
            />
            <span className="text-slate-700 font-semibold">
              Purchasing Docs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border-2"
              style={{
                backgroundColor: colors.delivery.bg,
                borderColor: colors.delivery.border,
              }}
            />
            <span className="text-slate-700 font-semibold">Delivery Docs</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border-2"
              style={{
                backgroundColor: colors.inventory.bg,
                borderColor: colors.inventory.border,
              }}
            />
            <span className="text-slate-700 font-semibold">
              Inventory Docs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border-2"
              style={{
                backgroundColor: colors.financial.bg,
                borderColor: colors.financial.border,
              }}
            />
            <span className="text-slate-700 font-semibold">
              Financial Docs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border-2"
              style={{
                backgroundColor: colors.special.bg,
                borderColor: colors.special.border,
              }}
            />
            <span className="text-slate-700 font-semibold">
              Special Procurement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

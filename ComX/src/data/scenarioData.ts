// ============================================================
//  scenarioData.ts
//  SAP Procurement Scenario – Interfaces & Seed Data
//  Consistent reference codes used throughout:
//    Materials : MAT-001 … MAT-012
//    Vendors   : VEND-001 … VEND-010
//    Plants    : PLANT-IN01, PLANT-DE01, PLANT-US01, PLANT-JP01, PLANT-CN01
//    Stor.Locs : SL01 (Main Warehouse), SL02 (Finished Goods),
//                SL03 (Raw Material Store), SL04 (Hazmat Store)
//    Vendors map:
//      VEND-001 = Tata Steel
//      VEND-002 = Motherson Sumi
//      VEND-003 = Bosch Germany
//      VEND-004 = CATL China
//      VEND-005 = Toyota Supplier
//      VEND-006 = DHL Logistics
// ============================================================

// ─────────────────────────────────────────────
// 1. Intercompany Stock Transport Order
// ─────────────────────────────────────────────
export interface IntercompanySTO {
  STO_NUMBER: string;
  SUPPLYING_PLANT: string;
  RECEIVING_PLANT: string;
  SUPPLYING_COMPANY_CODE: string;
  RECEIVING_COMPANY_CODE: string;
  MATERIAL: string;
  QUANTITY: number;
  UOM: string;
  DELIVERY_DATE: string;
  STATUS: "OPEN" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
  BILLING_DOC_NUMBER: string;
  createdAt: string;
}

export const INTERCOMPANY_STO_DATA: IntercompanySTO[] = [
  {
    STO_NUMBER: "STO-2025-0001",
    SUPPLYING_PLANT: "PLANT-DE01",
    RECEIVING_PLANT: "PLANT-IN01",
    SUPPLYING_COMPANY_CODE: "DE01",
    RECEIVING_COMPANY_CODE: "IN01",
    MATERIAL: "MAT-003",
    QUANTITY: 500,
    UOM: "PC",
    DELIVERY_DATE: "2025-03-15",
    STATUS: "DELIVERED",
    BILLING_DOC_NUMBER: "BILL-2025-0001",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    STO_NUMBER: "STO-2025-0002",
    SUPPLYING_PLANT: "PLANT-US01",
    RECEIVING_PLANT: "PLANT-DE01",
    SUPPLYING_COMPANY_CODE: "US01",
    RECEIVING_COMPANY_CODE: "DE01",
    MATERIAL: "MAT-007",
    QUANTITY: 1200,
    UOM: "KG",
    DELIVERY_DATE: "2025-04-01",
    STATUS: "IN_TRANSIT",
    BILLING_DOC_NUMBER: "BILL-2025-0002",
    createdAt: "2025-02-01T09:30:00Z",
  },
  {
    STO_NUMBER: "STO-2025-0003",
    SUPPLYING_PLANT: "PLANT-CN01",
    RECEIVING_PLANT: "PLANT-JP01",
    SUPPLYING_COMPANY_CODE: "CN01",
    RECEIVING_COMPANY_CODE: "JP01",
    MATERIAL: "MAT-010",
    QUANTITY: 300,
    UOM: "PC",
    DELIVERY_DATE: "2025-04-20",
    STATUS: "OPEN",
    BILLING_DOC_NUMBER: "BILL-2025-0003",
    createdAt: "2025-02-15T11:00:00Z",
  },
  {
    STO_NUMBER: "STO-2025-0004",
    SUPPLYING_PLANT: "PLANT-JP01",
    RECEIVING_PLANT: "PLANT-US01",
    SUPPLYING_COMPANY_CODE: "JP01",
    RECEIVING_COMPANY_CODE: "US01",
    MATERIAL: "MAT-005",
    QUANTITY: 800,
    UOM: "PC",
    DELIVERY_DATE: "2025-03-30",
    STATUS: "DELIVERED",
    BILLING_DOC_NUMBER: "BILL-2025-0004",
    createdAt: "2025-01-20T14:00:00Z",
  },
  {
    STO_NUMBER: "STO-2025-0005",
    SUPPLYING_PLANT: "PLANT-IN01",
    RECEIVING_PLANT: "PLANT-CN01",
    SUPPLYING_COMPANY_CODE: "IN01",
    RECEIVING_COMPANY_CODE: "CN01",
    MATERIAL: "MAT-001",
    QUANTITY: 2000,
    UOM: "KG",
    DELIVERY_DATE: "2025-05-10",
    STATUS: "CANCELLED",
    BILLING_DOC_NUMBER: "BILL-2025-0005",
    createdAt: "2025-02-28T07:45:00Z",
  },
];

// ─────────────────────────────────────────────
// 2. Inbound Delivery
// ─────────────────────────────────────────────
export interface InboundDelivery {
  DELIVERY_NUMBER: string;
  VENDOR: string;
  PURCHASING_DOC: string;
  PLANT: string;
  STORAGE_LOCATION: string;
  MATERIAL: string;
  DELIVERY_QUANTITY: number;
  UOM: string;
  PLANNED_DATE: string;
  ACTUAL_DATE: string | null;
  GR_STATUS: "PENDING" | "PARTIAL" | "COMPLETE" | "CANCELLED";
  HU_NUMBER: string;
  createdAt: string;
}

export const INBOUND_DELIVERY_DATA: InboundDelivery[] = [
  {
    DELIVERY_NUMBER: "IDEL-2025-0001",
    VENDOR: "VEND-001",
    PURCHASING_DOC: "PO-2025-0101",
    PLANT: "PLANT-IN01",
    STORAGE_LOCATION: "SL03",
    MATERIAL: "MAT-001",
    DELIVERY_QUANTITY: 1000,
    UOM: "KG",
    PLANNED_DATE: "2025-03-10",
    ACTUAL_DATE: "2025-03-11",
    GR_STATUS: "COMPLETE",
    HU_NUMBER: "HU-2025-0001",
    createdAt: "2025-02-20T08:00:00Z",
  },
  {
    DELIVERY_NUMBER: "IDEL-2025-0002",
    VENDOR: "VEND-003",
    PURCHASING_DOC: "PO-2025-0102",
    PLANT: "PLANT-DE01",
    STORAGE_LOCATION: "SL01",
    MATERIAL: "MAT-003",
    DELIVERY_QUANTITY: 250,
    UOM: "PC",
    PLANNED_DATE: "2025-03-20",
    ACTUAL_DATE: null,
    GR_STATUS: "PENDING",
    HU_NUMBER: "HU-2025-0002",
    createdAt: "2025-03-01T10:00:00Z",
  },
  {
    DELIVERY_NUMBER: "IDEL-2025-0003",
    VENDOR: "VEND-004",
    PURCHASING_DOC: "PO-2025-0103",
    PLANT: "PLANT-CN01",
    STORAGE_LOCATION: "SL03",
    MATERIAL: "MAT-010",
    DELIVERY_QUANTITY: 500,
    UOM: "PC",
    PLANNED_DATE: "2025-04-05",
    ACTUAL_DATE: "2025-04-04",
    GR_STATUS: "PARTIAL",
    HU_NUMBER: "HU-2025-0003",
    createdAt: "2025-03-10T09:30:00Z",
  },
  {
    DELIVERY_NUMBER: "IDEL-2025-0004",
    VENDOR: "VEND-002",
    PURCHASING_DOC: "PO-2025-0104",
    PLANT: "PLANT-IN01",
    STORAGE_LOCATION: "SL01",
    MATERIAL: "MAT-002",
    DELIVERY_QUANTITY: 750,
    UOM: "PC",
    PLANNED_DATE: "2025-04-15",
    ACTUAL_DATE: "2025-04-15",
    GR_STATUS: "COMPLETE",
    HU_NUMBER: "HU-2025-0004",
    createdAt: "2025-03-25T11:00:00Z",
  },
  {
    DELIVERY_NUMBER: "IDEL-2025-0005",
    VENDOR: "VEND-005",
    PURCHASING_DOC: "PO-2025-0105",
    PLANT: "PLANT-JP01",
    STORAGE_LOCATION: "SL02",
    MATERIAL: "MAT-005",
    DELIVERY_QUANTITY: 400,
    UOM: "PC",
    PLANNED_DATE: "2025-04-22",
    ACTUAL_DATE: null,
    GR_STATUS: "CANCELLED",
    HU_NUMBER: "HU-2025-0005",
    createdAt: "2025-04-01T13:00:00Z",
  },
];

// ─────────────────────────────────────────────
// 3. Outbound Delivery
// ─────────────────────────────────────────────
export interface OutboundDelivery {
  DELIVERY_NUMBER: string;
  SHIP_TO_PARTY: string;
  STO_REF: string;
  PLANT: string;
  STORAGE_LOCATION: string;
  MATERIAL: string;
  DELIVERY_QUANTITY: number;
  UOM: string;
  PLANNED_GI_DATE: string;
  ACTUAL_GI_DATE: string | null;
  POD_STATUS: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "RETURNED";
  CARRIER: string;
  TRACKING_NUMBER: string;
  createdAt: string;
}

export const OUTBOUND_DELIVERY_DATA: OutboundDelivery[] = [
  {
    DELIVERY_NUMBER: "ODEL-2025-0001",
    SHIP_TO_PARTY: "PLANT-IN01",
    STO_REF: "STO-2025-0001",
    PLANT: "PLANT-DE01",
    STORAGE_LOCATION: "SL02",
    MATERIAL: "MAT-003",
    DELIVERY_QUANTITY: 500,
    UOM: "PC",
    PLANNED_GI_DATE: "2025-03-12",
    ACTUAL_GI_DATE: "2025-03-12",
    POD_STATUS: "DELIVERED",
    CARRIER: "VEND-006",
    TRACKING_NUMBER: "TRK-2025-0001",
    createdAt: "2025-03-10T07:00:00Z",
  },
  {
    DELIVERY_NUMBER: "ODEL-2025-0002",
    SHIP_TO_PARTY: "PLANT-DE01",
    STO_REF: "STO-2025-0002",
    PLANT: "PLANT-US01",
    STORAGE_LOCATION: "SL02",
    MATERIAL: "MAT-007",
    DELIVERY_QUANTITY: 1200,
    UOM: "KG",
    PLANNED_GI_DATE: "2025-03-28",
    ACTUAL_GI_DATE: "2025-03-29",
    POD_STATUS: "IN_TRANSIT",
    CARRIER: "VEND-006",
    TRACKING_NUMBER: "TRK-2025-0002",
    createdAt: "2025-03-25T08:00:00Z",
  },
  {
    DELIVERY_NUMBER: "ODEL-2025-0003",
    SHIP_TO_PARTY: "PLANT-JP01",
    STO_REF: "STO-2025-0003",
    PLANT: "PLANT-CN01",
    STORAGE_LOCATION: "SL02",
    MATERIAL: "MAT-010",
    DELIVERY_QUANTITY: 300,
    UOM: "PC",
    PLANNED_GI_DATE: "2025-04-18",
    ACTUAL_GI_DATE: null,
    POD_STATUS: "PENDING",
    CARRIER: "VEND-006",
    TRACKING_NUMBER: "TRK-2025-0003",
    createdAt: "2025-04-10T09:00:00Z",
  },
  {
    DELIVERY_NUMBER: "ODEL-2025-0004",
    SHIP_TO_PARTY: "PLANT-US01",
    STO_REF: "STO-2025-0004",
    PLANT: "PLANT-JP01",
    STORAGE_LOCATION: "SL02",
    MATERIAL: "MAT-005",
    DELIVERY_QUANTITY: 800,
    UOM: "PC",
    PLANNED_GI_DATE: "2025-03-25",
    ACTUAL_GI_DATE: "2025-03-26",
    POD_STATUS: "DELIVERED",
    CARRIER: "VEND-006",
    TRACKING_NUMBER: "TRK-2025-0004",
    createdAt: "2025-03-22T10:30:00Z",
  },
  {
    DELIVERY_NUMBER: "ODEL-2025-0005",
    SHIP_TO_PARTY: "PLANT-CN01",
    STO_REF: "STO-2025-0005",
    PLANT: "PLANT-IN01",
    STORAGE_LOCATION: "SL02",
    MATERIAL: "MAT-001",
    DELIVERY_QUANTITY: 2000,
    UOM: "KG",
    PLANNED_GI_DATE: "2025-05-05",
    ACTUAL_GI_DATE: null,
    POD_STATUS: "RETURNED",
    CARRIER: "VEND-006",
    TRACKING_NUMBER: "TRK-2025-0005",
    createdAt: "2025-04-28T06:00:00Z",
  },
];

// ─────────────────────────────────────────────
// 4. Outline Agreement Contract
// ─────────────────────────────────────────────
export interface OutlineAgreementContract {
  CONTRACT_NUMBER: string;
  VENDOR: string;
  COMPANY_CODE: string;
  PLANT: string;
  MATERIAL: string;
  TARGET_QUANTITY: number;
  RELEASE_QUANTITY: number;
  UOM: string;
  NET_PRICE: number;
  CURRENCY: string;
  VALIDITY_START: string;
  VALIDITY_END: string;
  AGREEMENT_TYPE: "MK" | "WK";
  STATUS: "ACTIVE" | "EXPIRED" | "BLOCKED";
  createdAt: string;
}

export const OUTLINE_AGREEMENT_CONTRACT_DATA: OutlineAgreementContract[] = [
  {
    CONTRACT_NUMBER: "CONT-2025-0001",
    VENDOR: "VEND-001",
    COMPANY_CODE: "IN01",
    PLANT: "PLANT-IN01",
    MATERIAL: "MAT-001",
    TARGET_QUANTITY: 50000,
    RELEASE_QUANTITY: 12000,
    UOM: "KG",
    NET_PRICE: 85.5,
    CURRENCY: "INR",
    VALIDITY_START: "2025-01-01",
    VALIDITY_END: "2025-12-31",
    AGREEMENT_TYPE: "WK",
    STATUS: "ACTIVE",
    createdAt: "2024-12-15T08:00:00Z",
  },
  {
    CONTRACT_NUMBER: "CONT-2025-0002",
    VENDOR: "VEND-003",
    COMPANY_CODE: "DE01",
    PLANT: "PLANT-DE01",
    MATERIAL: "MAT-003",
    TARGET_QUANTITY: 0,
    RELEASE_QUANTITY: 0,
    UOM: "PC",
    NET_PRICE: 142.0,
    CURRENCY: "EUR",
    VALIDITY_START: "2025-01-01",
    VALIDITY_END: "2025-06-30",
    AGREEMENT_TYPE: "MK",
    STATUS: "ACTIVE",
    createdAt: "2024-12-20T09:00:00Z",
  },
  {
    CONTRACT_NUMBER: "CONT-2025-0003",
    VENDOR: "VEND-004",
    COMPANY_CODE: "CN01",
    PLANT: "PLANT-CN01",
    MATERIAL: "MAT-010",
    TARGET_QUANTITY: 20000,
    RELEASE_QUANTITY: 8500,
    UOM: "PC",
    NET_PRICE: 320.0,
    CURRENCY: "CNY",
    VALIDITY_START: "2024-07-01",
    VALIDITY_END: "2025-06-30",
    AGREEMENT_TYPE: "WK",
    STATUS: "ACTIVE",
    createdAt: "2024-06-25T10:00:00Z",
  },
  {
    CONTRACT_NUMBER: "CONT-2025-0004",
    VENDOR: "VEND-005",
    COMPANY_CODE: "JP01",
    PLANT: "PLANT-JP01",
    MATERIAL: "MAT-005",
    TARGET_QUANTITY: 30000,
    RELEASE_QUANTITY: 30000,
    UOM: "PC",
    NET_PRICE: 1850.0,
    CURRENCY: "JPY",
    VALIDITY_START: "2024-04-01",
    VALIDITY_END: "2024-12-31",
    AGREEMENT_TYPE: "WK",
    STATUS: "EXPIRED",
    createdAt: "2024-03-15T11:00:00Z",
  },
  {
    CONTRACT_NUMBER: "CONT-2025-0005",
    VENDOR: "VEND-002",
    COMPANY_CODE: "IN01",
    PLANT: "PLANT-IN01",
    MATERIAL: "MAT-002",
    TARGET_QUANTITY: 0,
    RELEASE_QUANTITY: 0,
    UOM: "PC",
    NET_PRICE: 550.0,
    CURRENCY: "INR",
    VALIDITY_START: "2025-02-01",
    VALIDITY_END: "2025-12-31",
    AGREEMENT_TYPE: "MK",
    STATUS: "BLOCKED",
    createdAt: "2025-01-28T07:30:00Z",
  },
];

// ─────────────────────────────────────────────
// 5. Scheduling Agreement
// ─────────────────────────────────────────────
export interface SchedulingAgreement {
  SA_NUMBER: string;
  VENDOR: string;
  COMPANY_CODE: string;
  PLANT: string;
  MATERIAL: string;
  DELIVERY_SCHEDULE_LINE: number;
  SCHEDULED_QUANTITY: number;
  UOM: string;
  SCHEDULED_DATE: string;
  CONFIRMED_DATE: string | null;
  GOODS_RECEIPT_QTY: number;
  JIT_INDICATOR: boolean;
  FORECAST_HORIZON_DAYS: number;
  createdAt: string;
}

export const SCHEDULING_AGREEMENT_DATA: SchedulingAgreement[] = [
  {
    SA_NUMBER: "SA-2025-0001",
    VENDOR: "VEND-002",
    COMPANY_CODE: "IN01",
    PLANT: "PLANT-IN01",
    MATERIAL: "MAT-002",
    DELIVERY_SCHEDULE_LINE: 1,
    SCHEDULED_QUANTITY: 300,
    UOM: "PC",
    SCHEDULED_DATE: "2025-03-05",
    CONFIRMED_DATE: "2025-03-04",
    GOODS_RECEIPT_QTY: 300,
    JIT_INDICATOR: true,
    FORECAST_HORIZON_DAYS: 30,
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    SA_NUMBER: "SA-2025-0002",
    VENDOR: "VEND-003",
    COMPANY_CODE: "DE01",
    PLANT: "PLANT-DE01",
    MATERIAL: "MAT-004",
    DELIVERY_SCHEDULE_LINE: 2,
    SCHEDULED_QUANTITY: 600,
    UOM: "PC",
    SCHEDULED_DATE: "2025-04-10",
    CONFIRMED_DATE: "2025-04-08",
    GOODS_RECEIPT_QTY: 550,
    JIT_INDICATOR: true,
    FORECAST_HORIZON_DAYS: 45,
    createdAt: "2025-02-10T09:00:00Z",
  },
  {
    SA_NUMBER: "SA-2025-0003",
    VENDOR: "VEND-005",
    COMPANY_CODE: "JP01",
    PLANT: "PLANT-JP01",
    MATERIAL: "MAT-005",
    DELIVERY_SCHEDULE_LINE: 3,
    SCHEDULED_QUANTITY: 200,
    UOM: "PC",
    SCHEDULED_DATE: "2025-04-25",
    CONFIRMED_DATE: null,
    GOODS_RECEIPT_QTY: 0,
    JIT_INDICATOR: false,
    FORECAST_HORIZON_DAYS: 60,
    createdAt: "2025-03-01T10:30:00Z",
  },
  {
    SA_NUMBER: "SA-2025-0004",
    VENDOR: "VEND-004",
    COMPANY_CODE: "CN01",
    PLANT: "PLANT-CN01",
    MATERIAL: "MAT-010",
    DELIVERY_SCHEDULE_LINE: 4,
    SCHEDULED_QUANTITY: 1000,
    UOM: "PC",
    SCHEDULED_DATE: "2025-05-01",
    CONFIRMED_DATE: "2025-04-30",
    GOODS_RECEIPT_QTY: 1000,
    JIT_INDICATOR: true,
    FORECAST_HORIZON_DAYS: 15,
    createdAt: "2025-03-20T11:00:00Z",
  },
  {
    SA_NUMBER: "SA-2025-0005",
    VENDOR: "VEND-001",
    COMPANY_CODE: "IN01",
    PLANT: "PLANT-IN01",
    MATERIAL: "MAT-001",
    DELIVERY_SCHEDULE_LINE: 5,
    SCHEDULED_QUANTITY: 2500,
    UOM: "KG",
    SCHEDULED_DATE: "2025-05-15",
    CONFIRMED_DATE: null,
    GOODS_RECEIPT_QTY: 0,
    JIT_INDICATOR: false,
    FORECAST_HORIZON_DAYS: 90,
    createdAt: "2025-04-01T07:00:00Z",
  },
];

// ─────────────────────────────────────────────
// 6. Subcontracting Order
// ─────────────────────────────────────────────
export interface SubcontractingOrder {
  PO_NUMBER: string;
  SUBCONTRACTOR_VENDOR: string;
  COMPONENT_MATERIAL: string;
  COMPONENT_QUANTITY: number;
  FINISHED_MATERIAL: string;
  FINISHED_QUANTITY: number;
  UOM: string;
  PLANT: string;
  SEND_DATE: string;
  RECEIVE_DATE: string | null;
  STATUS: "OPEN" | "COMPONENTS_SENT" | "IN_PROCESS" | "RECEIVED" | "CANCELLED";
  SCRAP_QUANTITY: number;
  createdAt: string;
}

export const SUBCONTRACTING_ORDER_DATA: SubcontractingOrder[] = [
  {
    PO_NUMBER: "SUB-2025-0001",
    SUBCONTRACTOR_VENDOR: "VEND-002",
    COMPONENT_MATERIAL: "MAT-001",
    COMPONENT_QUANTITY: 500,
    FINISHED_MATERIAL: "MAT-006",
    FINISHED_QUANTITY: 490,
    UOM: "PC",
    PLANT: "PLANT-IN01",
    SEND_DATE: "2025-02-15",
    RECEIVE_DATE: "2025-03-01",
    STATUS: "RECEIVED",
    SCRAP_QUANTITY: 10,
    createdAt: "2025-02-10T08:00:00Z",
  },
  {
    PO_NUMBER: "SUB-2025-0002",
    SUBCONTRACTOR_VENDOR: "VEND-003",
    COMPONENT_MATERIAL: "MAT-003",
    COMPONENT_QUANTITY: 200,
    FINISHED_MATERIAL: "MAT-008",
    FINISHED_QUANTITY: 195,
    UOM: "PC",
    PLANT: "PLANT-DE01",
    SEND_DATE: "2025-03-10",
    RECEIVE_DATE: "2025-03-25",
    STATUS: "RECEIVED",
    SCRAP_QUANTITY: 5,
    createdAt: "2025-03-05T09:00:00Z",
  },
  {
    PO_NUMBER: "SUB-2025-0003",
    SUBCONTRACTOR_VENDOR: "VEND-004",
    COMPONENT_MATERIAL: "MAT-009",
    COMPONENT_QUANTITY: 300,
    FINISHED_MATERIAL: "MAT-010",
    FINISHED_QUANTITY: 0,
    UOM: "PC",
    PLANT: "PLANT-CN01",
    SEND_DATE: "2025-04-01",
    RECEIVE_DATE: null,
    STATUS: "IN_PROCESS",
    SCRAP_QUANTITY: 0,
    createdAt: "2025-03-28T10:00:00Z",
  },
  {
    PO_NUMBER: "SUB-2025-0004",
    SUBCONTRACTOR_VENDOR: "VEND-005",
    COMPONENT_MATERIAL: "MAT-005",
    COMPONENT_QUANTITY: 400,
    FINISHED_MATERIAL: "MAT-011",
    FINISHED_QUANTITY: 0,
    UOM: "PC",
    PLANT: "PLANT-JP01",
    SEND_DATE: "2025-04-10",
    RECEIVE_DATE: null,
    STATUS: "COMPONENTS_SENT",
    SCRAP_QUANTITY: 0,
    createdAt: "2025-04-05T11:00:00Z",
  },
  {
    PO_NUMBER: "SUB-2025-0005",
    SUBCONTRACTOR_VENDOR: "VEND-002",
    COMPONENT_MATERIAL: "MAT-002",
    COMPONENT_QUANTITY: 150,
    FINISHED_MATERIAL: "MAT-012",
    FINISHED_QUANTITY: 0,
    UOM: "PC",
    PLANT: "PLANT-IN01",
    SEND_DATE: "2025-05-01",
    RECEIVE_DATE: null,
    STATUS: "OPEN",
    SCRAP_QUANTITY: 0,
    createdAt: "2025-04-20T07:00:00Z",
  },
];

// ─────────────────────────────────────────────
// 7. Consignment Info Record
// ─────────────────────────────────────────────
export interface ConsignmentInfoRecord {
  CONSIGNMENT_IR_NUMBER: string;
  VENDOR: string;
  MATERIAL: string;
  PLANT: string;
  CONSIGNMENT_PRICE: number;
  CURRENCY: string;
  SETTLEMENT_DATE: string;
  STOCK_QTY: number;
  WITHDRAWAL_QTY: number;
  WITHDRAWN_VALUE: number;
  createdAt: string;
}

export const CONSIGNMENT_INFO_RECORD_DATA: ConsignmentInfoRecord[] = [
  {
    CONSIGNMENT_IR_NUMBER: "CIR-2025-0001",
    VENDOR: "VEND-001",
    MATERIAL: "MAT-001",
    PLANT: "PLANT-IN01",
    CONSIGNMENT_PRICE: 82.0,
    CURRENCY: "INR",
    SETTLEMENT_DATE: "2025-03-31",
    STOCK_QTY: 5000,
    WITHDRAWAL_QTY: 1200,
    WITHDRAWN_VALUE: 98400.0,
    createdAt: "2025-01-01T08:00:00Z",
  },
  {
    CONSIGNMENT_IR_NUMBER: "CIR-2025-0002",
    VENDOR: "VEND-003",
    MATERIAL: "MAT-004",
    PLANT: "PLANT-DE01",
    CONSIGNMENT_PRICE: 135.5,
    CURRENCY: "EUR",
    SETTLEMENT_DATE: "2025-03-31",
    STOCK_QTY: 800,
    WITHDRAWAL_QTY: 350,
    WITHDRAWN_VALUE: 47425.0,
    createdAt: "2025-01-05T09:00:00Z",
  },
  {
    CONSIGNMENT_IR_NUMBER: "CIR-2025-0003",
    VENDOR: "VEND-004",
    MATERIAL: "MAT-010",
    PLANT: "PLANT-CN01",
    CONSIGNMENT_PRICE: 310.0,
    CURRENCY: "CNY",
    SETTLEMENT_DATE: "2025-04-30",
    STOCK_QTY: 2000,
    WITHDRAWAL_QTY: 600,
    WITHDRAWN_VALUE: 186000.0,
    createdAt: "2025-02-01T10:00:00Z",
  },
  {
    CONSIGNMENT_IR_NUMBER: "CIR-2025-0004",
    VENDOR: "VEND-005",
    MATERIAL: "MAT-005",
    PLANT: "PLANT-JP01",
    CONSIGNMENT_PRICE: 1780.0,
    CURRENCY: "JPY",
    SETTLEMENT_DATE: "2025-04-30",
    STOCK_QTY: 1500,
    WITHDRAWAL_QTY: 400,
    WITHDRAWN_VALUE: 712000.0,
    createdAt: "2025-02-10T11:00:00Z",
  },
  {
    CONSIGNMENT_IR_NUMBER: "CIR-2025-0005",
    VENDOR: "VEND-002",
    MATERIAL: "MAT-002",
    PLANT: "PLANT-IN01",
    CONSIGNMENT_PRICE: 520.0,
    CURRENCY: "INR",
    SETTLEMENT_DATE: "2025-05-31",
    STOCK_QTY: 600,
    WITHDRAWAL_QTY: 100,
    WITHDRAWN_VALUE: 52000.0,
    createdAt: "2025-03-01T07:30:00Z",
  },
];

// ─────────────────────────────────────────────
// 8. Pipeline Material
// ─────────────────────────────────────────────
export interface PipelineMaterial {
  PIPELINE_INFO_RECORD: string;
  MATERIAL: string;
  VENDOR: string;
  PLANT: string;
  PIPELINE_PRICE: number;
  CURRENCY: string;
  CONSUMPTION_QTY: number;
  BILLING_PERIOD: string;
  LAST_SETTLEMENT_DATE: string;
  METER_READING: number;
  createdAt: string;
}

export const PIPELINE_MATERIAL_DATA: PipelineMaterial[] = [
  {
    PIPELINE_INFO_RECORD: "PLR-2025-0001",
    MATERIAL: "MAT-007",
    VENDOR: "VEND-001",
    PLANT: "PLANT-IN01",
    PIPELINE_PRICE: 4.5,
    CURRENCY: "INR",
    CONSUMPTION_QTY: 30000,
    BILLING_PERIOD: "2025-01",
    LAST_SETTLEMENT_DATE: "2025-02-05",
    METER_READING: 430000,
    createdAt: "2025-01-31T18:00:00Z",
  },
  {
    PIPELINE_INFO_RECORD: "PLR-2025-0002",
    MATERIAL: "MAT-007",
    VENDOR: "VEND-001",
    PLANT: "PLANT-IN01",
    PIPELINE_PRICE: 4.6,
    CURRENCY: "INR",
    CONSUMPTION_QTY: 28500,
    BILLING_PERIOD: "2025-02",
    LAST_SETTLEMENT_DATE: "2025-03-05",
    METER_READING: 458500,
    createdAt: "2025-02-28T18:00:00Z",
  },
  {
    PIPELINE_INFO_RECORD: "PLR-2025-0003",
    MATERIAL: "MAT-008",
    VENDOR: "VEND-003",
    PLANT: "PLANT-DE01",
    PIPELINE_PRICE: 0.12,
    CURRENCY: "EUR",
    CONSUMPTION_QTY: 120000,
    BILLING_PERIOD: "2025-01",
    LAST_SETTLEMENT_DATE: "2025-02-07",
    METER_READING: 890000,
    createdAt: "2025-01-31T18:00:00Z",
  },
  {
    PIPELINE_INFO_RECORD: "PLR-2025-0004",
    MATERIAL: "MAT-009",
    VENDOR: "VEND-004",
    PLANT: "PLANT-CN01",
    PIPELINE_PRICE: 0.85,
    CURRENCY: "CNY",
    CONSUMPTION_QTY: 95000,
    BILLING_PERIOD: "2025-02",
    LAST_SETTLEMENT_DATE: "2025-03-06",
    METER_READING: 1250000,
    createdAt: "2025-02-28T18:00:00Z",
  },
  {
    PIPELINE_INFO_RECORD: "PLR-2025-0005",
    MATERIAL: "MAT-007",
    VENDOR: "VEND-001",
    PLANT: "PLANT-IN01",
    PIPELINE_PRICE: 4.7,
    CURRENCY: "INR",
    CONSUMPTION_QTY: 31200,
    BILLING_PERIOD: "2025-03",
    LAST_SETTLEMENT_DATE: "2025-04-04",
    METER_READING: 489700,
    createdAt: "2025-03-31T18:00:00Z",
  },
];

// ─────────────────────────────────────────────
// 9. Transfer Posting
// ─────────────────────────────────────────────
export interface TransferPosting {
  MATERIAL_DOC_NUMBER: string;
  YEAR: string;
  ITEM: number;
  MATERIAL: string;
  FROM_PLANT: string;
  FROM_SLOC: string;
  TO_PLANT: string;
  TO_SLOC: string;
  QUANTITY: number;
  UOM: string;
  MOVEMENT_TYPE: string;
  POSTING_DATE: string;
  USER: string;
  REASON_CODE: string;
  createdAt: string;
}

export const TRANSFER_POSTING_DATA: TransferPosting[] = [
  {
    MATERIAL_DOC_NUMBER: "MDOC-2025-0001",
    YEAR: "2025",
    ITEM: 1,
    MATERIAL: "MAT-001",
    FROM_PLANT: "PLANT-IN01",
    FROM_SLOC: "SL03",
    TO_PLANT: "PLANT-IN01",
    TO_SLOC: "SL01",
    QUANTITY: 500,
    UOM: "KG",
    MOVEMENT_TYPE: "311",
    POSTING_DATE: "2025-03-05",
    USER: "MMUSER01",
    REASON_CODE: "RC-PROD",
    createdAt: "2025-03-05T08:30:00Z",
  },
  {
    MATERIAL_DOC_NUMBER: "MDOC-2025-0002",
    YEAR: "2025",
    ITEM: 2,
    MATERIAL: "MAT-003",
    FROM_PLANT: "PLANT-DE01",
    FROM_SLOC: "SL01",
    TO_PLANT: "PLANT-DE01",
    TO_SLOC: "SL02",
    QUANTITY: 100,
    UOM: "PC",
    MOVEMENT_TYPE: "311",
    POSTING_DATE: "2025-03-10",
    USER: "MMUSER02",
    REASON_CODE: "RC-QC",
    createdAt: "2025-03-10T09:00:00Z",
  },
  {
    MATERIAL_DOC_NUMBER: "MDOC-2025-0003",
    YEAR: "2025",
    ITEM: 3,
    MATERIAL: "MAT-010",
    FROM_PLANT: "PLANT-CN01",
    FROM_SLOC: "SL03",
    TO_PLANT: "PLANT-JP01",
    TO_SLOC: "SL01",
    QUANTITY: 200,
    UOM: "PC",
    MOVEMENT_TYPE: "344",
    POSTING_DATE: "2025-03-20",
    USER: "MMUSER03",
    REASON_CODE: "RC-XPLANT",
    createdAt: "2025-03-20T10:00:00Z",
  },
  {
    MATERIAL_DOC_NUMBER: "MDOC-2025-0004",
    YEAR: "2025",
    ITEM: 4,
    MATERIAL: "MAT-005",
    FROM_PLANT: "PLANT-JP01",
    FROM_SLOC: "SL04",
    TO_PLANT: "PLANT-JP01",
    TO_SLOC: "SL03",
    QUANTITY: 50,
    UOM: "PC",
    MOVEMENT_TYPE: "411",
    POSTING_DATE: "2025-04-02",
    USER: "MMUSER04",
    REASON_CODE: "RC-CONSIGN",
    createdAt: "2025-04-02T11:00:00Z",
  },
  {
    MATERIAL_DOC_NUMBER: "MDOC-2025-0005",
    YEAR: "2025",
    ITEM: 5,
    MATERIAL: "MAT-002",
    FROM_PLANT: "PLANT-IN01",
    FROM_SLOC: "SL01",
    TO_PLANT: "PLANT-IN01",
    TO_SLOC: "SL04",
    QUANTITY: 75,
    UOM: "PC",
    MOVEMENT_TYPE: "311",
    POSTING_DATE: "2025-04-10",
    USER: "MMUSER01",
    REASON_CODE: "RC-HAZMAT",
    createdAt: "2025-04-10T14:00:00Z",
  },
];

// ─────────────────────────────────────────────
// 10. Physical Inventory Document
// ─────────────────────────────────────────────
export interface PhysicalInventoryDoc {
  PHYS_INV_DOC: string;
  YEAR: string;
  PLANT: string;
  STORAGE_LOCATION: string;
  MATERIAL: string;
  BOOK_QUANTITY: number;
  COUNT_QUANTITY: number;
  UOM: string;
  DIFFERENCE_QUANTITY: number;
  DIFFERENCE_VALUE: number;
  CURRENCY: string;
  RECOUNT_FLAG: boolean;
  POSTED_FLAG: boolean;
  COUNT_DATE: string;
  POSTING_DATE: string | null;
  createdAt: string;
}

export const PHYSICAL_INVENTORY_DOC_DATA: PhysicalInventoryDoc[] = [
  {
    PHYS_INV_DOC: "PIID-2025-0001",
    YEAR: "2025",
    PLANT: "PLANT-IN01",
    STORAGE_LOCATION: "SL03",
    MATERIAL: "MAT-001",
    BOOK_QUANTITY: 4800,
    COUNT_QUANTITY: 4750,
    UOM: "KG",
    DIFFERENCE_QUANTITY: -50,
    DIFFERENCE_VALUE: -4100.0,
    CURRENCY: "INR",
    RECOUNT_FLAG: false,
    POSTED_FLAG: true,
    COUNT_DATE: "2025-03-31",
    POSTING_DATE: "2025-04-02",
    createdAt: "2025-03-31T06:00:00Z",
  },
  {
    PHYS_INV_DOC: "PIID-2025-0002",
    YEAR: "2025",
    PLANT: "PLANT-DE01",
    STORAGE_LOCATION: "SL01",
    MATERIAL: "MAT-003",
    BOOK_QUANTITY: 650,
    COUNT_QUANTITY: 670,
    UOM: "PC",
    DIFFERENCE_QUANTITY: 20,
    DIFFERENCE_VALUE: 2840.0,
    CURRENCY: "EUR",
    RECOUNT_FLAG: false,
    POSTED_FLAG: true,
    COUNT_DATE: "2025-03-31",
    POSTING_DATE: "2025-04-03",
    createdAt: "2025-03-31T07:00:00Z",
  },
  {
    PHYS_INV_DOC: "PIID-2025-0003",
    YEAR: "2025",
    PLANT: "PLANT-CN01",
    STORAGE_LOCATION: "SL03",
    MATERIAL: "MAT-010",
    BOOK_QUANTITY: 1800,
    COUNT_QUANTITY: 1780,
    UOM: "PC",
    DIFFERENCE_QUANTITY: -20,
    DIFFERENCE_VALUE: -6200.0,
    CURRENCY: "CNY",
    RECOUNT_FLAG: true,
    POSTED_FLAG: false,
    COUNT_DATE: "2025-04-15",
    POSTING_DATE: null,
    createdAt: "2025-04-15T08:00:00Z",
  },
  {
    PHYS_INV_DOC: "PIID-2025-0004",
    YEAR: "2025",
    PLANT: "PLANT-JP01",
    STORAGE_LOCATION: "SL02",
    MATERIAL: "MAT-005",
    BOOK_QUANTITY: 900,
    COUNT_QUANTITY: 900,
    UOM: "PC",
    DIFFERENCE_QUANTITY: 0,
    DIFFERENCE_VALUE: 0.0,
    CURRENCY: "JPY",
    RECOUNT_FLAG: false,
    POSTED_FLAG: true,
    COUNT_DATE: "2025-03-31",
    POSTING_DATE: "2025-04-01",
    createdAt: "2025-03-31T09:00:00Z",
  },
  {
    PHYS_INV_DOC: "PIID-2025-0005",
    YEAR: "2025",
    PLANT: "PLANT-US01",
    STORAGE_LOCATION: "SL01",
    MATERIAL: "MAT-007",
    BOOK_QUANTITY: 3500,
    COUNT_QUANTITY: 3480,
    UOM: "KG",
    DIFFERENCE_QUANTITY: -20,
    DIFFERENCE_VALUE: -360.0,
    CURRENCY: "USD",
    RECOUNT_FLAG: false,
    POSTED_FLAG: false,
    COUNT_DATE: "2025-04-20",
    POSTING_DATE: null,
    createdAt: "2025-04-20T10:00:00Z",
  },
];

// ─────────────────────────────────────────────
// 11. Stock Transfer Order (within same company)
// ─────────────────────────────────────────────
export interface StockTransferOrder {
  STO_NUMBER: string;
  DOCUMENT_TYPE: "UB";
  SUPPLYING_PLANT: string;
  RECEIVING_PLANT: string;
  MATERIAL: string;
  QUANTITY: number;
  UOM: string;
  MOVEMENT_TYPE: "351" | "641";
  DELIVERY_NUMBER: string;
  GR_DATE: string | null;
  STATUS: "OPEN" | "DELIVERY_CREATED" | "GR_POSTED" | "CANCELLED";
  ONE_STEP_INDICATOR: boolean;
  createdAt: string;
}

export const STOCK_TRANSFER_ORDER_DATA: StockTransferOrder[] = [
  {
    STO_NUMBER: "UBSTO-2025-0001",
    DOCUMENT_TYPE: "UB",
    SUPPLYING_PLANT: "PLANT-IN01",
    RECEIVING_PLANT: "PLANT-DE01",
    MATERIAL: "MAT-001",
    QUANTITY: 800,
    UOM: "KG",
    MOVEMENT_TYPE: "351",
    DELIVERY_NUMBER: "ODEL-2025-0001",
    GR_DATE: "2025-03-18",
    STATUS: "GR_POSTED",
    ONE_STEP_INDICATOR: false,
    createdAt: "2025-03-01T08:00:00Z",
  },
  {
    STO_NUMBER: "UBSTO-2025-0002",
    DOCUMENT_TYPE: "UB",
    SUPPLYING_PLANT: "PLANT-DE01",
    RECEIVING_PLANT: "PLANT-US01",
    MATERIAL: "MAT-003",
    QUANTITY: 300,
    UOM: "PC",
    MOVEMENT_TYPE: "641",
    DELIVERY_NUMBER: "ODEL-2025-0002",
    GR_DATE: null,
    STATUS: "DELIVERY_CREATED",
    ONE_STEP_INDICATOR: false,
    createdAt: "2025-03-15T09:00:00Z",
  },
  {
    STO_NUMBER: "UBSTO-2025-0003",
    DOCUMENT_TYPE: "UB",
    SUPPLYING_PLANT: "PLANT-CN01",
    RECEIVING_PLANT: "PLANT-JP01",
    MATERIAL: "MAT-010",
    QUANTITY: 500,
    UOM: "PC",
    MOVEMENT_TYPE: "351",
    DELIVERY_NUMBER: "ODEL-2025-0003",
    GR_DATE: null,
    STATUS: "OPEN",
    ONE_STEP_INDICATOR: true,
    createdAt: "2025-04-01T10:00:00Z",
  },
  {
    STO_NUMBER: "UBSTO-2025-0004",
    DOCUMENT_TYPE: "UB",
    SUPPLYING_PLANT: "PLANT-JP01",
    RECEIVING_PLANT: "PLANT-CN01",
    MATERIAL: "MAT-005",
    QUANTITY: 200,
    UOM: "PC",
    MOVEMENT_TYPE: "641",
    DELIVERY_NUMBER: "ODEL-2025-0004",
    GR_DATE: "2025-04-10",
    STATUS: "GR_POSTED",
    ONE_STEP_INDICATOR: false,
    createdAt: "2025-03-28T11:00:00Z",
  },
  {
    STO_NUMBER: "UBSTO-2025-0005",
    DOCUMENT_TYPE: "UB",
    SUPPLYING_PLANT: "PLANT-US01",
    RECEIVING_PLANT: "PLANT-IN01",
    MATERIAL: "MAT-007",
    QUANTITY: 1000,
    UOM: "KG",
    MOVEMENT_TYPE: "351",
    DELIVERY_NUMBER: "ODEL-2025-0005",
    GR_DATE: null,
    STATUS: "CANCELLED",
    ONE_STEP_INDICATOR: true,
    createdAt: "2025-04-05T07:30:00Z",
  },
];

// ============================================================
//  SCENARIO_TABLES — registry of all 11 scenarios
// ============================================================
export interface ScenarioTableMeta {
  key: string;
  label: string;
  endpoint: string;
  primaryKey: string;
  fields: string[];
  description: string;
}

export const SCENARIO_TABLES: ScenarioTableMeta[] = [
  {
    key: "intercompanySTO",
    label: "Intercompany Stock Transport Order",
    endpoint: "/api/scenarios/intercompany-sto",
    primaryKey: "STO_NUMBER",
    fields: [
      "STO_NUMBER",
      "SUPPLYING_PLANT",
      "RECEIVING_PLANT",
      "SUPPLYING_COMPANY_CODE",
      "RECEIVING_COMPANY_CODE",
      "MATERIAL",
      "QUANTITY",
      "UOM",
      "DELIVERY_DATE",
      "STATUS",
      "BILLING_DOC_NUMBER",
      "createdAt",
    ],
    description:
      "Cross-company stock transfer between plants belonging to different company codes, triggering intercompany billing.",
  },
  {
    key: "inboundDelivery",
    label: "Inbound Delivery",
    endpoint: "/api/scenarios/inbound-delivery",
    primaryKey: "DELIVERY_NUMBER",
    fields: [
      "DELIVERY_NUMBER",
      "VENDOR",
      "PURCHASING_DOC",
      "PLANT",
      "STORAGE_LOCATION",
      "MATERIAL",
      "DELIVERY_QUANTITY",
      "UOM",
      "PLANNED_DATE",
      "ACTUAL_DATE",
      "GR_STATUS",
      "HU_NUMBER",
      "createdAt",
    ],
    description:
      "Vendor-to-plant delivery document tracking expected and actual goods receipts against a purchase order.",
  },
  {
    key: "outboundDelivery",
    label: "Outbound Delivery",
    endpoint: "/api/scenarios/outbound-delivery",
    primaryKey: "DELIVERY_NUMBER",
    fields: [
      "DELIVERY_NUMBER",
      "SHIP_TO_PARTY",
      "STO_REF",
      "PLANT",
      "STORAGE_LOCATION",
      "MATERIAL",
      "DELIVERY_QUANTITY",
      "UOM",
      "PLANNED_GI_DATE",
      "ACTUAL_GI_DATE",
      "POD_STATUS",
      "CARRIER",
      "TRACKING_NUMBER",
      "createdAt",
    ],
    description:
      "Plant-to-customer or plant-to-plant shipment document recording goods issue and proof-of-delivery status.",
  },
  {
    key: "outlineAgreementContract",
    label: "Outline Agreement Contract",
    endpoint: "/api/scenarios/outline-agreement-contract",
    primaryKey: "CONTRACT_NUMBER",
    fields: [
      "CONTRACT_NUMBER",
      "VENDOR",
      "COMPANY_CODE",
      "PLANT",
      "MATERIAL",
      "TARGET_QUANTITY",
      "RELEASE_QUANTITY",
      "UOM",
      "NET_PRICE",
      "CURRENCY",
      "VALIDITY_START",
      "VALIDITY_END",
      "AGREEMENT_TYPE",
      "STATUS",
      "createdAt",
    ],
    description:
      "Long-term purchasing agreement (value or quantity contract) with a vendor that releases are drawn against over a validity period.",
  },
  {
    key: "schedulingAgreement",
    label: "Scheduling Agreement",
    endpoint: "/api/scenarios/scheduling-agreement",
    primaryKey: "SA_NUMBER",
    fields: [
      "SA_NUMBER",
      "VENDOR",
      "COMPANY_CODE",
      "PLANT",
      "MATERIAL",
      "DELIVERY_SCHEDULE_LINE",
      "SCHEDULED_QUANTITY",
      "UOM",
      "SCHEDULED_DATE",
      "CONFIRMED_DATE",
      "GOODS_RECEIPT_QTY",
      "JIT_INDICATOR",
      "FORECAST_HORIZON_DAYS",
      "createdAt",
    ],
    description:
      "Time-phased procurement agreement with delivery schedule lines supporting JIT and forecast-based replenishment.",
  },
  {
    key: "subcontractingOrder",
    label: "Subcontracting Order",
    endpoint: "/api/scenarios/subcontracting-order",
    primaryKey: "PO_NUMBER",
    fields: [
      "PO_NUMBER",
      "SUBCONTRACTOR_VENDOR",
      "COMPONENT_MATERIAL",
      "COMPONENT_QUANTITY",
      "FINISHED_MATERIAL",
      "FINISHED_QUANTITY",
      "UOM",
      "PLANT",
      "SEND_DATE",
      "RECEIVE_DATE",
      "STATUS",
      "SCRAP_QUANTITY",
      "createdAt",
    ],
    description:
      "Purchase order where components are sent to an external vendor for processing and finished goods are returned to the issuing plant.",
  },
  {
    key: "consignmentInfoRecord",
    label: "Consignment Info Record",
    endpoint: "/api/scenarios/consignment-info-record",
    primaryKey: "CONSIGNMENT_IR_NUMBER",
    fields: [
      "CONSIGNMENT_IR_NUMBER",
      "VENDOR",
      "MATERIAL",
      "PLANT",
      "CONSIGNMENT_PRICE",
      "CURRENCY",
      "SETTLEMENT_DATE",
      "STOCK_QTY",
      "WITHDRAWAL_QTY",
      "WITHDRAWN_VALUE",
      "createdAt",
    ],
    description:
      "Vendor-owned stock held at the plant premises; liability and payment are triggered only upon withdrawal for use.",
  },
  {
    key: "pipelineMaterial",
    label: "Pipeline Material",
    endpoint: "/api/scenarios/pipeline-material",
    primaryKey: "PIPELINE_INFO_RECORD",
    fields: [
      "PIPELINE_INFO_RECORD",
      "MATERIAL",
      "VENDOR",
      "PLANT",
      "PIPELINE_PRICE",
      "CURRENCY",
      "CONSUMPTION_QTY",
      "BILLING_PERIOD",
      "LAST_SETTLEMENT_DATE",
      "METER_READING",
      "createdAt",
    ],
    description:
      "Continuously available utility or fluid material (e.g. gas, water) consumed directly from a pipeline and settled periodically by meter reading.",
  },
  {
    key: "transferPosting",
    label: "Transfer Posting",
    endpoint: "/api/scenarios/transfer-posting",
    primaryKey: "MATERIAL_DOC_NUMBER",
    fields: [
      "MATERIAL_DOC_NUMBER",
      "YEAR",
      "ITEM",
      "MATERIAL",
      "FROM_PLANT",
      "FROM_SLOC",
      "TO_PLANT",
      "TO_SLOC",
      "QUANTITY",
      "UOM",
      "MOVEMENT_TYPE",
      "POSTING_DATE",
      "USER",
      "REASON_CODE",
      "createdAt",
    ],
    description:
      "Material document for moving stock between storage locations, plants, or stock types using SAP movement types.",
  },
  {
    key: "physicalInventoryDoc",
    label: "Physical Inventory Document",
    endpoint: "/api/scenarios/physical-inventory-doc",
    primaryKey: "PHYS_INV_DOC",
    fields: [
      "PHYS_INV_DOC",
      "YEAR",
      "PLANT",
      "STORAGE_LOCATION",
      "MATERIAL",
      "BOOK_QUANTITY",
      "COUNT_QUANTITY",
      "UOM",
      "DIFFERENCE_QUANTITY",
      "DIFFERENCE_VALUE",
      "CURRENCY",
      "RECOUNT_FLAG",
      "POSTED_FLAG",
      "COUNT_DATE",
      "POSTING_DATE",
      "createdAt",
    ],
    description:
      "Annual or cycle-count document capturing book vs physical count differences and posting inventory adjustments.",
  },
  {
    key: "stockTransferOrder",
    label: "Stock Transfer Order (Intra-Company)",
    endpoint: "/api/scenarios/stock-transfer-order",
    primaryKey: "STO_NUMBER",
    fields: [
      "STO_NUMBER",
      "DOCUMENT_TYPE",
      "SUPPLYING_PLANT",
      "RECEIVING_PLANT",
      "MATERIAL",
      "QUANTITY",
      "UOM",
      "MOVEMENT_TYPE",
      "DELIVERY_NUMBER",
      "GR_DATE",
      "STATUS",
      "ONE_STEP_INDICATOR",
      "createdAt",
    ],
    description:
      "UB-type purchase order for transferring stock between two plants within the same company code, with optional one-step or two-step goods movement.",
  },
];

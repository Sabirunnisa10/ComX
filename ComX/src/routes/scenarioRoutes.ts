import { Router, Request, Response } from "express";
import {
  INTERCOMPANY_STO_DATA,
  INBOUND_DELIVERY_DATA,
  OUTBOUND_DELIVERY_DATA,
  OUTLINE_AGREEMENT_CONTRACT_DATA,
  SCHEDULING_AGREEMENT_DATA,
  SUBCONTRACTING_ORDER_DATA,
  CONSIGNMENT_INFO_RECORD_DATA,
  PIPELINE_MATERIAL_DATA,
  TRANSFER_POSTING_DATA,
  PHYSICAL_INVENTORY_DOC_DATA,
  STOCK_TRANSFER_ORDER_DATA,
  SCENARIO_TABLES,
  IntercompanySTO,
  InboundDelivery,
  OutboundDelivery,
  OutlineAgreementContract,
  SchedulingAgreement,
  SubcontractingOrder,
  ConsignmentInfoRecord,
  PipelineMaterial,
  TransferPosting,
  PhysicalInventoryDoc,
  StockTransferOrder,
} from "../data/scenarioData";

const router = Router();

// ── In-memory mutable stores ──────────────────────────────────────────────────
let intercompanySTOs: IntercompanySTO[] = [...INTERCOMPANY_STO_DATA];
let inboundDeliveries: InboundDelivery[] = [...INBOUND_DELIVERY_DATA];
let outboundDeliveries: OutboundDelivery[] = [...OUTBOUND_DELIVERY_DATA];
let outlineAgreements: OutlineAgreementContract[] = [...OUTLINE_AGREEMENT_CONTRACT_DATA];
let schedulingAgreements: SchedulingAgreement[] = [...SCHEDULING_AGREEMENT_DATA];
let subcontractingOrders: SubcontractingOrder[] = [...SUBCONTRACTING_ORDER_DATA];
let consignmentRecords: ConsignmentInfoRecord[] = [...CONSIGNMENT_INFO_RECORD_DATA];
let pipelineMaterials: PipelineMaterial[] = [...PIPELINE_MATERIAL_DATA];
let transferPostings: TransferPosting[] = [...TRANSFER_POSTING_DATA];
let physicalInventoryDocs: PhysicalInventoryDoc[] = [...PHYSICAL_INVENTORY_DOC_DATA];
let stockTransferOrders: StockTransferOrder[] = [...STOCK_TRANSFER_ORDER_DATA];

// ── Meta ──────────────────────────────────────────────────────────────────────
router.get("/api/scenarios", (_req: Request, res: Response): void => {
  res.json(SCENARIO_TABLES);
});

// ── Intercompany STO ──────────────────────────────────────────────────────────
router.get("/api/scenarios/intercompany-sto", (req: Request, res: Response): void => {
  try {
    const { status, plant } = req.query;
    let results = intercompanySTOs;
    if (typeof status === "string") {
      results = results.filter((r) => r.STATUS === status);
    }
    if (typeof plant === "string") {
      results = results.filter(
        (r) => r.SUPPLYING_PLANT === plant || r.RECEIVING_PLANT === plant
      );
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/intercompany-sto", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<IntercompanySTO>;
    if (!body.STO_NUMBER) {
      body.STO_NUMBER = `ICSTO-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as IntercompanySTO;
    intercompanySTOs.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/intercompany-sto/:id", (req: Request, res: Response): void => {
  try {
    const record = intercompanySTOs.find((r) => r.STO_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Intercompany STO '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/intercompany-sto/:id", (req: Request, res: Response): void => {
  try {
    const idx = intercompanySTOs.findIndex((r) => r.STO_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Intercompany STO '${req.params.id}' not found` });
      return;
    }
    const { STATUS } = req.body as Partial<Pick<IntercompanySTO, "STATUS">>;
    if (STATUS !== undefined) {
      intercompanySTOs[idx] = { ...intercompanySTOs[idx], STATUS };
    }
    res.json(intercompanySTOs[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Inbound Delivery ──────────────────────────────────────────────────────────
router.get("/api/scenarios/inbound-delivery", (req: Request, res: Response): void => {
  try {
    const { vendor, gr_status } = req.query;
    let results = inboundDeliveries;
    if (typeof vendor === "string") {
      results = results.filter((r) => r.VENDOR === vendor);
    }
    if (typeof gr_status === "string") {
      results = results.filter((r) => r.GR_STATUS === gr_status);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/inbound-delivery", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<InboundDelivery>;
    if (!body.DELIVERY_NUMBER) {
      body.DELIVERY_NUMBER = `IBD-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as InboundDelivery;
    inboundDeliveries.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/inbound-delivery/:id", (req: Request, res: Response): void => {
  try {
    const record = inboundDeliveries.find((r) => r.DELIVERY_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Inbound delivery '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/inbound-delivery/:id", (req: Request, res: Response): void => {
  try {
    const idx = inboundDeliveries.findIndex((r) => r.DELIVERY_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Inbound delivery '${req.params.id}' not found` });
      return;
    }
    const { GR_STATUS, ACTUAL_DATE } = req.body as Partial<
      Pick<InboundDelivery, "GR_STATUS" | "ACTUAL_DATE">
    >;
    const updated: InboundDelivery = { ...inboundDeliveries[idx] };
    if (GR_STATUS !== undefined) updated.GR_STATUS = GR_STATUS;
    if (ACTUAL_DATE !== undefined) updated.ACTUAL_DATE = ACTUAL_DATE;
    inboundDeliveries[idx] = updated;
    res.json(inboundDeliveries[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Outbound Delivery ─────────────────────────────────────────────────────────
router.get("/api/scenarios/outbound-delivery", (req: Request, res: Response): void => {
  try {
    const { pod_status, carrier } = req.query;
    let results = outboundDeliveries;
    if (typeof pod_status === "string") {
      results = results.filter((r) => r.POD_STATUS === pod_status);
    }
    if (typeof carrier === "string") {
      results = results.filter((r) => r.CARRIER === carrier);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/outbound-delivery", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<OutboundDelivery>;
    if (!body.DELIVERY_NUMBER) {
      body.DELIVERY_NUMBER = `OBD-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as OutboundDelivery;
    outboundDeliveries.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/outbound-delivery/:id", (req: Request, res: Response): void => {
  try {
    const record = outboundDeliveries.find((r) => r.DELIVERY_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Outbound delivery '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/outbound-delivery/:id", (req: Request, res: Response): void => {
  try {
    const idx = outboundDeliveries.findIndex((r) => r.DELIVERY_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Outbound delivery '${req.params.id}' not found` });
      return;
    }
    const { POD_STATUS, ACTUAL_GI_DATE } = req.body as Partial<
      Pick<OutboundDelivery, "POD_STATUS" | "ACTUAL_GI_DATE">
    >;
    const updated: OutboundDelivery = { ...outboundDeliveries[idx] };
    if (POD_STATUS !== undefined) updated.POD_STATUS = POD_STATUS;
    if (ACTUAL_GI_DATE !== undefined) updated.ACTUAL_GI_DATE = ACTUAL_GI_DATE;
    outboundDeliveries[idx] = updated;
    res.json(outboundDeliveries[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Outline Agreement / Contract ──────────────────────────────────────────────
router.get("/api/scenarios/outline-agreement", (req: Request, res: Response): void => {
  try {
    const { vendor, status } = req.query;
    let results = outlineAgreements;
    if (typeof vendor === "string") {
      results = results.filter((r) => r.VENDOR === vendor);
    }
    if (typeof status === "string") {
      results = results.filter((r) => r.STATUS === status);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/outline-agreement", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<OutlineAgreementContract>;
    if (!body.CONTRACT_NUMBER) {
      body.CONTRACT_NUMBER = `OA-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as OutlineAgreementContract;
    outlineAgreements.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/outline-agreement/:id", (req: Request, res: Response): void => {
  try {
    const record = outlineAgreements.find((r) => r.CONTRACT_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Outline agreement '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/outline-agreement/:id", (req: Request, res: Response): void => {
  try {
    const idx = outlineAgreements.findIndex((r) => r.CONTRACT_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Outline agreement '${req.params.id}' not found` });
      return;
    }
    const { STATUS, RELEASE_QUANTITY } = req.body as Partial<
      Pick<OutlineAgreementContract, "STATUS" | "RELEASE_QUANTITY">
    >;
    const updated: OutlineAgreementContract = { ...outlineAgreements[idx] };
    if (STATUS !== undefined) updated.STATUS = STATUS;
    if (RELEASE_QUANTITY !== undefined) updated.RELEASE_QUANTITY = RELEASE_QUANTITY;
    outlineAgreements[idx] = updated;
    res.json(outlineAgreements[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Scheduling Agreement ──────────────────────────────────────────────────────
router.get("/api/scenarios/scheduling-agreement", (req: Request, res: Response): void => {
  try {
    const { vendor, plant } = req.query;
    let results = schedulingAgreements;
    if (typeof vendor === "string") {
      results = results.filter((r) => r.VENDOR === vendor);
    }
    if (typeof plant === "string") {
      results = results.filter((r) => r.PLANT === plant);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/scheduling-agreement", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<SchedulingAgreement>;
    if (!body.SA_NUMBER) {
      body.SA_NUMBER = `SA-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as SchedulingAgreement;
    schedulingAgreements.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/scheduling-agreement/:id", (req: Request, res: Response): void => {
  try {
    const record = schedulingAgreements.find((r) => r.SA_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Scheduling agreement '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/scheduling-agreement/:id", (req: Request, res: Response): void => {
  try {
    const idx = schedulingAgreements.findIndex((r) => r.SA_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Scheduling agreement '${req.params.id}' not found` });
      return;
    }
    const { CONFIRMED_DATE, GOODS_RECEIPT_QTY } = req.body as Partial<
      Pick<SchedulingAgreement, "CONFIRMED_DATE" | "GOODS_RECEIPT_QTY">
    >;
    const updated: SchedulingAgreement = { ...schedulingAgreements[idx] };
    if (CONFIRMED_DATE !== undefined) updated.CONFIRMED_DATE = CONFIRMED_DATE;
    if (GOODS_RECEIPT_QTY !== undefined) updated.GOODS_RECEIPT_QTY = GOODS_RECEIPT_QTY;
    schedulingAgreements[idx] = updated;
    res.json(schedulingAgreements[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Subcontracting ────────────────────────────────────────────────────────────
router.get("/api/scenarios/subcontracting", (req: Request, res: Response): void => {
  try {
    const { status, plant } = req.query;
    let results = subcontractingOrders;
    if (typeof status === "string") {
      results = results.filter((r) => r.STATUS === status);
    }
    if (typeof plant === "string") {
      results = results.filter((r) => r.PLANT === plant);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/subcontracting", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<SubcontractingOrder>;
    if (!body.PO_NUMBER) {
      body.PO_NUMBER = `SC-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as SubcontractingOrder;
    subcontractingOrders.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/subcontracting/:id", (req: Request, res: Response): void => {
  try {
    const record = subcontractingOrders.find((r) => r.PO_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Subcontracting order '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/subcontracting/:id", (req: Request, res: Response): void => {
  try {
    const idx = subcontractingOrders.findIndex((r) => r.PO_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Subcontracting order '${req.params.id}' not found` });
      return;
    }
    const { STATUS, RECEIVE_DATE } = req.body as Partial<
      Pick<SubcontractingOrder, "STATUS" | "RECEIVE_DATE">
    >;
    const updated: SubcontractingOrder = { ...subcontractingOrders[idx] };
    if (STATUS !== undefined) updated.STATUS = STATUS;
    if (RECEIVE_DATE !== undefined) updated.RECEIVE_DATE = RECEIVE_DATE;
    subcontractingOrders[idx] = updated;
    res.json(subcontractingOrders[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Consignment ───────────────────────────────────────────────────────────────
router.get("/api/scenarios/consignment", (req: Request, res: Response): void => {
  try {
    const { vendor, plant } = req.query;
    let results = consignmentRecords;
    if (typeof vendor === "string") {
      results = results.filter((r) => r.VENDOR === vendor);
    }
    if (typeof plant === "string") {
      results = results.filter((r) => r.PLANT === plant);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/consignment", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<ConsignmentInfoRecord>;
    if (!body.CONSIGNMENT_IR_NUMBER) {
      body.CONSIGNMENT_IR_NUMBER = `CIR-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as ConsignmentInfoRecord;
    consignmentRecords.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/consignment/:id", (req: Request, res: Response): void => {
  try {
    const record = consignmentRecords.find((r) => r.CONSIGNMENT_IR_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Consignment info record '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/consignment/:id", (req: Request, res: Response): void => {
  try {
    const idx = consignmentRecords.findIndex((r) => r.CONSIGNMENT_IR_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Consignment info record '${req.params.id}' not found` });
      return;
    }
    const { STOCK_QTY, WITHDRAWAL_QTY, WITHDRAWN_VALUE } = req.body as Partial<
      Pick<ConsignmentInfoRecord, "STOCK_QTY" | "WITHDRAWAL_QTY" | "WITHDRAWN_VALUE">
    >;
    const updated: ConsignmentInfoRecord = { ...consignmentRecords[idx] };
    if (STOCK_QTY !== undefined) updated.STOCK_QTY = STOCK_QTY;
    if (WITHDRAWAL_QTY !== undefined) updated.WITHDRAWAL_QTY = WITHDRAWAL_QTY;
    if (WITHDRAWN_VALUE !== undefined) updated.WITHDRAWN_VALUE = WITHDRAWN_VALUE;
    consignmentRecords[idx] = updated;
    res.json(consignmentRecords[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Pipeline Material ─────────────────────────────────────────────────────────
router.get("/api/scenarios/pipeline-material", (req: Request, res: Response): void => {
  try {
    const { vendor, plant } = req.query;
    let results = pipelineMaterials;
    if (typeof vendor === "string") {
      results = results.filter((r) => r.VENDOR === vendor);
    }
    if (typeof plant === "string") {
      results = results.filter((r) => r.PLANT === plant);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/pipeline-material", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<PipelineMaterial>;
    if (!body.PIPELINE_INFO_RECORD) {
      body.PIPELINE_INFO_RECORD = `PIR-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as PipelineMaterial;
    pipelineMaterials.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/pipeline-material/:id", (req: Request, res: Response): void => {
  try {
    const record = pipelineMaterials.find((r) => r.PIPELINE_INFO_RECORD === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Pipeline info record '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/pipeline-material/:id", (req: Request, res: Response): void => {
  try {
    const idx = pipelineMaterials.findIndex((r) => r.PIPELINE_INFO_RECORD === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Pipeline info record '${req.params.id}' not found` });
      return;
    }
    const { CONSUMPTION_QTY, METER_READING } = req.body as Partial<
      Pick<PipelineMaterial, "CONSUMPTION_QTY" | "METER_READING">
    >;
    const updated: PipelineMaterial = { ...pipelineMaterials[idx] };
    if (CONSUMPTION_QTY !== undefined) updated.CONSUMPTION_QTY = CONSUMPTION_QTY;
    if (METER_READING !== undefined) updated.METER_READING = METER_READING;
    pipelineMaterials[idx] = updated;
    res.json(pipelineMaterials[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Transfer Posting ──────────────────────────────────────────────────────────
router.get("/api/scenarios/transfer-posting", (req: Request, res: Response): void => {
  try {
    const { movement_type, from_plant } = req.query;
    let results = transferPostings;
    if (typeof movement_type === "string") {
      results = results.filter((r) => r.MOVEMENT_TYPE === movement_type);
    }
    if (typeof from_plant === "string") {
      results = results.filter((r) => r.FROM_PLANT === from_plant);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/transfer-posting", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<TransferPosting>;
    if (!body.MATERIAL_DOC_NUMBER) {
      body.MATERIAL_DOC_NUMBER = `TP-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as TransferPosting;
    transferPostings.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/transfer-posting/:id", (req: Request, res: Response): void => {
  try {
    const record = transferPostings.find((r) => r.MATERIAL_DOC_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Transfer posting '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/transfer-posting/:id", (req: Request, res: Response): void => {
  try {
    const idx = transferPostings.findIndex((r) => r.MATERIAL_DOC_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Transfer posting '${req.params.id}' not found` });
      return;
    }
    const { QUANTITY } = req.body as Partial<Pick<TransferPosting, "QUANTITY">>;
    if (QUANTITY === undefined) {
      res.status(400).json({ error: "QUANTITY is required for correction" });
      return;
    }
    transferPostings[idx] = { ...transferPostings[idx], QUANTITY };
    res.json(transferPostings[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Physical Inventory ────────────────────────────────────────────────────────
router.get("/api/scenarios/physical-inventory", (req: Request, res: Response): void => {
  try {
    const { plant, posted_flag } = req.query;
    let results = physicalInventoryDocs;
    if (typeof plant === "string") {
      results = results.filter((r) => r.PLANT === plant);
    }
    if (typeof posted_flag === "string") {
      const flag = posted_flag.toLowerCase() === "true";
      results = results.filter((r) => r.POSTED_FLAG === flag);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/physical-inventory", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<PhysicalInventoryDoc>;
    if (!body.PHYS_INV_DOC) {
      body.PHYS_INV_DOC = `PI-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as PhysicalInventoryDoc;
    physicalInventoryDocs.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/physical-inventory/:id", (req: Request, res: Response): void => {
  try {
    const record = physicalInventoryDocs.find((r) => r.PHYS_INV_DOC === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Physical inventory doc '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/physical-inventory/:id", (req: Request, res: Response): void => {
  try {
    const idx = physicalInventoryDocs.findIndex((r) => r.PHYS_INV_DOC === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Physical inventory doc '${req.params.id}' not found` });
      return;
    }
    const { COUNT_QUANTITY, POSTED_FLAG, POSTING_DATE } = req.body as Partial<
      Pick<PhysicalInventoryDoc, "COUNT_QUANTITY" | "POSTED_FLAG" | "POSTING_DATE">
    >;
    const updated: PhysicalInventoryDoc = { ...physicalInventoryDocs[idx] };
    if (COUNT_QUANTITY !== undefined) updated.COUNT_QUANTITY = COUNT_QUANTITY;
    if (POSTED_FLAG !== undefined) updated.POSTED_FLAG = POSTED_FLAG;
    if (POSTING_DATE !== undefined) updated.POSTING_DATE = POSTING_DATE;
    physicalInventoryDocs[idx] = updated;
    res.json(physicalInventoryDocs[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── Stock Transfer Order ──────────────────────────────────────────────────────
router.get("/api/scenarios/stock-transfer-order", (req: Request, res: Response): void => {
  try {
    const { status, supplying_plant } = req.query;
    let results = stockTransferOrders;
    if (typeof status === "string") {
      results = results.filter((r) => r.STATUS === status);
    }
    if (typeof supplying_plant === "string") {
      results = results.filter((r) => r.SUPPLYING_PLANT === supplying_plant);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.post("/api/scenarios/stock-transfer-order", (req: Request, res: Response): void => {
  try {
    const body = req.body as Partial<StockTransferOrder>;
    if (!body.STO_NUMBER) {
      body.STO_NUMBER = `STO-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString();
    }
    const record = body as StockTransferOrder;
    stockTransferOrders.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.get("/api/scenarios/stock-transfer-order/:id", (req: Request, res: Response): void => {
  try {
    const record = stockTransferOrders.find((r) => r.STO_NUMBER === req.params.id);
    if (!record) {
      res.status(404).json({ error: `Stock transfer order '${req.params.id}' not found` });
      return;
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

router.patch("/api/scenarios/stock-transfer-order/:id", (req: Request, res: Response): void => {
  try {
    const idx = stockTransferOrders.findIndex((r) => r.STO_NUMBER === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: `Stock transfer order '${req.params.id}' not found` });
      return;
    }
    const { STATUS, GR_DATE } = req.body as Partial<
      Pick<StockTransferOrder, "STATUS" | "GR_DATE">
    >;
    const updated: StockTransferOrder = { ...stockTransferOrders[idx] };
    if (STATUS !== undefined) updated.STATUS = STATUS;
    if (GR_DATE !== undefined) updated.GR_DATE = GR_DATE;
    stockTransferOrders[idx] = updated;
    res.json(stockTransferOrders[idx]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

export default router;

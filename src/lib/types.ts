export type Role =
  | "producer"
  | "aggregator"
  | "distributor"
  | "buyer"
  | "admin";

export type StatusTone =
  | "neutral"
  | "good"
  | "warn"
  | "bad"
  | "info"
  | "gold";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  orgId: string;
  orgName: string;
  orgLegal: string;
  title: string;
};

export type Farm = {
  id: string;
  name: string;
  location: string;
  city: string;
  province: string;
  areaHa: number;
  blocks: number;
  commodity: string;
  status: string;
  certification: string;
  lat: number;
  lng: number;
  photo: string;
};

export type Cycle = {
  id: string;
  farmId: string;
  farm: string;
  commodity: string;
  variety: string;
  plantedAt: string;
  harvestEta: string;
  areaHa: number;
  estimatedKg: number;
  status: string;
};

export type HarvestPlan = {
  id: string;
  cycleId: string;
  farm: string;
  commodity: string;
  date: string;
  volumeKg: number;
  grade: string;
  targetPrice: number;
  readiness: string;
  published: boolean;
};

export type Harvest = {
  id: string;
  planId: string;
  farm: string;
  date: string;
  volumeKg: number;
  variety: string;
  notes: string;
  batchCode: string;
};

export type Batch = {
  id: string;
  code: string;
  commodity: string;
  variety: string;
  source: string;
  farm: string;
  harvestDate: string;
  expiry: string;
  quantityKg: number;
  availableKg: number;
  reservedKg: number;
  grade: string;
  maturity: string;
  defectPct: number;
  status: string;
  owner: string;
  shelfDays: number;
};

export type InventoryRow = {
  id: string;
  batchCode: string;
  commodity: string;
  warehouse: string;
  available: number;
  reserved: number;
  damaged: number;
  expired: number;
  grade: string;
  agingDays: number;
  shelfDays: number;
};

export type Listing = {
  id: string;
  batchCode: string;
  seller: string;
  commodity: string;
  grade: string;
  quantityKg: number;
  minOrderKg: number;
  price: number;
  readyDate: string;
  location: string;
  status: string;
};

export type Rfq = {
  id: string;
  buyer: string;
  commodity: string;
  grade: string;
  quantityKg: number;
  delivery: string;
  date: string;
  targetPrice: number;
  status: string;
  duration: string;
};

export type Quotation = {
  id: string;
  rfqId: string;
  seller: string;
  price: number;
  quantityKg: number;
  validity: string;
  status: string;
};

export type Order = {
  id: string;
  number: string;
  buyer: string;
  seller: string;
  date: string;
  commodity: string;
  quantityKg: number;
  total: number;
  status: string;
  batchCode: string;
};

export type Shipment = {
  id: string;
  number: string;
  orderNumber: string;
  transporter: string;
  vehicle: string;
  driver: string;
  departure: string;
  eta: string;
  destination: string;
  status: string;
  quantityKg: number;
};

export type Invoice = {
  id: string;
  number: string;
  orderNumber: string;
  amount: number;
  due: string;
  paidAt?: string;
  status: string;
  counterparty: string;
};

export type TraceEvent = {
  id: string;
  batchCode: string;
  type: string;
  org: string;
  time: string;
  location: string;
  note: string;
};

export type Organization = {
  id: string;
  name: string;
  legal: string;
  type: Role;
  city: string;
  province: string;
  users: number;
  status: string;
  plan: string;
  volumeKg: number;
};

export type SupplierScore = {
  id: string;
  name: string;
  type: string;
  commodity: string;
  quality: number;
  onTime: number;
  reject: number;
  overall: number;
  volumeKg: number;
};

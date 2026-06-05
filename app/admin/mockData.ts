// Mock data for admin panel
export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  fileName: string;
  status: "pending_payment" | "deposit_paid" | "printing" | "quality_check" | "ready_for_pickup" | "shipped" | "delivered" | "cancelled";
  priority: "normal" | "express" | "urgent";
  material: string;
  colour: string;
  quantity: number;
  printConfig: {
    layerHeight: number;
    infill: number;
    quality: string;
  };
  quote: {
    total: number;
    deposit: number;
    balance: number;
  };
  createdAt: Date;
  estimatedReady: Date;
  notes: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  pricePerGram: number;
  colours: string[];
  inStock: boolean;
}

export const mockOrders: Order[] = [
  {
    id: "PL3D-10234",
    customer: { name: "Sarah Kabbale", email: "sarah@example.com", phone: "+256 700 123 456" },
    fileName: "bracket_assembly_v2.stl",
    status: "printing",
    priority: "normal",
    material: "PLA",
    colour: "Red",
    quantity: 1,
    printConfig: { layerHeight: 0.2, infill: 20, quality: "Normal" },
    quote: { total: 125000, deposit: 62500, balance: 62500 },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    estimatedReady: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    notes: "Bracket for desk organizer. Customer confirmed specs via email.",
  },
  {
    id: "PL3D-10235",
    customer: { name: "James Okello", email: "james@example.com", phone: "+256 701 234 567" },
    fileName: "phone_stand.stl",
    status: "deposit_paid",
    priority: "express",
    material: "PLA",
    colour: "Black",
    quantity: 2,
    printConfig: { layerHeight: 0.15, infill: 25, quality: "High" },
    quote: { total: 95000, deposit: 47500, balance: 47500 },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    estimatedReady: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000),
    notes: "Express order. Rush print for client demo.",
  },
  {
    id: "PL3D-10236",
    customer: { name: "Amelia Nakigude", email: "amelia@example.com", phone: "+256 702 345 678" },
    fileName: "custom_lithophane.stl",
    status: "quality_check",
    priority: "normal",
    material: "PLA",
    colour: "White",
    quantity: 1,
    printConfig: { layerHeight: 0.1, infill: 15, quality: "High" },
    quote: { total: 185000, deposit: 92500, balance: 92500 },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    estimatedReady: new Date(Date.now() + 0.25 * 24 * 60 * 60 * 1000),
    notes: "Lithophane with sanding post-processing.",
  },
  {
    id: "PL3D-10237",
    customer: { name: "David Tumuhe", email: "david@example.com", phone: "+256 703 456 789" },
    fileName: "gearbox_assembly.stl",
    status: "ready_for_pickup",
    priority: "normal",
    material: "PLA",
    colour: "Yellow",
    quantity: 3,
    printConfig: { layerHeight: 0.2, infill: 30, quality: "Normal" },
    quote: { total: 215000, deposit: 107500, balance: 107500 },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    estimatedReady: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: "Gearbox assembly printed successfully. Ready for customer pickup.",
  },
  {
    id: "PL3D-10238",
    customer: { name: "Priya Sharma", email: "priya@example.com", phone: "+256 704 567 890" },
    fileName: "drone_frame.stl",
    status: "pending_payment",
    priority: "urgent",
    material: "PLA",
    colour: "Black",
    quantity: 1,
    printConfig: { layerHeight: 0.15, infill: 35, quality: "High" },
    quote: { total: 325000, deposit: 162500, balance: 162500 },
    createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
    estimatedReady: new Date(Date.now() + 0.75 * 24 * 60 * 60 * 1000),
    notes: "Urgent drone frame. Follow up with customer about deposit.",
  },
  {
    id: "PL3D-10239",
    customer: { name: "Beatrice Mugisha", email: "beatrice@example.com", phone: "+256 705 678 901" },
    fileName: "jewelry_pendant.stl",
    status: "delivered",
    priority: "normal",
    material: "PLA",
    colour: "Red",
    quantity: 5,
    printConfig: { layerHeight: 0.1, infill: 10, quality: "High" },
    quote: { total: 155000, deposit: 77500, balance: 77500 },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    estimatedReady: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notes: "Jewelry pendants delivered to customer on 2026-05-28.",
  },
  {
    id: "PL3D-10240",
    customer: { name: "Michael Kabugo", email: "michael@example.com", phone: "+256 706 789 012" },
    fileName: "rc_car_body.stl",
    status: "shipped",
    priority: "normal",
    material: "PLA",
    colour: "White",
    quantity: 2,
    printConfig: { layerHeight: 0.2, infill: 25, quality: "Normal" },
    quote: { total: 175000, deposit: 87500, balance: 87500 },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    estimatedReady: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: "RC car body shipped via DHL on 2026-06-02.",
  },
];

export const mockMaterials: Material[] = [
  {
    id: "mat-pla",
    name: "PLA",
    description: "Eco-friendly biodegradable thermoplastic. Perfect for prototypes and functional parts.",
    pricePerGram: 0.5,
    colours: ["Red", "Yellow", "Black", "White"],
    inStock: true,
  },
];

export interface Settings {
  setupFee: number;
  customColourFee: number;
  depositPercentage: number;
  quoteValidHours: number;
  expressSurchargePercent: number;
  labEmail: string;
  labPhone: string;
  labAddress: string;
  slicerPreviewEnabled: boolean;
  maintenanceMode: boolean;
}

export const mockSettings: Settings = {
  setupFee: 15000,
  customColourFee: 5000,
  depositPercentage: 50,
  quoteValidHours: 48,
  expressSurchargePercent: 25,
  labEmail: "hello@pearllabs.ug",
  labPhone: "+256 (0) 200 901 001",
  labAddress: "Kololo, Kampala, Uganda",
  slicerPreviewEnabled: true,
  maintenanceMode: false,
};

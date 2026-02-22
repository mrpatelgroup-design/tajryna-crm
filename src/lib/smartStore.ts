import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  id: string;
  itemName: string;
  itemHSN: string;
  category: string;
  description: string;
  itemCode: string;
  servicePeriod: number;
  itemImage: string;
  mrp: number;
  salePrice: number;
  wholesalePrice: number;
  purchasePrice: number;
  taxes: string;
  stock: number;
  minStock: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  type: string;
  location: string;
  contact: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  state: string;
  gstin: string;
  creditLimit: number;
  status: string;
}

interface Order {
  id: string;
  type: string;
  partyType: string;
  customer: string;
  customerId: string;
  salesPerson: string;
  salesPersonId: string;
  payment: string;
  godown: string;
  billingName: string;
  billingAddress: string;
  shippingAddress: string;
  poNo: string;
  poDate: string;
  ewayBillNo: string;
  invoiceNumber: string;
  invoiceDate: string;
  time: string;
  stateOfSupply: string;
  items: OrderItem[];
  deliveryLocation: string;
  description: string;
  image: string;
  document: string;
  copies: string;
  discount: number;
  shipping: number;
  packaging: number;
  adjustment: number;
  roundOff: number;
  total: number;
  date: string;
  status: string;
}

interface OrderItem {
  id: string;
  item: string;
  productId: string;
  description: string;
  count: number;
  batchNo: string;
  expDate: string;
  mrp: number;
  qty: number;
  freeQty: number;
  unit: string;
  priceUnit: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  addCess: number;
  amount: number;
}

interface Estimate {
  id: string;
  customer: string;
  customerId: string;
  salesPerson: string;
  salesPersonId: string;
  date: string;
  validTill: string;
  amount: number;
  items: OrderItem[];
  status: string;
}

interface PaymentIn {
  id: string;
  customer: string;
  customerId: string;
  salesPerson: string;
  salesPersonId: string;
  orderId: string;
  date: string;
  amount: number;
  mode: string;
  reference: string;
  status: string;
}

interface SalesReturn {
  id: string;
  customer: string;
  customerId: string;
  salesPerson: string;
  salesPersonId: string;
  orderId: string;
  date: string;
  invoiceRef: string;
  amount: number;
  reason: string;
  status: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  zone: string;
  salary: number;
  allowances: number;
  status: string;
}

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Holiday';
  checkIn: string;
  checkOut: string;
  overtime: number;
}

interface Target {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  salesTarget: number;
  collectionTarget: number;
  newCustomerTarget: number;
  actualSales: number;
  actualCollection: number;
  actualCustomers: number;
  achievementPercent: number;
  incentive: number;
  status: string;
}

interface Loyalty {
  id: string;
  customerId: string;
  customerName: string;
  salesPersonId: string;
  salesPersonName: string;
  points: number;
  tier: string;
  totalPurchase: number;
  lastTransaction: string;
}

interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  daysWorked: number;
  totalDays: number;
  workingDays: number;
  unpaidLeaveDays: number;
  paidLeaveDays: number;
  holidayDays: number;
  basicSalary: number;
  adjustedSalary: number;
  allowances: number;
  incentive: number;
  loyaltyBonus: number;
  attendanceBonus: number;
  targetBonus: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  paymentDate: string;
  paymentMode: string;
  status: string;
  attendanceScore: number;
  targetAchievement: number;
  loyaltyPointsGenerated: number;
  totalSales: number;
  recalculationSource: string;
}

interface NetworkNode {
  id: string;
  name: string;
  type: 'HQ' | 'SuperStockist' | 'Distributor' | 'SalesPerson';
  parentId: string | null;
  location: string;
  contact: string;
  email: string;
  zone: string;
  status: string;
  image: string;
  children?: NetworkNode[];
}

interface InventoryRecord {
  id: string;
  productId: string;
  productName: string;
  category: string;
  hqStock: number;
  superStockistStock: number;
  distributorStock: number;
  totalStock: number;
  minStock: number;
  lastUpdated: string;
}

interface AppData {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  estimates: Estimate[];
  proformaInvoices: any[];
  paymentIn: PaymentIn[];
  deliveryChallans: any[];
  salesReturn: SalesReturn[];
  team: TeamMember[];
  distributions: any[];
  beats: any[];
  routes: any[];
  inventory: InventoryRecord[];
  loyalty: Loyalty[];
  schemes: any[];
  targets: Target[];
  attendance: Attendance[];
  payroll: Payroll[];
  network: NetworkNode[];
}

interface SmartStore {
  data: AppData;
  
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  
  addEstimate: (estimate: Estimate) => void;
  updateEstimate: (estimate: Estimate) => void;
  deleteEstimate: (id: string) => void;
  
  addPayment: (payment: PaymentIn) => void;
  updatePayment: (payment: PaymentIn) => void;
  deletePayment: (id: string) => void;
  
  addSalesReturn: (returnData: SalesReturn) => void;
  updateSalesReturn: (returnData: SalesReturn) => void;
  deleteSalesReturn: (id: string) => void;
  
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  
  addPayroll: (payroll: Payroll) => void;
  updatePayroll: (payroll: Payroll) => void;
  deletePayroll: (id: string) => void;
  
  addNetworkNode: (node: NetworkNode) => void;
  updateNetworkNode: (node: NetworkNode) => void;
  deleteNetworkNode: (id: string) => void;
  
  getProductById: (id: string) => Product | undefined;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerByName: (name: string) => Customer | undefined;
  getProductsByCategory: (category: string) => Product[];
  getOrdersByCustomer: (customerId: string) => Order[];
  getPendingPaymentsByCustomer: (customerId: string) => number;
  getTotalOrdersByCustomer: (customerId: string) => number;
  getTeamMemberByName: (name: string) => TeamMember | undefined;
  
  initializeDefaults: () => void;
}

const defaultProducts: Product[] = [
  { id: 'P-001', itemName: 'Premium Wheat Flour 5kg', itemHSN: '11010010', category: 'Flour', description: 'High quality wheat flour', itemCode: 'WF-5KG-P', servicePeriod: 180, itemImage: '', mrp: 320, salePrice: 285, wholesalePrice: 275, purchasePrice: 260, taxes: '0%', stock: 1250, minStock: 500, status: 'In Stock' },
  { id: 'P-002', itemName: 'Gold Refined Oil 1L', itemHSN: '15099000', category: 'Oils', description: 'Pure refined sunflower oil', itemCode: 'RO-1L-G', servicePeriod: 365, itemImage: '', mrp: 185, salePrice: 165, wholesalePrice: 158, purchasePrice: 150, taxes: '5%', stock: 890, minStock: 300, status: 'In Stock' },
  { id: 'P-003', itemName: 'Basmati Rice 5kg', itemHSN: '10063020', category: 'Rice', description: 'Premium basmati rice', itemCode: 'BR-5KG', servicePeriod: 730, itemImage: '', mrp: 480, salePrice: 425, wholesalePrice: 410, purchasePrice: 390, taxes: '5%', stock: 120, minStock: 200, status: 'Low Stock' },
];

const defaultCustomers: Customer[] = [
  { id: 'C-001', name: 'Metro Mart', type: 'Retail', location: 'Mumbai', contact: '+91 98765 43210', email: 'metromart@example.com', billingAddress: 'Mumbai, Maharashtra', shippingAddress: 'Mumbai, Maharashtra', state: 'Maharashtra', gstin: '27AABCM1234A1Z5', creditLimit: 500000, status: 'Active' },
  { id: 'C-002', name: 'ABC Distributors', type: 'Wholesale', location: 'Delhi', contact: '+91 98765 43211', email: 'abc@example.com', billingAddress: 'Delhi', shippingAddress: 'Delhi', state: 'Delhi', gstin: '07AABCA1234A1Z5', creditLimit: 1000000, status: 'Active' },
  { id: 'C-003', name: 'Quick Shop', type: 'Retail', location: 'Bangalore', contact: '+91 98765 43212', email: 'quick@example.com', billingAddress: 'Bangalore, Karnataka', shippingAddress: 'Bangalore, Karnataka', state: 'Karnataka', gstin: '29AABCQ1234A1Z5', creditLimit: 100000, status: 'Active' },
];

const defaultTeam: TeamMember[] = [
  { id: 'T-001', name: 'Rajesh Kumar', role: 'Sales Rep', phone: '+91 98765 43220', email: 'rajesh@example.com', zone: 'Mumbai West', salary: 35000, allowances: 5000, status: 'Active' },
  { id: 'T-002', name: 'Priya Singh', role: 'Van Sales', phone: '+91 98765 43221', email: 'priya@example.com', zone: 'Delhi NCR', salary: 40000, allowances: 6000, status: 'Active' },
];

const defaultNetwork: NetworkNode[] = [
  { id: 'HQ-001', name: 'TAJRYNA HQ', type: 'HQ', parentId: null, location: 'Mumbai, Maharashtra', contact: '+91 22 1234 5678', email: 'hq@tajryna.com', zone: 'All India', status: 'Active', image: '' },
  { id: 'SS-001', name: 'Mumbai Super Stockist', type: 'SuperStockist', parentId: 'HQ-001', location: 'Mumbai, Maharashtra', contact: '+91 98765 43210', email: 'ssmumbai@tajryna.com', zone: 'Mumbai', status: 'Active', image: '' },
  { id: 'SS-002', name: 'Delhi Super Stockist', type: 'SuperStockist', parentId: 'HQ-001', location: 'Delhi', contact: '+91 98765 43211', email: 'ssdelhi@tajryna.com', zone: 'Delhi NCR', status: 'Active', image: '' },
  { id: 'D-001', name: 'West Mumbai Distributor', type: 'Distributor', parentId: 'SS-001', location: 'Mumbai West', contact: '+91 98765 43212', email: 'distwm@tajryna.com', zone: 'West Mumbai', status: 'Active', image: '' },
  { id: 'D-002', name: 'South Mumbai Distributor', type: 'Distributor', parentId: 'SS-001', location: 'Mumbai South', contact: '+91 98765 43213', email: 'distsm@tajryna.com', zone: 'South Mumbai', status: 'Active', image: '' },
  { id: 'D-003', name: 'North Delhi Distributor', type: 'Distributor', parentId: 'SS-002', location: 'North Delhi', contact: '+91 98765 43214', email: 'distnd@tajryna.com', zone: 'North Delhi', status: 'Active', image: '' },
  { id: 'SP-001', name: 'Andheri Sales Person', type: 'SalesPerson', parentId: 'D-001', location: 'Andheri', contact: '+91 98765 43215', email: 'spandheri@tajryna.com', zone: 'Andheri', status: 'Active', image: '' },
  { id: 'SP-002', name: 'Borivali Sales Person', type: 'SalesPerson', parentId: 'D-001', location: 'Borivali', contact: '+91 98765 43216', email: 'spborivali@tajryna.com', zone: 'Borivali', status: 'Active', image: '' },
  { id: 'SP-003', name: 'Colaba Sales Person', type: 'SalesPerson', parentId: 'D-002', location: 'Colaba', contact: '+91 98765 43217', email: 'spcolaba@tajryna.com', zone: 'Colaba', status: 'Active', image: '' },
  { id: 'SP-004', name: 'Rohini Sales Person', type: 'SalesPerson', parentId: 'D-003', location: 'Rohini', contact: '+91 98765 43218', email: 'sprohini@tajryna.com', zone: 'Rohini', status: 'Active', image: '' },
];

export const useSmartStore = create<SmartStore>()(
  persist(
    (set, get) => ({
      data: {
        products: [],
        customers: [],
        orders: [],
        estimates: [],
        proformaInvoices: [],
        paymentIn: [],
        deliveryChallans: [],
        salesReturn: [],
        team: [],
        distributions: [],
        beats: [],
        routes: [],
        inventory: [],
        loyalty: [],
        schemes: [],
        targets: [],
        attendance: [],
        payroll: [],
        network: [],
      },

      initializeDefaults: () => {
        const { data } = get();
        const updates: Partial<typeof data> = {};
        if (data.products.length === 0) {
          updates.products = defaultProducts;
        }
        if (data.customers.length === 0) {
          updates.customers = defaultCustomers;
        }
        if (data.team.length === 0) {
          updates.team = defaultTeam;
        }
        if (data.network.length === 0) {
          updates.network = defaultNetwork;
        }
        if (Object.keys(updates).length > 0) {
          set({ data: { ...data, ...updates } });
        }
      },

      addProduct: (product) => set((state) => ({
        data: { ...state.data, products: [...state.data.products, product] }
      })),
      updateProduct: (product) => set((state) => ({
        data: { ...state.data, products: state.data.products.map(p => p.id === product.id ? product : p) }
      })),
      deleteProduct: (id) => set((state) => ({
        data: { ...state.data, products: state.data.products.filter(p => p.id !== id) }
      })),

      addCustomer: (customer) => set((state) => ({
        data: { ...state.data, customers: [...state.data.customers, customer] }
      })),
      updateCustomer: (customer) => set((state) => ({
        data: { ...state.data, customers: state.data.customers.map(c => c.id === customer.id ? customer : c) }
      })),
      deleteCustomer: (id) => set((state) => ({
        data: { ...state.data, customers: state.data.customers.filter(c => c.id !== id) }
      })),

      addOrder: (order) => set((state) => ({
        data: { ...state.data, orders: [order, ...state.data.orders] }
      })),
      updateOrder: (order) => set((state) => ({
        data: { ...state.data, orders: state.data.orders.map(o => o.id === order.id ? order : o) }
      })),
      deleteOrder: (id) => set((state) => ({
        data: { ...state.data, orders: state.data.orders.filter(o => o.id !== id) }
      })),

      addEstimate: (estimate) => set((state) => ({
        data: { ...state.data, estimates: [estimate, ...state.data.estimates] }
      })),
      updateEstimate: (estimate) => set((state) => ({
        data: { ...state.data, estimates: state.data.estimates.map(e => e.id === estimate.id ? estimate : e) }
      })),
      deleteEstimate: (id) => set((state) => ({
        data: { ...state.data, estimates: state.data.estimates.filter(e => e.id !== id) }
      })),

      addPayment: (payment) => set((state) => ({
        data: { ...state.data, paymentIn: [payment, ...state.data.paymentIn] }
      })),
      updatePayment: (payment) => set((state) => ({
        data: { ...state.data, paymentIn: state.data.paymentIn.map(p => p.id === payment.id ? payment : p) }
      })),
      deletePayment: (id) => set((state) => ({
        data: { ...state.data, paymentIn: state.data.paymentIn.filter(p => p.id !== id) }
      })),

      addSalesReturn: (returnData) => set((state) => ({
        data: { ...state.data, salesReturn: [returnData, ...state.data.salesReturn] }
      })),
      updateSalesReturn: (returnData) => set((state) => ({
        data: { ...state.data, salesReturn: state.data.salesReturn.map(r => r.id === returnData.id ? returnData : r) }
      })),
      deleteSalesReturn: (id) => set((state) => ({
        data: { ...state.data, salesReturn: state.data.salesReturn.filter(r => r.id !== id) }
      })),

      addTeamMember: (member) => set((state) => ({
        data: { ...state.data, team: [...state.data.team, member] }
      })),
      updateTeamMember: (member) => set((state) => ({
        data: { ...state.data, team: state.data.team.map(t => t.id === member.id ? member : t) }
      })),
      deleteTeamMember: (id) => set((state) => ({
        data: { ...state.data, team: state.data.team.filter(t => t.id !== id) }
      })),

      addPayroll: (payroll) => set((state) => ({
        data: { ...state.data, payroll: [...state.data.payroll, payroll] }
      })),
      updatePayroll: (payroll) => set((state) => ({
        data: { ...state.data, payroll: state.data.payroll.map(p => p.id === payroll.id ? payroll : p) }
      })),
      deletePayroll: (id) => set((state) => ({
        data: { ...state.data, payroll: state.data.payroll.filter(p => p.id !== id) }
      })),

      addNetworkNode: (node) => set((state) => ({
        data: { ...state.data, network: [...state.data.network, node] }
      })),
      updateNetworkNode: (node) => set((state) => ({
        data: { ...state.data, network: state.data.network.map(n => n.id === node.id ? node : n) }
      })),
      deleteNetworkNode: (id) => set((state) => ({
        data: { ...state.data, network: state.data.network.filter(n => n.id !== id) }
      })),

      getProductById: (id: string) => get().data.products.find(p => p.id === id),
      getCustomerById: (id: string) => get().data.customers.find(c => c.id === id),
      getCustomerByName: (name: string) => get().data.customers.find(c => c.name === name),
      getProductsByCategory: (category: string) => get().data.products.filter(p => p.category === category),
      getOrdersByCustomer: (customerId: string) => get().data.orders.filter(o => o.customerId === customerId),
      getOrdersBySalesPerson: (salesPersonId: string) => get().data.orders.filter(o => o.salesPersonId === salesPersonId),
      getTotalSalesBySalesPerson: (salesPersonId: string, month?: string) => {
        let orders = get().data.orders.filter(o => o.salesPersonId === salesPersonId);
        if (month) {
          orders = orders.filter(o => o.date.startsWith(month));
        }
        return orders.reduce((sum, o) => sum + o.total, 0);
      },
      getPendingPaymentsByCustomer: (customerId) => {
        const orders = get().data.orders.filter(o => o.customerId === customerId && o.status !== 'Delivered');
        const payments = get().data.paymentIn.filter(p => p.customerId === customerId && p.status === 'Received');
        const orderTotal = orders.reduce((sum, o) => sum + o.total, 0);
        const paidTotal = payments.reduce((sum, p) => sum + p.amount, 0);
        return Math.max(0, orderTotal - paidTotal);
      },
      getTotalOrdersByCustomer: (customerId) => get().data.orders.filter(o => o.customerId === customerId).length,
      getTeamMemberByName: (name) => get().data.team.find(t => t.name === name),
    }),
    {
      name: 'smart-crm-storage',
    }
  )
);

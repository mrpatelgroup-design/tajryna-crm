// Dashboard Stats
export const dashboardStats = [
  { title: 'Total Revenue', value: '₹2,42,50,000', change: '+14.5%', changeType: 'up' as const, subtitle: 'vs yesterday', icon: 'indian-rupee', gradient: 'from-emerald-500 to-teal-600' },
  { title: 'Orders Today', value: '156', change: '+23', changeType: 'up' as const, subtitle: 'vs yesterday', icon: 'shopping-cart', gradient: 'from-blue-500 to-indigo-600' },
  { title: 'Active Outlets', value: '2,340', change: '+85', changeType: 'up' as const, subtitle: 'vs yesterday', icon: 'store', gradient: 'from-purple-500 to-pink-600' },
  { title: 'Collection', value: '₹1,85,00,000', change: '+18%', changeType: 'up' as const, subtitle: 'vs yesterday', icon: 'trending-up', gradient: 'from-amber-500 to-orange-600' },
];

export const stateData = [
  { name: 'Maharashtra', revenue: 42.5, outlets: 450, growth: 12, x: 25, y: 55, size: 10 },
  { name: 'Delhi', revenue: 38.0, outlets: 320, growth: 8, x: 35, y: 25, size: 9 },
  { name: 'Karnataka', revenue: 29.0, outlets: 280, growth: 15, x: 28, y: 72, size: 8 },
  { name: 'Tamil Nadu', revenue: 26.0, outlets: 310, growth: 10, x: 32, y: 82, size: 8 },
  { name: 'Gujarat', revenue: 22.0, outlets: 240, growth: 18, x: 15, y: 45, size: 8 },
  { name: 'Rajasthan', revenue: 18.0, outlets: 180, growth: 6, x: 20, y: 35, size: 7 },
  { name: 'West Bengal', revenue: 15.0, outlets: 200, growth: 9, x: 58, y: 45, size: 7 },
  { name: 'UP', revenue: 21.0, outlets: 350, growth: 11, x: 42, y: 35, size: 8 },
];

export const recentOrders = [
  { id: 'ORD-001', customer: 'Metro Mart, Mumbai', type: 'Secondary', time: '2 min ago', amount: '₹45,000', status: 'confirmed', statusColor: 'blue' },
  { id: 'ORD-002', customer: 'ABC Distributors', type: 'Primary', time: '15 min ago', amount: '₹2,50,000', status: 'processing', statusColor: 'amber' },
  { id: 'ORD-003', customer: 'Quick Shop, Delhi', type: 'Secondary', time: '30 min ago', amount: '₹12,500', status: 'delivered', statusColor: 'emerald' },
  { id: 'ORD-004', customer: 'XYZ Trading', type: 'Primary', time: '1 hr ago', amount: '₹1,80,000', status: 'confirmed', statusColor: 'blue' },
];

export const teamPerformance = [
  { name: 'Rajesh Kumar', initials: 'RK', role: 'Sales Rep', visits: 45, achieved: 4.3, target: 5, color: 'emerald' },
  { name: 'Priya Singh', initials: 'PS', role: 'Van Sales', visits: 62, achieved: 6.8, target: 8, color: 'emerald' },
  { name: 'Amit Sharma', initials: 'AS', role: 'Sales Rep', visits: 38, achieved: 3.2, target: 4, color: 'emerald' },
];

// Secondary Sales Data
export const secondarySalesData = [
  { id: 'SS-001', outlet: 'Metro Mart', location: 'Mumbai', amount: 45000, items: 24, rep: 'Rajesh Kumar', date: '2026-02-21', status: 'Completed' },
  { id: 'SS-002', outlet: 'Quick Shop', location: 'Delhi', amount: 12500, items: 8, rep: 'Priya Singh', date: '2026-02-21', status: 'Completed' },
  { id: 'SS-003', outlet: 'Fresh Bazaar', location: 'Bangalore', amount: 28000, items: 15, rep: 'Amit Sharma', date: '2026-02-21', status: 'Pending' },
  { id: 'SS-004', outlet: 'City Store', location: 'Chennai', amount: 35000, items: 18, rep: 'Neha Patel', date: '2026-02-20', status: 'Completed' },
  { id: 'SS-005', outlet: 'Super Mart', location: 'Pune', amount: 52000, items: 30, rep: 'Rajesh Kumar', date: '2026-02-20', status: 'Completed' },
  { id: 'SS-006', outlet: 'Daily Needs', location: 'Ahmedabad', amount: 18000, items: 12, rep: 'Vikram Joshi', date: '2026-02-20', status: 'Returned' },
];

// Primary Sales Data
export const primarySalesData = [
  { id: 'PS-001', distributor: 'ABC Distributors', location: 'Mumbai', amount: 250000, items: 120, date: '2026-02-21', status: 'Processing' },
  { id: 'PS-002', distributor: 'XYZ Trading', location: 'Delhi', amount: 180000, items: 85, date: '2026-02-21', status: 'Confirmed' },
  { id: 'PS-003', distributor: 'PQR Wholesale', location: 'Bangalore', amount: 320000, items: 150, date: '2026-02-20', status: 'Dispatched' },
  { id: 'PS-004', distributor: 'LMN Supplies', location: 'Chennai', amount: 195000, items: 92, date: '2026-02-20', status: 'Delivered' },
  { id: 'PS-005', distributor: 'RST Corp', location: 'Pune', amount: 410000, items: 200, date: '2026-02-19', status: 'Delivered' },
];

// Orders Data
export const ordersData = [
  { id: 'ORD-2601', customer: 'Metro Mart, Mumbai', type: 'Secondary', amount: 45000, items: 24, date: '2026-02-21', status: 'Confirmed', payment: 'Pending' },
  { id: 'ORD-2602', customer: 'ABC Distributors', type: 'Primary', amount: 250000, items: 120, date: '2026-02-21', status: 'Processing', payment: 'Partial' },
  { id: 'ORD-2603', customer: 'Quick Shop, Delhi', type: 'Secondary', amount: 12500, items: 8, date: '2026-02-21', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-2604', customer: 'XYZ Trading', type: 'Primary', amount: 180000, items: 85, date: '2026-02-21', status: 'Confirmed', payment: 'Pending' },
  { id: 'ORD-2605', customer: 'Fresh Bazaar', type: 'Secondary', amount: 28000, items: 15, date: '2026-02-20', status: 'Dispatched', payment: 'Paid' },
  { id: 'ORD-2606', customer: 'City Store', type: 'Secondary', amount: 35000, items: 18, date: '2026-02-20', status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-2607', customer: 'PQR Wholesale', type: 'Primary', amount: 320000, items: 150, date: '2026-02-20', status: 'Delivered', payment: 'Paid' },
];

// Distribution Data
export const distributionData = [
  { id: 'D-001', name: 'ABC Distributors', location: 'Mumbai', zone: 'West', outlets: 85, revenue: '₹42.5L', status: 'Active', rating: 4.5 },
  { id: 'D-002', name: 'XYZ Trading', location: 'Delhi', zone: 'North', outlets: 62, revenue: '₹38.0L', status: 'Active', rating: 4.2 },
  { id: 'D-003', name: 'PQR Wholesale', location: 'Bangalore', zone: 'South', outlets: 74, revenue: '₹29.0L', status: 'Active', rating: 4.7 },
  { id: 'D-004', name: 'LMN Supplies', location: 'Chennai', zone: 'South', outlets: 58, revenue: '₹26.0L', status: 'Active', rating: 3.9 },
  { id: 'D-005', name: 'RST Corp', location: 'Pune', zone: 'West', outlets: 45, revenue: '₹22.0L', status: 'Inactive', rating: 3.5 },
];

// Customers Data
export const customersData = [
  { id: 'C-001', name: 'Metro Mart', type: 'Retail', location: 'Mumbai', contact: '+91 98765 43210', orders: 156, revenue: '₹12.5L', lastOrder: '2 hrs ago', status: 'Active' },
  { id: 'C-002', name: 'Quick Shop', type: 'Retail', location: 'Delhi', contact: '+91 98765 43211', orders: 89, revenue: '₹8.2L', lastOrder: '5 hrs ago', status: 'Active' },
  { id: 'C-003', name: 'Fresh Bazaar', type: 'Wholesale', location: 'Bangalore', contact: '+91 98765 43212', orders: 234, revenue: '₹28.0L', lastOrder: '1 day ago', status: 'Active' },
  { id: 'C-004', name: 'City Store', type: 'Retail', location: 'Chennai', contact: '+91 98765 43213', orders: 67, revenue: '₹5.8L', lastOrder: '2 days ago', status: 'Inactive' },
  { id: 'C-005', name: 'Super Mart', type: 'Supermarket', location: 'Pune', contact: '+91 98765 43214', orders: 312, revenue: '₹35.0L', lastOrder: '3 hrs ago', status: 'Active' },
  { id: 'C-006', name: 'Daily Needs', type: 'Retail', location: 'Ahmedabad', contact: '+91 98765 43215', orders: 45, revenue: '₹3.2L', lastOrder: '1 week ago', status: 'Dormant' },
];

// Products Data
export const productsData = [
  { id: 'P-001', name: 'Premium Wheat Flour 5kg', sku: 'WF-5KG-P', category: 'Flour', price: 285, stock: 1250, minStock: 500, status: 'In Stock' },
  { id: 'P-002', name: 'Gold Refined Oil 1L', sku: 'RO-1L-G', category: 'Oils', price: 165, stock: 890, minStock: 300, status: 'In Stock' },
  { id: 'P-003', name: 'Basmati Rice 5kg', sku: 'BR-5KG', category: 'Rice', price: 425, stock: 120, minStock: 200, status: 'Low Stock' },
  { id: 'P-004', name: 'Sugar 1kg', sku: 'SG-1KG', category: 'Sugar', price: 48, stock: 2500, minStock: 1000, status: 'In Stock' },
  { id: 'P-005', name: 'Tea Premium 250g', sku: 'TP-250G', category: 'Beverages', price: 195, stock: 45, minStock: 100, status: 'Low Stock' },
  { id: 'P-006', name: 'Dal Toor 1kg', sku: 'DT-1KG', category: 'Pulses', price: 155, stock: 680, minStock: 300, status: 'In Stock' },
  { id: 'P-007', name: 'Ghee 500ml', sku: 'GH-500ML', category: 'Dairy', price: 310, stock: 0, minStock: 150, status: 'Out of Stock' },
];

// Team Data
export const teamData = [
  { id: 'T-001', name: 'Rajesh Kumar', initials: 'RK', role: 'Sales Rep', zone: 'Mumbai West', phone: '+91 98765 43220', visits: 45, target: 500000, achieved: 430000, attendance: 95, status: 'Active' },
  { id: 'T-002', name: 'Priya Singh', initials: 'PS', role: 'Van Sales', zone: 'Delhi NCR', phone: '+91 98765 43221', visits: 62, target: 800000, achieved: 680000, attendance: 98, status: 'Active' },
  { id: 'T-003', name: 'Amit Sharma', initials: 'AS', role: 'Sales Rep', zone: 'Bangalore', phone: '+91 98765 43222', visits: 38, target: 400000, achieved: 320000, attendance: 88, status: 'Active' },
  { id: 'T-004', name: 'Neha Patel', initials: 'NP', role: 'Sales Rep', zone: 'Chennai', phone: '+91 98765 43223', visits: 52, target: 600000, achieved: 540000, attendance: 92, status: 'Active' },
  { id: 'T-005', name: 'Vikram Joshi', initials: 'VJ', role: 'Area Manager', zone: 'Gujarat', phone: '+91 98765 43224', visits: 28, target: 1200000, achieved: 980000, attendance: 100, status: 'Active' },
  { id: 'T-006', name: 'Sanjay Gupta', initials: 'SG', role: 'Sales Rep', zone: 'Pune', phone: '+91 98765 43225', visits: 15, target: 400000, achieved: 180000, attendance: 65, status: 'On Leave' },
];

// Beats Data
export const beatsData = [
  { id: 'B-001', name: 'Mumbai Central Beat', area: 'Mumbai', outlets: 32, assignedTo: 'Rajesh Kumar', day: 'Monday', status: 'Active', coverage: 85 },
  { id: 'B-002', name: 'Andheri West Beat', area: 'Mumbai', outlets: 28, assignedTo: 'Rajesh Kumar', day: 'Tuesday', status: 'Active', coverage: 92 },
  { id: 'B-003', name: 'Connaught Place Beat', area: 'Delhi', outlets: 45, assignedTo: 'Priya Singh', day: 'Monday', status: 'Active', coverage: 78 },
  { id: 'B-004', name: 'Koramangala Beat', area: 'Bangalore', outlets: 38, assignedTo: 'Amit Sharma', day: 'Wednesday', status: 'Active', coverage: 88 },
  { id: 'B-005', name: 'T Nagar Beat', area: 'Chennai', outlets: 42, assignedTo: 'Neha Patel', day: 'Thursday', status: 'Inactive', coverage: 65 },
];

// Routes Data
export const routesData = [
  { id: 'R-001', name: 'Mumbai West Route', beats: 4, outlets: 120, distance: '45 km', assignedTo: 'Rajesh Kumar', frequency: 'Weekly', status: 'Active' },
  { id: 'R-002', name: 'Delhi Central Route', beats: 6, outlets: 180, distance: '62 km', assignedTo: 'Priya Singh', frequency: 'Weekly', status: 'Active' },
  { id: 'R-003', name: 'Bangalore South Route', beats: 3, outlets: 95, distance: '38 km', assignedTo: 'Amit Sharma', frequency: 'Bi-weekly', status: 'Active' },
  { id: 'R-004', name: 'Chennai Central Route', beats: 5, outlets: 150, distance: '52 km', assignedTo: 'Neha Patel', frequency: 'Weekly', status: 'Active' },
];

// Inventory Data
export const inventoryData = [
  { id: 'INV-001', product: 'Premium Wheat Flour 5kg', sku: 'WF-5KG-P', warehouse: 'Mumbai Central', stock: 1250, allocated: 200, available: 1050, reorderLevel: 500, status: 'Healthy' },
  { id: 'INV-002', product: 'Gold Refined Oil 1L', sku: 'RO-1L-G', warehouse: 'Delhi Hub', stock: 890, allocated: 150, available: 740, reorderLevel: 300, status: 'Healthy' },
  { id: 'INV-003', product: 'Basmati Rice 5kg', sku: 'BR-5KG', warehouse: 'Mumbai Central', stock: 120, allocated: 80, available: 40, reorderLevel: 200, status: 'Critical' },
  { id: 'INV-004', product: 'Tea Premium 250g', sku: 'TP-250G', warehouse: 'Chennai Depot', stock: 45, allocated: 30, available: 15, reorderLevel: 100, status: 'Critical' },
  { id: 'INV-005', product: 'Ghee 500ml', sku: 'GH-500ML', warehouse: 'Bangalore WH', stock: 0, allocated: 0, available: 0, reorderLevel: 150, status: 'Out of Stock' },
];

// Tracking/Growth Data
export const monthlyGrowthData = [
  { month: 'Sep', revenue: 180, target: 200, orders: 1200 },
  { month: 'Oct', revenue: 210, target: 220, orders: 1450 },
  { month: 'Nov', revenue: 195, target: 230, orders: 1380 },
  { month: 'Dec', revenue: 240, target: 240, orders: 1620 },
  { month: 'Jan', revenue: 225, target: 250, orders: 1550 },
  { month: 'Feb', revenue: 242, target: 260, orders: 1680 },
];

// Loyalty Data
export const loyaltyData = [
  { id: 'L-001', customer: 'Metro Mart', points: 12500, tier: 'Platinum', redeemed: 3500, lastActivity: '2 hrs ago', status: 'Active' },
  { id: 'L-002', customer: 'Quick Shop', points: 8200, tier: 'Gold', redeemed: 2000, lastActivity: '1 day ago', status: 'Active' },
  { id: 'L-003', customer: 'Fresh Bazaar', points: 15800, tier: 'Platinum', redeemed: 5200, lastActivity: '5 hrs ago', status: 'Active' },
  { id: 'L-004', customer: 'City Store', points: 3200, tier: 'Silver', redeemed: 800, lastActivity: '1 week ago', status: 'Inactive' },
  { id: 'L-005', customer: 'Super Mart', points: 22000, tier: 'Diamond', redeemed: 8000, lastActivity: '3 hrs ago', status: 'Active' },
];

// Schemes Data
export const schemesData = [
  { id: 'SCH-001', name: 'Festive Bonanza', type: 'Discount', discount: '15%', minOrder: '₹10,000', validTill: '2026-03-31', status: 'Active', usage: 234 },
  { id: 'SCH-002', name: 'Buy 10 Get 1 Free', type: 'Quantity', discount: 'Free goods', minOrder: '10 units', validTill: '2026-02-28', status: 'Active', usage: 156 },
  { id: 'SCH-003', name: 'Early Bird Offer', type: 'Discount', discount: '10%', minOrder: '₹5,000', validTill: '2026-04-15', status: 'Active', usage: 89 },
  { id: 'SCH-004', name: 'Bulk Purchase Deal', type: 'Slab', discount: 'Up to 20%', minOrder: '₹50,000', validTill: '2026-03-15', status: 'Expiring Soon', usage: 45 },
  { id: 'SCH-005', name: 'New Outlet Welcome', type: 'Discount', discount: '25%', minOrder: '₹3,000', validTill: '2026-06-30', status: 'Active', usage: 312 },
];

// Targets Data
export const targetsData = [
  { id: 'TGT-001', rep: 'Rajesh Kumar', zone: 'Mumbai West', monthly: 500000, achieved: 430000, daily: 16667, dailyAchieved: 22000, status: 'On Track' },
  { id: 'TGT-002', rep: 'Priya Singh', zone: 'Delhi NCR', monthly: 800000, achieved: 680000, daily: 26667, dailyAchieved: 35000, status: 'Ahead' },
  { id: 'TGT-003', rep: 'Amit Sharma', zone: 'Bangalore', monthly: 400000, achieved: 320000, daily: 13333, dailyAchieved: 12000, status: 'On Track' },
  { id: 'TGT-004', rep: 'Neha Patel', zone: 'Chennai', monthly: 600000, achieved: 540000, daily: 20000, dailyAchieved: 18000, status: 'On Track' },
  { id: 'TGT-005', rep: 'Vikram Joshi', zone: 'Gujarat', monthly: 1200000, achieved: 980000, daily: 40000, dailyAchieved: 45000, status: 'Ahead' },
  { id: 'TGT-006', rep: 'Sanjay Gupta', zone: 'Pune', monthly: 400000, achieved: 180000, daily: 13333, dailyAchieved: 5000, status: 'Behind' },
];

// Attendance Data
export const attendanceData = [
  { id: 'A-001', name: 'Rajesh Kumar', date: '2026-02-21', checkIn: '09:05 AM', checkOut: '06:30 PM', location: 'Mumbai West', status: 'Present', hours: '9h 25m' },
  { id: 'A-002', name: 'Priya Singh', date: '2026-02-21', checkIn: '08:45 AM', checkOut: '07:00 PM', location: 'Delhi NCR', status: 'Present', hours: '10h 15m' },
  { id: 'A-003', name: 'Amit Sharma', date: '2026-02-21', checkIn: '09:30 AM', checkOut: '-', location: 'Bangalore', status: 'Present', hours: '8h 30m' },
  { id: 'A-004', name: 'Neha Patel', date: '2026-02-21', checkIn: '09:00 AM', checkOut: '06:45 PM', location: 'Chennai', status: 'Present', hours: '9h 45m' },
  { id: 'A-005', name: 'Vikram Joshi', date: '2026-02-21', checkIn: '08:30 AM', checkOut: '07:15 PM', location: 'Gujarat', status: 'Present', hours: '10h 45m' },
  { id: 'A-006', name: 'Sanjay Gupta', date: '2026-02-21', checkIn: '-', checkOut: '-', location: '-', status: 'On Leave', hours: '-' },
];

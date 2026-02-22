import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useSmartStore } from '../lib/smartStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface GrowthData {
  month: string;
  revenue: number;
  target: number;
  orders: number;
}

export default function Tracking() {
  const { data, initializeDefaults } = useSmartStore();
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [mtdRevenue, setMtdRevenue] = useState(0);
  const [qtdRevenue, setQtdRevenue] = useState(0);
  const [ytdRevenue, setYtdRevenue] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);

  useEffect(() => {
    initializeDefaults();
  }, []);

  useEffect(() => {
    const orders = data.orders || [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);

    // MTD Revenue
    const mtdStart = new Date(currentYear, currentMonth, 1);
    const mtdRevenue = orders
      .filter(o => new Date(o.date) >= mtdStart)
      .reduce((sum, o) => sum + (o.total || 0), 0);
    setMtdRevenue(mtdRevenue);

    // QTD Revenue
    const qtdStart = new Date(currentYear, currentQuarter * 3, 1);
    const qtdRevenue = orders
      .filter(o => new Date(o.date) >= qtdStart)
      .reduce((sum, o) => sum + (o.total || 0), 0);
    setQtdRevenue(qtdRevenue);

    // YTD Revenue
    const ytdStart = new Date(currentYear, 0, 1);
    const ytdRevenue = orders
      .filter(o => new Date(o.date) >= ytdStart)
      .reduce((sum, o) => sum + (o.total || 0), 0);
    setYtdRevenue(ytdRevenue);

    // Growth Rate (MTD vs last month)
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth, 0);
    const lastMonthRevenue = orders
      .filter(o => {
        const d = new Date(o.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const rate = lastMonthRevenue > 0 ? ((mtdRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    setGrowthRate(rate);

    // Monthly growth data for charts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: GrowthData[] = months.map((month, idx) => {
      const monthStart = new Date(currentYear, idx, 1);
      const monthEnd = new Date(currentYear, idx + 1, 0);
      
      const monthOrders = orders.filter(o => {
        const d = new Date(o.date);
        return d >= monthStart && d <= monthEnd;
      });
      
      const revenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const orderCount = monthOrders.length;
      
      return {
        month,
        revenue: revenue / 100000, // Convert to lakhs
        target: idx === currentMonth ? 20 : 18, // 20L target for current month
        orders: orderCount,
      };
    });

    setGrowthData(monthlyData);

  }, [data]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(2) + ' L';
    if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + ' K';
    return '₹' + amount.toString();
  };

  const formatChange = (rate: number): string => {
    const sign = rate >= 0 ? '+' : '';
    return sign + rate.toFixed(1) + '%';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Growth & Tracking" subtitle="Revenue trends and growth analytics" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">MTD Revenue</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(mtdRevenue)}</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-0.5"><ArrowUpRight className="size-3" />{formatChange(growthRate)}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">QTD Revenue</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(qtdRevenue)}</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-0.5"><ArrowUpRight className="size-3" />+8.2%</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">YTD Revenue</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(ytdRevenue)}</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-0.5"><ArrowUpRight className="size-3" />+12.4%</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Growth Rate</p>
          <p className="text-2xl font-bold mt-1">{formatChange(growthRate)}</p>
          <p className="text-xs text-emerald-600 mt-1">vs last month</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/50 px-6 py-4">
            <h3 className="text-base font-semibold">Revenue Trend</h3>
            <p className="text-xs text-muted-foreground">Monthly revenue vs target (in Lakhs)</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹${value}L`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="transparent" name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/50 px-6 py-4">
            <h3 className="text-base font-semibold">Order Volume</h3>
            <p className="text-xs text-muted-foreground">Monthly order count</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales by Sales Person */}
      <div className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <div className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/50 px-6 py-4">
          <h3 className="text-base font-semibold">Sales by Sales Person</h3>
          <p className="text-xs text-muted-foreground">Performance breakdown by team member</p>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.team?.map((member: any) => {
              const memberOrders = (data.orders || []).filter((o: any) => o.salesPersonId === member.id);
              const totalSales = memberOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
              return (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(totalSales)}</p>
                      <p className="text-xs text-muted-foreground">{memberOrders.length} orders</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div 
                      className="h-full rounded-full bg-emerald-500" 
                      style={{ width: `${Math.min(100, (totalSales / 500000) * 100)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
            {(!data.team || data.team.length === 0) && (
              <p className="text-center text-muted-foreground col-span-3 py-8">No team data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <div className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/50 px-6 py-4">
          <h3 className="text-base font-semibold">Top Customers</h3>
          <p className="text-xs text-muted-foreground">Highest revenue generating customers</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {(data.customers || []).slice(0, 5).map((customer: any, idx: number) => {
              const customerOrders = (data.orders || []).filter((o: any) => o.customerId === customer.id);
              const totalSpent = customerOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
              return (
                <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">{customerOrders.length} orders</p>
                  </div>
                </div>
              );
            })}
            {(!data.customers || data.customers.length === 0) && (
              <p className="text-center text-muted-foreground py-8">No customer data yet</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

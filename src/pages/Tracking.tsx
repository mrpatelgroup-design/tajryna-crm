import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { monthlyGrowthData } from '../lib/data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Tracking() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Growth & Tracking" subtitle="Revenue trends and growth analytics" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">MTD Revenue</p>
          <p className="text-2xl font-bold mt-1">₹2.42 Cr</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-0.5"><ArrowUpRight className="size-3" />+14.5%</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">QTD Revenue</p>
          <p className="text-2xl font-bold mt-1">₹6.67 Cr</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-0.5"><ArrowUpRight className="size-3" />+8.2%</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">YTD Revenue</p>
          <p className="text-2xl font-bold mt-1">₹21.15 Cr</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-0.5"><ArrowUpRight className="size-3" />+12.4%</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Growth Rate</p>
          <p className="text-2xl font-bold mt-1">+14.5%</p>
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
              <AreaChart data={monthlyGrowthData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
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
              <BarChart data={monthlyGrowthData}>
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
    </motion.div>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IndianRupee, ShoppingCart, Store, TrendingUp, ArrowUpRight,
  Calendar, Clock, Activity, Users, Package, Target
} from 'lucide-react';
import { dashboardStats, stateData, recentOrders, teamPerformance } from '../lib/data';
import StatusBadge from '../components/StatusBadge';
import { Truck } from 'lucide-react';

const iconMap: Record<string, any> = {
  'indian-rupee': IndianRupee,
  'shopping-cart': ShoppingCart,
  'store': Store,
  'trending-up': TrendingUp,
};

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="size-4" />{today}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-sm">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Live Updates</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, i) => {
          const Icon = iconMap[stat.icon];
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-card rounded-xl py-6 relative overflow-hidden border-0 shadow-lg shadow-slate-200/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.03]`} />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full" />
              <div className="px-6 pt-5 relative">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-emerald-600 flex items-center font-semibold">
                        <ArrowUpRight className="h-3 w-3" /> {stat.change}
                      </span>
                      <span className="text-muted-foreground">{stat.subtitle}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Map + Orders */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* India Sales Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-card rounded-xl lg:col-span-4 overflow-hidden border-0 shadow-lg"
        >
          <div className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">India Sales Map</h3>
                <p className="text-xs text-muted-foreground mt-0.5">State-wise performance overview</p>
              </div>
              <span className="inline-flex items-center rounded-md border-transparent bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 font-medium">
                <Activity className="size-3 mr-1" />Real-time
              </span>
            </div>
          </div>
          <div className="relative h-[400px] bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M25,15 Q35,10 45,18 L55,15 Q65,20 70,30 L75,45 Q78,55 72,65 L65,75 Q55,85 40,88 L25,82 Q15,75 12,60 L10,45 Q12,30 25,15 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-300" />
              </svg>
            </div>
            {stateData.map((state, i) => (
              <div key={state.name} className="absolute group cursor-pointer" style={{ left: `${state.x}%`, top: `${state.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" style={{ animationDelay: `${i * 200}ms`, animationDuration: '2s' }} />
                  <div className="relative rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-125" style={{ width: `${state.size * 4}px`, height: `${state.size * 4}px` }}>
                    <span className="text-[8px] font-bold text-white">{Math.round(state.revenue)}L</span>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 pointer-events-none">
                  <div className="bg-slate-900 text-white text-[10px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                    <p className="font-bold">{state.name}</p>
                    <p className="text-emerald-400">₹{state.revenue}L</p>
                    <p className="text-slate-400">{state.outlets} outlets</p>
                    <p className="text-indigo-400">+{state.growth}% growth</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <p className="text-[10px] font-semibold text-slate-600 mb-2">Performance Legend</p>
              <div className="flex items-center gap-3 text-[9px]">
                <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-emerald-500" /><span>High</span></div>
                <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-amber-500" /><span>Medium</span></div>
                <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-rose-500" /><span>Low</span></div>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold text-indigo-600">₹21.15 Cr</p>
                <p className="text-[10px] text-emerald-600 flex items-center justify-end gap-0.5">
                  <ArrowUpRight className="size-3" />+12.4%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-card rounded-xl lg:col-span-3 border-0 shadow-lg"
        >
          <div className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Recent Orders</h3>
              <Link to="/orders">
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-3 h-8 rounded-md hover:bg-accent">View All</button>
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center ${order.type === 'Secondary' ? 'bg-emerald-100' : 'bg-indigo-100'}`}>
                    {order.type === 'Secondary' ? <Store className="size-5 text-emerald-600" /> : <Truck className="size-5 text-indigo-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{order.customer}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={order.type} />
                      <span className="text-[10px] text-muted-foreground">{order.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{order.amount}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Monthly Target */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-xl py-6 border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="px-6 pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <Target className="size-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">Monthly Target</p>
                <p className="text-3xl font-bold">76%</p>
                <p className="text-xs text-white/70">₹1.84 Cr / ₹2.42 Cr</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/20">
              <div className="h-full w-[76%] rounded-full bg-white" />
            </div>
          </div>
        </motion.div>

        {/* Active Salesforce */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-card rounded-xl py-6 border-0 shadow-lg"
        >
          <div className="px-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-100">
                <Users className="size-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Salesforce</p>
                <p className="text-2xl font-bold">24/28</p>
                <p className="text-xs text-emerald-600">86% attendance today</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Low Stock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-card rounded-xl py-6 border-0 shadow-lg"
        >
          <div className="px-6 pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100">
                <Package className="size-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock SKUs</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-amber-600">Requires attention</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Team Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-card rounded-xl border-0 shadow-lg"
      >
        <div className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Team Performance</h3>
            <Link to="/team">
              <button className="text-xs text-indigo-600 font-medium px-3 h-8 rounded-md hover:bg-accent">View All</button>
            </Link>
          </div>
        </div>
        <div className="divide-y">
          {teamPerformance.map((member) => (
            <div key={member.name} className="p-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-emerald-500">
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-[11px] text-muted-foreground">{member.role} • {member.visits} visits</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₹{member.achieved}L</p>
                  <p className="text-[10px] text-muted-foreground">of ₹{member.target}L</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full transition-all bg-emerald-500" style={{ width: `${Math.round((member.achieved / member.target) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

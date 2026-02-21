import { motion } from 'framer-motion';
import { FileText, Download, BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const reports = [
  { name: 'Daily Sales Report', description: 'Summary of all sales transactions for the day', icon: BarChart3, lastGenerated: '2 hrs ago', type: 'Auto' },
  { name: 'Weekly Performance Report', description: 'Team performance metrics and KPIs', icon: TrendingUp, lastGenerated: '3 days ago', type: 'Auto' },
  { name: 'Monthly Revenue Report', description: 'Detailed revenue breakdown by zone and product', icon: PieChart, lastGenerated: '1 week ago', type: 'Manual' },
  { name: 'Customer Analysis Report', description: 'Customer segmentation and purchase patterns', icon: Users, lastGenerated: '2 weeks ago', type: 'Manual' },
  { name: 'Inventory Status Report', description: 'Stock levels, reorder alerts, and movement', icon: BarChart3, lastGenerated: '1 day ago', type: 'Auto' },
  { name: 'Collection Report', description: 'Outstanding payments and collection status', icon: TrendingUp, lastGenerated: '5 hrs ago', type: 'Auto' },
];

export default function Reports() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Reports" subtitle="Generate and download reports">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><FileText className="size-4" />Custom Report</button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-xl p-5 shadow-lg border-0 hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                  <Icon className="size-5 text-indigo-600" />
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${report.type === 'Auto' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {report.type}
                </span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{report.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{report.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Last: {report.lastGenerated}</span>
                <button className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  <Download className="size-3" />Download
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

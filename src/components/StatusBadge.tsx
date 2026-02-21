const statusColors: Record<string, string> = {
  'Active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Inactive': 'bg-slate-100 text-slate-600 border-slate-200',
  'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
  'Processing': 'bg-amber-100 text-amber-700 border-amber-200',
  'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
  'Dispatched': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Returned': 'bg-rose-100 text-rose-700 border-rose-200',
  'In Stock': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Low Stock': 'bg-amber-100 text-amber-700 border-amber-200',
  'Out of Stock': 'bg-rose-100 text-rose-700 border-rose-200',
  'Healthy': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Critical': 'bg-rose-100 text-rose-700 border-rose-200',
  'On Track': 'bg-blue-100 text-blue-700 border-blue-200',
  'Ahead': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Behind': 'bg-rose-100 text-rose-700 border-rose-200',
  'Present': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
  'Absent': 'bg-rose-100 text-rose-700 border-rose-200',
  'Paid': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Partial': 'bg-amber-100 text-amber-700 border-amber-200',
  'Expiring Soon': 'bg-amber-100 text-amber-700 border-amber-200',
  'Dormant': 'bg-slate-100 text-slate-600 border-slate-200',
  'Platinum': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Gold': 'bg-amber-100 text-amber-700 border-amber-200',
  'Silver': 'bg-slate-100 text-slate-600 border-slate-200',
  'Diamond': 'bg-purple-100 text-purple-700 border-purple-200',
  'Secondary': 'border-emerald-200 text-emerald-600',
  'Primary': 'border-indigo-200 text-indigo-600',
  'confirmed': 'bg-blue-100 text-blue-700',
  'processing': 'bg-amber-100 text-amber-700',
  'delivered': 'bg-emerald-100 text-emerald-700',
};

export default function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${color}`}>
      {status}
    </span>
  );
}

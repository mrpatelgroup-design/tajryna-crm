import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { customersData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Cust { id: string; name: string; type: string; location: string; contact: string; orders: number; revenue: string; lastOrder: string; status: string; }
const empty: Cust = { id: '', name: '', type: 'Retail', location: '', contact: '', orders: 0, revenue: '₹0L', lastOrder: 'Just now', status: 'Active' };

function Form({ value, onChange, onSave, label }: { value: Cust; onChange: (v: Cust) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Name" required><Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Customer name" /></FormField>
      <FormField label="Type"><Select value={value.type} onChange={e => onChange({ ...value, type: e.target.value })}><option>Retail</option><option>Wholesale</option><option>Supermarket</option></Select></FormField>
      <FormField label="Location" required><Input value={value.location} onChange={e => onChange({ ...value, location: e.target.value })} placeholder="City" /></FormField>
      <FormField label="Contact"><Input value={value.contact} onChange={e => onChange({ ...value, contact: e.target.value })} placeholder="+91 98765 43210" /></FormField>
      <FormField label="Revenue"><Input value={value.revenue} onChange={e => onChange({ ...value, revenue: e.target.value })} placeholder="₹0L" /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Active</option><option>Inactive</option><option>Dormant</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name || !value.location} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Customers() {
  const crud = useCrud<Cust>(customersData as Cust[]);
  const [form, setForm] = useState<Cust>(empty);
  const typeColors: Record<string, string> = { 'Retail': 'bg-blue-100 text-blue-700 border-blue-200', 'Wholesale': 'bg-purple-100 text-purple-700 border-purple-200', 'Supermarket': 'bg-indigo-100 text-indigo-700 border-indigo-200' };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Customer' },
    { key: 'type', label: 'Type', render: (v: string) => <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${typeColors[v] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{v}</span> },
    { key: 'location', label: 'Location' },
    { key: 'orders', label: 'Orders' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'lastOrder', label: 'Last Order' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Cust) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Customers" subtitle="Customer relationship management">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('C-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Customer</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Customers</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Active').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Dormant</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Dormant').length}</p><p className="text-xs text-amber-600 mt-1">Need re-engagement</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Orders</p><p className="text-2xl font-bold mt-1">{crud.data.reduce((s, d) => s + d.orders, 0)}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Customer"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Add Customer" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Customer"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

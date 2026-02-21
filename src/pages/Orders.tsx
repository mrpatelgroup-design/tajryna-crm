import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { ordersData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Order { id: string; customer: string; type: string; amount: number; items: number; date: string; status: string; payment: string; }
const empty: Order = { id: '', customer: '', type: 'Secondary', amount: 0, items: 0, date: new Date().toISOString().slice(0, 10), status: 'Confirmed', payment: 'Pending' };

function Form({ value, onChange, onSave, label }: { value: Order; onChange: (v: Order) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Customer" required><Input value={value.customer} onChange={e => onChange({ ...value, customer: e.target.value })} placeholder="Customer name" /></FormField>
      <FormField label="Type"><Select value={value.type} onChange={e => onChange({ ...value, type: e.target.value })}><option>Secondary</option><option>Primary</option></Select></FormField>
      <FormField label="Amount (₹)" required><Input type="number" value={value.amount || ''} onChange={e => onChange({ ...value, amount: Number(e.target.value) })} /></FormField>
      <FormField label="Items" required><Input type="number" value={value.items || ''} onChange={e => onChange({ ...value, items: Number(e.target.value) })} /></FormField>
      <FormField label="Date"><Input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Confirmed</option><option>Processing</option><option>Dispatched</option><option>Delivered</option></Select></FormField>
      <FormField label="Payment"><Select value={value.payment} onChange={e => onChange({ ...value, payment: e.target.value })}><option>Pending</option><option>Partial</option><option>Paid</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.customer || !value.amount} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Orders() {
  const crud = useCrud<Order>(ordersData as Order[]);
  const [form, setForm] = useState<Order>(empty);

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'type', label: 'Type', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'amount', label: 'Amount', render: (v: number) => `₹${v.toLocaleString()}` },
    { key: 'items', label: 'Items' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'payment', label: 'Payment', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Order) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Orders" subtitle="All sales orders across channels">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('ORD-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />New Order</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Orders</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p><p className="text-xs text-emerald-600 mt-1">all time</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Confirmed</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Confirmed').length}</p><p className="text-xs text-blue-600 mt-1">awaiting dispatch</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Processing</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Processing').length}</p><p className="text-xs text-amber-600 mt-1">in progress</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Delivered</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Delivered').length}</p><p className="text-xs text-emerald-600 mt-1">completed</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="New Order"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Create Order" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Order"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

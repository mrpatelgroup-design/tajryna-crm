import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { useCrud } from '../lib/useCrud';

interface Challan {
  id: string;
  customer: string;
  date: string;
  orderRef: string;
  items: number;
  status: string;
}

const initialData: Challan[] = [
  { id: 'CH-001', customer: 'Metro Mart', date: '2026-02-21', orderRef: 'ORD-2601', items: 24, status: 'Delivered' },
  { id: 'CH-002', customer: 'ABC Distributors', date: '2026-02-20', orderRef: 'ORD-2602', items: 120, status: 'In Transit' },
  { id: 'CH-003', customer: 'Quick Shop', date: '2026-02-19', orderRef: 'ORD-2603', items: 8, status: 'Issued' },
];

const empty: Challan = { id: '', customer: '', date: new Date().toISOString().slice(0, 10), orderRef: '', items: 0, status: 'Issued' };

function Form({ value, onChange, onSave, label }: { value: Challan; onChange: (v: Challan) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Customer" required>
        <Input value={value.customer} onChange={e => onChange({ ...value, customer: e.target.value })} placeholder="Customer name" />
      </FormField>
      <FormField label="Date">
        <Input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })} />
      </FormField>
      <FormField label="Order Reference">
        <Input value={value.orderRef} onChange={e => onChange({ ...value, orderRef: e.target.value })} placeholder="Order number" />
      </FormField>
      <FormField label="No. of Items">
        <Input type="number" value={value.items || ''} onChange={e => onChange({ ...value, items: Number(e.target.value) })} />
      </FormField>
      <FormField label="Status">
        <Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}>
          <option>Issued</option>
          <option>In Transit</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </Select>
      </FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.customer} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function DeliveryChallan() {
  const crud = useCrud<Challan>(initialData, 'deliveryChallan');
  const [form, setForm] = useState<Challan>(empty);

  const columns = [
    { key: 'id', label: 'Challan No.' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'orderRef', label: 'Order Ref.' },
    { key: 'items', label: 'Items' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Challan) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Delivery Challan" subtitle="Delivery notes and dispatch documents">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('CH-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />New Challan</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Challans</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Issued</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Issued').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">In Transit</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'In Transit').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Delivered</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Delivered').length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="New Delivery Challan"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Create Challan" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Delivery Challan"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

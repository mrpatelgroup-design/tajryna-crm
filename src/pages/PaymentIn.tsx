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

interface PaymentIn {
  id: string;
  customer: string;
  date: string;
  amount: number;
  mode: string;
  reference: string;
  status: string;
}

const initialData: PaymentIn[] = [
  { id: 'PAY-001', customer: 'Metro Mart', date: '2026-02-21', amount: 25000, mode: 'Bank Transfer', reference: 'TXN123456', status: 'Received' },
  { id: 'PAY-002', customer: 'ABC Distributors', date: '2026-02-20', amount: 50000, mode: 'Cash', reference: 'CASH001', status: 'Received' },
  { id: 'PAY-003', customer: 'Quick Shop', date: '2026-02-19', amount: 12000, mode: 'UPI', reference: 'UPI789012', status: 'Pending' },
];

const empty: PaymentIn = { id: '', customer: '', date: new Date().toISOString().slice(0, 10), amount: 0, mode: 'Bank Transfer', reference: '', status: 'Pending' };

function Form({ value, onChange, onSave, label }: { value: PaymentIn; onChange: (v: PaymentIn) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Customer" required>
        <Input value={value.customer} onChange={e => onChange({ ...value, customer: e.target.value })} placeholder="Customer name" />
      </FormField>
      <FormField label="Date">
        <Input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })} />
      </FormField>
      <FormField label="Amount (₹)" required>
        <Input type="number" value={value.amount || ''} onChange={e => onChange({ ...value, amount: Number(e.target.value) })} />
      </FormField>
      <FormField label="Payment Mode">
        <Select value={value.mode} onChange={e => onChange({ ...value, mode: e.target.value })}>
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>UPI</option>
          <option>Cheque</option>
          <option>Credit</option>
        </Select>
      </FormField>
      <FormField label="Reference No.">
        <Input value={value.reference} onChange={e => onChange({ ...value, reference: e.target.value })} placeholder="Transaction reference" />
      </FormField>
      <FormField label="Status">
        <Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}>
          <option>Pending</option>
          <option>Received</option>
          <option>Failed</option>
        </Select>
      </FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.customer || !value.amount} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function PaymentIn() {
  const crud = useCrud<PaymentIn>(initialData, 'paymentIn');
  const [form, setForm] = useState<PaymentIn>(empty);

  const columns = [
    { key: 'id', label: 'Receipt No.' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (v: number) => `₹${v.toLocaleString()}` },
    { key: 'mode', label: 'Mode' },
    { key: 'reference', label: 'Reference' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: PaymentIn) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Payment In" subtitle="Customer payments and receipts">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('PAY-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />New Payment</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Receipts</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Received</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Received').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Pending').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Received</p><p className="text-2xl font-bold mt-1">₹{(crud.data.filter(d => d.status === 'Received').reduce((s, d) => s + d.amount, 0) / 100000).toFixed(1)}L</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="New Payment Receipt"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Create Receipt" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Payment Receipt"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

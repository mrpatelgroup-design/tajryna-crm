import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { schemesData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Scheme { id: string; name: string; type: string; discount: string; minOrder: string; validTill: string; status: string; usage: number; }
const empty: Scheme = { id: '', name: '', type: 'Discount', discount: '', minOrder: '', validTill: '', status: 'Active', usage: 0 };

function Form({ value, onChange, onSave, label }: { value: Scheme; onChange: (v: Scheme) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Scheme Name" required><Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Scheme name" /></FormField>
      <FormField label="Type"><Select value={value.type} onChange={e => onChange({ ...value, type: e.target.value })}><option>Discount</option><option>Quantity</option><option>Slab</option><option>Cashback</option></Select></FormField>
      <FormField label="Discount/Offer" required><Input value={value.discount} onChange={e => onChange({ ...value, discount: e.target.value })} placeholder="e.g. 15%" /></FormField>
      <FormField label="Min Order"><Input value={value.minOrder} onChange={e => onChange({ ...value, minOrder: e.target.value })} placeholder="e.g. ₹10,000" /></FormField>
      <FormField label="Valid Till"><Input type="date" value={value.validTill} onChange={e => onChange({ ...value, validTill: e.target.value })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Active</option><option>Expiring Soon</option><option>Inactive</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name || !value.discount} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Schemes() {
  const crud = useCrud<Scheme>(schemesData as Scheme[]);
  const [form, setForm] = useState<Scheme>(empty);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Scheme Name' },
    { key: 'type', label: 'Type' },
    { key: 'discount', label: 'Discount' },
    { key: 'minOrder', label: 'Min Order' },
    { key: 'validTill', label: 'Valid Till' },
    { key: 'usage', label: 'Usage' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Scheme) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Schemes" subtitle="Trade promotion & scheme management">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('SCH-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Create Scheme</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Active Schemes</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Active').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Usage</p><p className="text-2xl font-bold mt-1">{crud.data.reduce((s, d) => s + d.usage, 0)}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Expiring Soon</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Expiring Soon').length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Create Scheme"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Create Scheme" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Scheme"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

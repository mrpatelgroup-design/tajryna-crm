import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Star, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { distributionData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Dist { id: string; name: string; location: string; zone: string; outlets: number; revenue: string; status: string; rating: number; }
const empty: Dist = { id: '', name: '', location: '', zone: 'West', outlets: 0, revenue: '₹0L', status: 'Active', rating: 4.0 };

function Form({ value, onChange, onSave, label }: { value: Dist; onChange: (v: Dist) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Name" required><Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Distributor name" /></FormField>
      <FormField label="Location" required><Input value={value.location} onChange={e => onChange({ ...value, location: e.target.value })} placeholder="City" /></FormField>
      <FormField label="Zone"><Select value={value.zone} onChange={e => onChange({ ...value, zone: e.target.value })}><option>North</option><option>South</option><option>East</option><option>West</option></Select></FormField>
      <FormField label="Outlets"><Input type="number" value={value.outlets || ''} onChange={e => onChange({ ...value, outlets: Number(e.target.value) })} /></FormField>
      <FormField label="Revenue"><Input value={value.revenue} onChange={e => onChange({ ...value, revenue: e.target.value })} placeholder="₹0L" /></FormField>
      <FormField label="Rating"><Input type="number" step="0.1" min="0" max="5" value={value.rating} onChange={e => onChange({ ...value, rating: Number(e.target.value) })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Active</option><option>Inactive</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name || !value.location} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Distribution() {
  const crud = useCrud<Dist>(distributionData as Dist[], 'distribution');
  const [form, setForm] = useState<Dist>(empty);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Distributor' },
    { key: 'location', label: 'Location' },
    { key: 'zone', label: 'Zone' },
    { key: 'outlets', label: 'Outlets' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'rating', label: 'Rating', render: (v: number) => (<div className="flex items-center gap-1"><Star className="size-3 fill-amber-400 text-amber-400" /><span>{v}</span></div>) },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Dist) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Distribution" subtitle="Distributor network management">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('D-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Distributor</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Distributors</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p><p className="text-xs text-emerald-600 mt-1">{crud.data.filter(d => d.status === 'Active').length} active</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Outlets</p><p className="text-2xl font-bold mt-1">{crud.data.reduce((s, d) => s + d.outlets, 0)}</p><p className="text-xs text-muted-foreground mt-1">covered</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Rating</p><p className="text-2xl font-bold mt-1 flex items-center gap-1"><Star className="size-5 fill-amber-400 text-amber-400" />{crud.data.length ? (crud.data.reduce((s, d) => s + d.rating, 0) / crud.data.length).toFixed(1) : '0'}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Distributor"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Add Distributor" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Distributor"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

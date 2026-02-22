import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { beatsData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Beat { id: string; name: string; area: string; outlets: number; assignedTo: string; day: string; status: string; coverage: number; }
const empty: Beat = { id: '', name: '', area: '', outlets: 0, assignedTo: '', day: 'Monday', status: 'Active', coverage: 0 };

function Form({ value, onChange, onSave, label }: { value: Beat; onChange: (v: Beat) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Beat Name" required><Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Beat name" /></FormField>
      <FormField label="Area" required><Input value={value.area} onChange={e => onChange({ ...value, area: e.target.value })} placeholder="Area/City" /></FormField>
      <FormField label="Outlets"><Input type="number" value={value.outlets || ''} onChange={e => onChange({ ...value, outlets: Number(e.target.value) })} /></FormField>
      <FormField label="Assigned To" required><Input value={value.assignedTo} onChange={e => onChange({ ...value, assignedTo: e.target.value })} placeholder="Rep name" /></FormField>
      <FormField label="Day"><Select value={value.day} onChange={e => onChange({ ...value, day: e.target.value })}><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></Select></FormField>
      <FormField label="Coverage %"><Input type="number" min="0" max="100" value={value.coverage || ''} onChange={e => onChange({ ...value, coverage: Number(e.target.value) })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Active</option><option>Inactive</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name || !value.area} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Beats() {
  const crud = useCrud<Beat>(beatsData as Beat[], 'beats');
  const [form, setForm] = useState<Beat>(empty);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Beat Name' },
    { key: 'area', label: 'Area' },
    { key: 'outlets', label: 'Outlets' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'day', label: 'Day' },
    { key: 'coverage', label: 'Coverage', render: (v: number) => (
      <div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full bg-slate-100"><div className={`h-full rounded-full ${v >= 80 ? 'bg-emerald-500' : v >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${v}%` }} /></div><span className="text-xs">{v}%</span></div>
    )},
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Beat) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Beats" subtitle="Beat planning & outlet mapping">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('B-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Create Beat</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Beats</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p><p className="text-xs text-emerald-600 mt-1">{crud.data.filter(d => d.status === 'Active').length} active</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Coverage</p><p className="text-2xl font-bold mt-1">{crud.data.length ? Math.round(crud.data.reduce((s, d) => s + d.coverage, 0) / crud.data.length) : 0}%</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Outlets</p><p className="text-2xl font-bold mt-1">{crud.data.reduce((s, d) => s + d.outlets, 0)}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Create Beat"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Create Beat" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Beat"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

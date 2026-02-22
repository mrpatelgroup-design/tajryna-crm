import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { routesData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface RouteItem { id: string; name: string; beats: number; outlets: number; distance: string; assignedTo: string; frequency: string; status: string; }
const empty: RouteItem = { id: '', name: '', beats: 0, outlets: 0, distance: '', assignedTo: '', frequency: 'Weekly', status: 'Active' };

function Form({ value, onChange, onSave, label }: { value: RouteItem; onChange: (v: RouteItem) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Route Name" required><Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Route name" /></FormField>
      <FormField label="Assigned To" required><Input value={value.assignedTo} onChange={e => onChange({ ...value, assignedTo: e.target.value })} placeholder="Rep name" /></FormField>
      <FormField label="Beats"><Input type="number" value={value.beats || ''} onChange={e => onChange({ ...value, beats: Number(e.target.value) })} /></FormField>
      <FormField label="Outlets"><Input type="number" value={value.outlets || ''} onChange={e => onChange({ ...value, outlets: Number(e.target.value) })} /></FormField>
      <FormField label="Distance"><Input value={value.distance} onChange={e => onChange({ ...value, distance: e.target.value })} placeholder="e.g. 45 km" /></FormField>
      <FormField label="Frequency"><Select value={value.frequency} onChange={e => onChange({ ...value, frequency: e.target.value })}><option>Daily</option><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option></Select></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Active</option><option>Inactive</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name || !value.assignedTo} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Routes() {
  const crud = useCrud<RouteItem>(routesData as RouteItem[], 'routes');
  const [form, setForm] = useState<RouteItem>(empty);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Route Name' },
    { key: 'beats', label: 'Beats' },
    { key: 'outlets', label: 'Outlets' },
    { key: 'distance', label: 'Distance' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: RouteItem) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Routes" subtitle="Route planning & optimization">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('R-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Create Route</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Routes</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Beats</p><p className="text-2xl font-bold mt-1">{crud.data.reduce((s, d) => s + d.beats, 0)}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Outlets Covered</p><p className="text-2xl font-bold mt-1">{crud.data.reduce((s, d) => s + d.outlets, 0)}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Active').length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Create Route"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Create Route" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Route"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

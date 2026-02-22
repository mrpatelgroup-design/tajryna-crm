import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { loyaltyData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Loy { id: string; customer: string; points: number; tier: string; redeemed: number; lastActivity: string; status: string; }
const empty: Loy = { id: '', customer: '', points: 0, tier: 'Silver', redeemed: 0, lastActivity: 'Just now', status: 'Active' };

function Form({ value, onChange, onSave, label }: { value: Loy; onChange: (v: Loy) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Customer" required><Input value={value.customer} onChange={e => onChange({ ...value, customer: e.target.value })} placeholder="Customer name" /></FormField>
      <FormField label="Points"><Input type="number" value={value.points || ''} onChange={e => onChange({ ...value, points: Number(e.target.value) })} /></FormField>
      <FormField label="Tier"><Select value={value.tier} onChange={e => onChange({ ...value, tier: e.target.value })}><option>Silver</option><option>Gold</option><option>Platinum</option><option>Diamond</option></Select></FormField>
      <FormField label="Redeemed"><Input type="number" value={value.redeemed || ''} onChange={e => onChange({ ...value, redeemed: Number(e.target.value) })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Active</option><option>Inactive</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.customer} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Loyalty() {
  const crud = useCrud<Loy>(loyaltyData as Loy[], 'loyalty');
  const [form, setForm] = useState<Loy>(empty);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'points', label: 'Points', render: (v: number) => v.toLocaleString() },
    { key: 'tier', label: 'Tier', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'redeemed', label: 'Redeemed', render: (v: number) => v.toLocaleString() },
    { key: 'lastActivity', label: 'Last Activity' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Loy) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Loyalty" subtitle="Customer loyalty program management">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('L-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Member</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Members</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Points</p><p className="text-2xl font-bold mt-1">{crud.data.reduce((s, d) => s + d.points, 0).toLocaleString()}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Redeemed</p><p className="text-2xl font-bold mt-1">{crud.data.reduce((s, d) => s + d.redeemed, 0).toLocaleString()}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Diamond</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.tier === 'Diamond').length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Loyalty Member"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Add Member" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Loyalty Member"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { teamData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Member { id: string; name: string; initials: string; role: string; zone: string; phone: string; visits: number; target: number; achieved: number; attendance: number; status: string; }
const empty: Member = { id: '', name: '', initials: '', role: 'Sales Rep', zone: '', phone: '', visits: 0, target: 0, achieved: 0, attendance: 0, status: 'Active' };

function Form({ value, onChange, onSave, label }: { value: Member; onChange: (v: Member) => void; onSave: () => void; label: string }) {
  const handleName = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    onChange({ ...value, name, initials });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Name" required><Input value={value.name} onChange={e => handleName(e.target.value)} placeholder="Full name" /></FormField>
      <FormField label="Role"><Select value={value.role} onChange={e => onChange({ ...value, role: e.target.value })}><option>Sales Rep</option><option>Van Sales</option><option>Area Manager</option><option>Regional Manager</option></Select></FormField>
      <FormField label="Zone" required><Input value={value.zone} onChange={e => onChange({ ...value, zone: e.target.value })} placeholder="Zone name" /></FormField>
      <FormField label="Phone"><Input value={value.phone} onChange={e => onChange({ ...value, phone: e.target.value })} placeholder="+91 98765 43220" /></FormField>
      <FormField label="Monthly Target (₹)"><Input type="number" value={value.target || ''} onChange={e => onChange({ ...value, target: Number(e.target.value) })} /></FormField>
      <FormField label="Achieved (₹)"><Input type="number" value={value.achieved || ''} onChange={e => onChange({ ...value, achieved: Number(e.target.value) })} /></FormField>
      <FormField label="Visits"><Input type="number" value={value.visits || ''} onChange={e => onChange({ ...value, visits: Number(e.target.value) })} /></FormField>
      <FormField label="Attendance %"><Input type="number" min="0" max="100" value={value.attendance || ''} onChange={e => onChange({ ...value, attendance: Number(e.target.value) })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Active</option><option>On Leave</option><option>Inactive</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name || !value.zone} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Team() {
  const crud = useCrud<Member>(teamData as Member[]);
  const [form, setForm] = useState<Member>(empty);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Team" subtitle="Sales team management & performance">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('T-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Member</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Team</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p><p className="text-xs text-emerald-600 mt-1">{crud.data.filter(d => d.status === 'Active').length} active</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Attendance</p><p className="text-2xl font-bold mt-1">{crud.data.length ? Math.round(crud.data.reduce((s, d) => s + d.attendance, 0) / crud.data.length) : 0}%</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Achievement</p><p className="text-2xl font-bold mt-1">{crud.data.length ? Math.round(crud.data.reduce((s, d) => s + (d.target > 0 ? (d.achieved / d.target) * 100 : 0), 0) / crud.data.length) : 0}%</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crud.data.map((member) => {
          const pct = member.target > 0 ? Math.round((member.achieved / member.target) * 100) : 0;
          return (
            <motion.div key={member.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-xl p-5 shadow-lg border-0 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`size-12 rounded-full flex items-center justify-center text-white font-bold ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}>{member.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role} • {member.zone}</p>
                </div>
                <StatusBadge status={member.status} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Target</span><span className="font-medium">₹{(member.achieved / 100000).toFixed(1)}L / ₹{(member.target / 100000).toFixed(0)}L</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 rounded-lg p-2 text-center"><p className="text-muted-foreground">Visits</p><p className="font-bold">{member.visits}</p></div>
                  <div className="bg-slate-50 rounded-lg p-2 text-center"><p className="text-muted-foreground">Attendance</p><p className="font-bold">{member.attendance}%</p></div>
                </div>
                <div className="flex justify-end gap-1 pt-1">
                  <button onClick={() => { setForm(member); crud.openEdit(member); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
                  <button onClick={() => crud.openDelete(member.id)} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Team Member"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Add Member" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Team Member"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Pencil, Trash2, Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { targetsData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Tgt { id: string; rep: string; zone: string; monthly: number; achieved: number; daily: number; dailyAchieved: number; status: string; }
const empty: Tgt = { id: '', rep: '', zone: '', monthly: 0, achieved: 0, daily: 0, dailyAchieved: 0, status: 'On Track' };

function Form({ value, onChange, onSave, label }: { value: Tgt; onChange: (v: Tgt) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Rep Name" required><Input value={value.rep} onChange={e => onChange({ ...value, rep: e.target.value })} placeholder="Sales rep name" /></FormField>
      <FormField label="Zone" required><Input value={value.zone} onChange={e => onChange({ ...value, zone: e.target.value })} placeholder="Zone name" /></FormField>
      <FormField label="Monthly Target (₹)" required><Input type="number" value={value.monthly || ''} onChange={e => onChange({ ...value, monthly: Number(e.target.value), daily: Math.round(Number(e.target.value) / 30) })} /></FormField>
      <FormField label="Achieved (₹)"><Input type="number" value={value.achieved || ''} onChange={e => onChange({ ...value, achieved: Number(e.target.value) })} /></FormField>
      <FormField label="Daily Target (₹)"><Input type="number" value={value.daily || ''} onChange={e => onChange({ ...value, daily: Number(e.target.value) })} /></FormField>
      <FormField label="Daily Achieved (₹)"><Input type="number" value={value.dailyAchieved || ''} onChange={e => onChange({ ...value, dailyAchieved: Number(e.target.value) })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>On Track</option><option>Ahead</option><option>Behind</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.rep || !value.zone || !value.monthly} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Targets() {
  const crud = useCrud<Tgt>(targetsData as Tgt[]);
  const [form, setForm] = useState<Tgt>(empty);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Targets" subtitle="Sales target tracking & management">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('TGT-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Target</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Reps</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Ahead</p><p className="text-2xl font-bold mt-1 text-emerald-600">{crud.data.filter(d => d.status === 'Ahead').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">On Track</p><p className="text-2xl font-bold mt-1 text-blue-600">{crud.data.filter(d => d.status === 'On Track').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Behind</p><p className="text-2xl font-bold mt-1 text-rose-600">{crud.data.filter(d => d.status === 'Behind').length}</p></div>
      </div>
      <div className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <div className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/50 px-6 py-4"><h3 className="text-base font-semibold">Individual Targets</h3></div>
        <div className="divide-y">
          {crud.data.map((t) => {
            const pct = t.monthly > 0 ? Math.round((t.achieved / t.monthly) * 100) : 0;
            return (
              <div key={t.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${t.status === 'Ahead' ? 'bg-emerald-500' : t.status === 'Behind' ? 'bg-rose-500' : 'bg-blue-500'}`}>
                      {t.rep.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div><p className="font-medium text-sm">{t.rep}</p><p className="text-xs text-muted-foreground">{t.zone}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{(t.achieved / 100000).toFixed(1)}L / ₹{(t.monthly / 100000).toFixed(0)}L</p>
                      <p className="text-xs text-muted-foreground">{pct}% achieved</p>
                    </div>
                    <StatusBadge status={t.status} />
                    <button onClick={() => { setForm(t); crud.openEdit(t); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
                    <button onClick={() => crud.openDelete(t.id)} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className={`h-full rounded-full transition-all ${t.status === 'Ahead' ? 'bg-emerald-500' : t.status === 'Behind' ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Target"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Add Target" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Target"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

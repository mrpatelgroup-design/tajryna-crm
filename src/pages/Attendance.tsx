import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Pencil, Trash2, Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { attendanceData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Att { id: string; name: string; date: string; checkIn: string; checkOut: string; location: string; status: string; hours: string; }
const empty: Att = { id: '', name: '', date: new Date().toISOString().slice(0, 10), checkIn: '', checkOut: '', location: '', status: 'Present', hours: '' };

function Form({ value, onChange, onSave, label }: { value: Att; onChange: (v: Att) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Name" required><Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Employee name" /></FormField>
      <FormField label="Date"><Input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })} /></FormField>
      <FormField label="Check In"><Input value={value.checkIn} onChange={e => onChange({ ...value, checkIn: e.target.value })} placeholder="09:00 AM" /></FormField>
      <FormField label="Check Out"><Input value={value.checkOut} onChange={e => onChange({ ...value, checkOut: e.target.value })} placeholder="06:00 PM" /></FormField>
      <FormField label="Location"><Input value={value.location} onChange={e => onChange({ ...value, location: e.target.value })} placeholder="Location" /></FormField>
      <FormField label="Hours"><Input value={value.hours} onChange={e => onChange({ ...value, hours: e.target.value })} placeholder="9h 00m" /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Present</option><option>On Leave</option><option>Absent</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Attendance() {
  const crud = useCrud<Att>(attendanceData as Att[]);
  const [form, setForm] = useState<Att>(empty);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'date', label: 'Date' },
    { key: 'checkIn', label: 'Check In' },
    { key: 'checkOut', label: 'Check Out' },
    { key: 'hours', label: 'Hours' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Att) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Attendance" subtitle="Team attendance tracking">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('A-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Record</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Present</p><p className="text-2xl font-bold mt-1 text-emerald-600">{crud.data.filter(d => d.status === 'Present').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">On Leave</p><p className="text-2xl font-bold mt-1 text-amber-600">{crud.data.filter(d => d.status === 'On Leave').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Absent</p><p className="text-2xl font-bold mt-1 text-rose-600">{crud.data.filter(d => d.status === 'Absent').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Records</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Attendance Record"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Add Record" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Attendance Record"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

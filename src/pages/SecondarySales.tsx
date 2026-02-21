import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { secondarySalesData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Sale { id: string; outlet: string; location: string; amount: number; items: number; rep: string; date: string; status: string; }

const empty: Sale = { id: '', outlet: '', location: '', amount: 0, items: 0, rep: '', date: new Date().toISOString().slice(0, 10), status: 'Pending' };

function SaleForm({ value, onChange, onSave, label }: { value: Sale; onChange: (v: Sale) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Outlet" required><Input value={value.outlet} onChange={(e) => onChange({ ...value, outlet: e.target.value })} placeholder="Enter outlet name" /></FormField>
      <FormField label="Location" required><Input value={value.location} onChange={(e) => onChange({ ...value, location: e.target.value })} placeholder="City" /></FormField>
      <FormField label="Amount (₹)" required><Input type="number" value={value.amount || ''} onChange={(e) => onChange({ ...value, amount: Number(e.target.value) })} placeholder="0" /></FormField>
      <FormField label="Items" required><Input type="number" value={value.items || ''} onChange={(e) => onChange({ ...value, items: Number(e.target.value) })} placeholder="0" /></FormField>
      <FormField label="Sales Rep" required><Input value={value.rep} onChange={(e) => onChange({ ...value, rep: e.target.value })} placeholder="Rep name" /></FormField>
      <FormField label="Date" required><Input type="date" value={value.date} onChange={(e) => onChange({ ...value, date: e.target.value })} /></FormField>
      <FormField label="Status">
        <Select value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value })}>
          <option>Pending</option><option>Completed</option><option>Returned</option>
        </Select>
      </FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.outlet || !value.location || !value.amount} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 transition-all">{label}</button>
      </div>
    </div>
  );
}

export default function SecondarySales() {
  const crud = useCrud<Sale>(secondarySalesData as Sale[]);
  const [form, setForm] = useState<Sale>(empty);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'outlet', label: 'Outlet' },
    { key: 'location', label: 'Location' },
    { key: 'amount', label: 'Amount', render: (v: number) => `₹${v.toLocaleString()}` },
    { key: 'items', label: 'Items' },
    { key: 'rep', label: 'Sales Rep' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Sale) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors"><Pencil className="size-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition-colors"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  const totalSales = crud.data.reduce((s, d) => s + d.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Secondary Sales" subtitle="Retail outlet sales transactions">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('SS-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />New Sale</button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Sales</p>
          <p className="text-2xl font-bold mt-1">₹{totalSales.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1">{crud.data.length} transactions</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Completed').length}</p>
          <p className="text-xs text-emerald-600 mt-1">orders</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Order Value</p>
          <p className="text-2xl font-bold mt-1">₹{crud.data.length ? Math.round(totalSales / crud.data.length).toLocaleString() : 0}</p>
          <p className="text-xs text-muted-foreground mt-1">per order</p>
        </div>
      </div>

      <DataTable columns={columns} data={crud.data} />

      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="New Secondary Sale">
        <SaleForm value={form} onChange={setForm} onSave={() => crud.add(form)} label="Create Sale" />
      </Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Secondary Sale">
        <SaleForm value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" />
      </Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

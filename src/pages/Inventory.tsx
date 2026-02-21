import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { inventoryData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Inv { id: string; product: string; sku: string; warehouse: string; stock: number; allocated: number; available: number; reorderLevel: number; status: string; }
const empty: Inv = { id: '', product: '', sku: '', warehouse: '', stock: 0, allocated: 0, available: 0, reorderLevel: 0, status: 'Healthy' };

function Form({ value, onChange, onSave, label }: { value: Inv; onChange: (v: Inv) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Product" required><Input value={value.product} onChange={e => onChange({ ...value, product: e.target.value })} placeholder="Product name" /></FormField>
      <FormField label="SKU" required><Input value={value.sku} onChange={e => onChange({ ...value, sku: e.target.value })} placeholder="SKU code" /></FormField>
      <FormField label="Warehouse" required><Input value={value.warehouse} onChange={e => onChange({ ...value, warehouse: e.target.value })} placeholder="Warehouse name" /></FormField>
      <FormField label="Stock"><Input type="number" value={value.stock || ''} onChange={e => onChange({ ...value, stock: Number(e.target.value), available: Number(e.target.value) - value.allocated })} /></FormField>
      <FormField label="Allocated"><Input type="number" value={value.allocated || ''} onChange={e => onChange({ ...value, allocated: Number(e.target.value), available: value.stock - Number(e.target.value) })} /></FormField>
      <FormField label="Reorder Level"><Input type="number" value={value.reorderLevel || ''} onChange={e => onChange({ ...value, reorderLevel: Number(e.target.value) })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>Healthy</option><option>Critical</option><option>Out of Stock</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.product || !value.sku} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Inventory() {
  const crud = useCrud<Inv>(inventoryData as Inv[]);
  const [form, setForm] = useState<Inv>(empty);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'product', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'warehouse', label: 'Warehouse' },
    { key: 'stock', label: 'Stock' },
    { key: 'allocated', label: 'Allocated' },
    { key: 'available', label: 'Available', render: (v: number, row: Inv) => (<span className={v <= row.reorderLevel ? 'text-rose-600 font-semibold' : ''}>{v}</span>) },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Inv) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Inventory" subtitle="Warehouse stock management">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('INV-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Stock</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Items</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Healthy</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Healthy').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0 relative overflow-hidden"><div className="absolute top-2 right-2"><AlertTriangle className="size-4 text-amber-500" /></div><p className="text-xs text-muted-foreground uppercase tracking-wider">Critical</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Critical').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Out of Stock</p><p className="text-2xl font-bold mt-1 text-rose-600">{crud.data.filter(d => d.status === 'Out of Stock').length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Inventory"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Add Stock" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Inventory"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

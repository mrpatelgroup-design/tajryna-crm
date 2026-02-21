import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { productsData } from '../lib/data';
import { useCrud } from '../lib/useCrud';

interface Prod { id: string; name: string; sku: string; category: string; price: number; stock: number; minStock: number; status: string; }
const empty: Prod = { id: '', name: '', sku: '', category: 'Flour', price: 0, stock: 0, minStock: 0, status: 'In Stock' };

function Form({ value, onChange, onSave, label }: { value: Prod; onChange: (v: Prod) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Product Name" required><Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Product name" /></FormField>
      <FormField label="SKU" required><Input value={value.sku} onChange={e => onChange({ ...value, sku: e.target.value })} placeholder="SKU code" /></FormField>
      <FormField label="Category"><Select value={value.category} onChange={e => onChange({ ...value, category: e.target.value })}><option>Flour</option><option>Oils</option><option>Rice</option><option>Sugar</option><option>Beverages</option><option>Pulses</option><option>Dairy</option><option>Spices</option></Select></FormField>
      <FormField label="Price (₹)" required><Input type="number" value={value.price || ''} onChange={e => onChange({ ...value, price: Number(e.target.value) })} /></FormField>
      <FormField label="Stock"><Input type="number" value={value.stock || ''} onChange={e => onChange({ ...value, stock: Number(e.target.value) })} /></FormField>
      <FormField label="Min Stock"><Input type="number" value={value.minStock || ''} onChange={e => onChange({ ...value, minStock: Number(e.target.value) })} /></FormField>
      <FormField label="Status"><Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></Select></FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name || !value.sku} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Products() {
  const crud = useCrud<Prod>(productsData as Prod[]);
  const [form, setForm] = useState<Prod>(empty);

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (v: number) => `₹${v}` },
    { key: 'stock', label: 'Stock' },
    { key: 'minStock', label: 'Min Stock' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Prod) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Products" subtitle="Product catalog management">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('P-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Product</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total SKUs</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">In Stock</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'In Stock').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Low Stock</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Low Stock').length}</p><p className="text-xs text-amber-600 mt-1">Reorder needed</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Out of Stock</p><p className="text-2xl font-bold mt-1 text-rose-600">{crud.data.filter(d => d.status === 'Out of Stock').length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Product"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Add Product" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Product"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
    </motion.div>
  );
}

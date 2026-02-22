import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select, Textarea } from '../components/FormField';
import { useSmartStore } from '../lib/smartStore';
import { useCrud } from '../lib/useCrud';

interface Cust {
  id: string;
  name: string;
  type: string;
  location: string;
  contact: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  state: string;
  gstin: string;
  creditLimit: number;
  orders: number;
  revenue: string;
  lastOrder: string;
  status: string;
}

const empty: Cust = {
  id: '',
  name: '',
  type: 'Retail',
  location: '',
  contact: '',
  email: '',
  billingAddress: '',
  shippingAddress: '',
  state: '',
  gstin: '',
  creditLimit: 0,
  orders: 0,
  revenue: '₹0L',
  lastOrder: 'Just now',
  status: 'Active'
};

function Form({ value, onChange, onSave, label }: { value: Cust; onChange: (v: Cust) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FormField label="Name" required>
        <Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Customer name" />
      </FormField>
      <FormField label="Customer Type">
        <Select value={value.type} onChange={e => onChange({ ...value, type: e.target.value })}>
          <option>Retail</option>
          <option>Wholesale</option>
          <option>Supermarket</option>
          <option>Distributor</option>
          <option>Super Stockist</option>
        </Select>
      </FormField>
      <FormField label="Location" required>
        <Input value={value.location} onChange={e => onChange({ ...value, location: e.target.value })} placeholder="City" />
      </FormField>
      <FormField label="Contact">
        <Input value={value.contact} onChange={e => onChange({ ...value, contact: e.target.value })} placeholder="+91 98765 43210" />
      </FormField>
      <FormField label="Email">
        <Input value={value.email} onChange={e => onChange({ ...value, email: e.target.value })} placeholder="email@example.com" />
      </FormField>
      <FormField label="State">
        <Input value={value.state} onChange={e => onChange({ ...value, state: e.target.value })} placeholder="Maharashtra" />
      </FormField>
      <FormField label="GSTIN">
        <Input value={value.gstin} onChange={e => onChange({ ...value, gstin: e.target.value })} placeholder="27AABCM1234A1Z5" />
      </FormField>
      <FormField label="Credit Limit">
        <Input type="number" value={value.creditLimit || ''} onChange={e => onChange({ ...value, creditLimit: Number(e.target.value) })} placeholder="500000" />
      </FormField>
      <FormField label="Billing Address">
        <Textarea value={value.billingAddress} onChange={e => onChange({ ...value, billingAddress: e.target.value })} rows={2} />
      </FormField>
      <FormField label="Shipping Address">
        <Textarea value={value.shippingAddress} onChange={e => onChange({ ...value, shippingAddress: e.target.value })} rows={2} />
      </FormField>
      <FormField label="Status">
        <Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}>
          <option>Active</option>
          <option>Inactive</option>
          <option>Dormant</option>
        </Select>
      </FormField>
      <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name || !value.location} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Customers() {
  const { data, addCustomer, updateCustomer, deleteCustomer, getTotalOrdersByCustomer, initializeDefaults } = useSmartStore();
  const crud = useCrud<Cust>([] as Cust[], 'customers');
  const [form, setForm] = useState<Cust>(empty);

  useEffect(() => {
    initializeDefaults();
  }, []);

  useEffect(() => {
    const customerData = data.customers.map(c => ({
      ...c,
      orders: getTotalOrdersByCustomer(c.id),
      revenue: '₹0L',
      lastOrder: 'Just now'
    }));
    crud.setData(customerData as Cust[]);
  }, [data.customers, data.orders]);

  const handleAdd = () => {
    addCustomer({ ...form, id: crud.nextId('C-') });
    crud.setShowAdd(false);
    setForm(empty);
  };

  const handleUpdate = () => {
    updateCustomer(form);
    crud.setShowEdit(false);
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    crud.setShowDelete(false);
  };

  const typeColors: Record<string, string> = { 
    'Retail': 'bg-blue-100 text-blue-700 border-blue-200', 
    'Wholesale': 'bg-purple-100 text-purple-700 border-purple-200', 
    'Supermarket': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Distributor': 'bg-amber-100 text-amber-700 border-amber-200',
    'Super Stockist': 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Customer' },
    { key: 'type', label: 'Type', render: (v: string) => <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${typeColors[v] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{v}</span> },
    { key: 'location', label: 'Location' },
    { key: 'state', label: 'State' },
    { key: 'gstin', label: 'GSTIN' },
    { key: 'creditLimit', label: 'Credit Limit', render: (v: number) => `₹${v.toLocaleString()}` },
    { key: 'orders', label: 'Orders' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Cust) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.setShowEdit(true); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Customers" subtitle="Customer relationship management">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('C-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Customer</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Customers</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Active').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Dormant</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Dormant').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Orders</p><p className="text-2xl font-bold mt-1">{data.orders.length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Customer"><Form value={form} onChange={setForm} onSave={handleAdd} label="Add Customer" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Customer"><Form value={form} onChange={setForm} onSave={handleUpdate} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={() => handleDelete(crud.deleteId || '')} />
    </motion.div>
  );
}

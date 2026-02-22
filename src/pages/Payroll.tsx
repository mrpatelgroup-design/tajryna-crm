import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Pencil, Trash2, RefreshCw, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { useSmartStore } from '../lib/smartStore';

interface PayrollData {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  daysWorked: number;
  totalDays: number;
  basicSalary: number;
  allowances: number;
  incentive: number;
  loyaltyBonus: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  paymentMode: string;
  status: string;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Form({ value, onChange, onSave, label }: { 
  value: PayrollData; 
  onChange: (v: PayrollData) => void; 
  onSave: () => void; 
  label: string;
}) {
  const calculateNet = () => {
    return (value.basicSalary || 0) + (value.allowances || 0) + (value.incentive || 0) + (value.loyaltyBonus || 0) - (value.deductions || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Employee" required>
        <Input value={value.employeeName || ''} onChange={e => onChange({ ...value, employeeName: e.target.value })} />
      </FormField>
      <FormField label="Month">
        <Select value={value.month || 'January'} onChange={e => onChange({ ...value, month: e.target.value })}>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </Select>
      </FormField>
      <FormField label="Year">
        <Input type="number" value={value.year || 2026} onChange={e => onChange({ ...value, year: Number(e.target.value) })} />
      </FormField>
      <FormField label="Basic Salary">
        <Input type="number" value={value.basicSalary || 0} onChange={e => onChange({ ...value, basicSalary: Number(e.target.value) })} />
      </FormField>
      <FormField label="Allowances">
        <Input type="number" value={value.allowances || 0} onChange={e => onChange({ ...value, allowances: Number(e.target.value) })} />
      </FormField>
      <FormField label="Incentive">
        <Input type="number" value={value.incentive || 0} onChange={e => onChange({ ...value, incentive: Number(e.target.value) })} />
      </FormField>
      <FormField label="Loyalty Bonus">
        <Input type="number" value={value.loyaltyBonus || 0} onChange={e => onChange({ ...value, loyaltyBonus: Number(e.target.value) })} />
      </FormField>
      <FormField label="Deductions">
        <Input type="number" value={value.deductions || 0} onChange={e => onChange({ ...value, deductions: Number(e.target.value) })} />
      </FormField>
      <FormField label="Net Salary">
        <Input type="number" value={calculateNet()} disabled className="bg-gray-50 font-bold" />
      </FormField>
      <FormField label="Status">
        <Select value={value.status || 'Pending'} onChange={e => onChange({ ...value, status: e.target.value })}>
          <option>Pending</option>
          <option>Processed</option>
          <option>Paid</option>
        </Select>
      </FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.employeeName} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Payroll() {
  const store = useSmartStore();
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [form, setForm] = useState<PayrollData | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    store.initializeDefaults();
  }, []);

  useEffect(() => {
    if (store.data.payroll) {
      setPayrollData(store.data.payroll as PayrollData[]);
    }
  }, [store.data.payroll]);

  const handleAdd = () => {
    if (form) {
      store.addPayroll(form as any);
      setShowAdd(false);
      setForm(null);
    }
  };

  const handleUpdate = () => {
    if (form) {
      store.updatePayroll(form as any);
      setShowEdit(false);
      setForm(null);
    }
  };

  const handleDelete = () => {
    store.deletePayroll(deleteId);
    setShowDelete(false);
    setDeleteId('');
  };

  const handleAutoGenerate = () => {
    const team = store.data.team || [];
    const newPayrolls: PayrollData[] = team.map((emp: any) => ({
      id: `SAL-${emp.id}-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      month: months[new Date().getMonth()],
      year: new Date().getFullYear(),
      daysWorked: 26,
      totalDays: 30,
      basicSalary: emp.salary || 30000,
      allowances: emp.allowances || 5000,
      incentive: 0,
      loyaltyBonus: 0,
      deductions: 0,
      netSalary: (emp.salary || 30000) + (emp.allowances || 5000),
      paymentDate: '',
      paymentMode: 'Bank Transfer',
      status: 'Pending',
    }));

    newPayrolls.forEach(p => store.addPayroll(p as any));
    setShowAutoGenerate(false);
  };

  const columns = [
    { key: 'id', label: 'Salary ID' },
    { key: 'employeeName', label: 'Employee' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
    { key: 'basicSalary', label: 'Basic', render: (v: number) => `₹${(v || 0).toLocaleString()}` },
    { key: 'allowances', label: 'Allowances', render: (v: number) => `₹${(v || 0).toLocaleString()}` },
    { key: 'incentive', label: 'Incentive', render: (v: number) => `₹${(v || 0).toLocaleString()}` },
    { key: 'loyaltyBonus', label: 'Loyalty', render: (v: number) => `₹${(v || 0).toLocaleString()}` },
    { key: 'netSalary', label: 'Net Salary', render: (v: number) => `₹${(v || 0).toLocaleString()}` },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v || 'Pending'} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: PayrollData) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); setShowEdit(true); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); setDeleteId(row.id); setShowDelete(true); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  const totalPayroll = payrollData.reduce((s, p) => s + (p.netSalary || 0), 0);
  const pendingCount = payrollData.filter(p => p.status === 'Pending').length;
  const paidCount = payrollData.filter(p => p.status === 'Paid').length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Payroll & Salary" subtitle="Manage employee salaries">
        <button onClick={() => setShowAutoGenerate(true)} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90">
          <RefreshCw className="size-4" /> Auto Generate
        </button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4 text-blue-500" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Employees</p>
          </div>
          <p className="text-2xl font-bold">{store.data.team?.length || 0}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Payroll</p>
          <p className="text-2xl font-bold">₹{(totalPayroll / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Paid</p>
          <p className="text-2xl font-bold">{paidCount}</p>
        </div>
      </div>

      <DataTable columns={columns} data={payrollData as unknown as Record<string, unknown>[]} />
      
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setForm(null); }} title="Add Salary">
        {form && <Form value={form} onChange={setForm} onSave={handleAdd} label="Add Salary" />}
      </Modal>
      
      <Modal open={showEdit} onClose={() => { setShowEdit(false); setForm(null); }} title="Edit Salary">
        {form && <Form value={form} onChange={setForm} onSave={handleUpdate} label="Save Changes" />}
      </Modal>
      
      <ConfirmDialog open={showDelete} onClose={() => { setShowDelete(false); setDeleteId(''); }} onConfirm={handleDelete} />
      
      <Modal open={showAutoGenerate} onClose={() => setShowAutoGenerate(false)} title="Auto Generate Payroll">
        <div className="space-y-4">
          <p>Generate payroll for all team members for the current month?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAutoGenerate(false)} className="h-9 px-4 border rounded-md">Cancel</button>
            <button onClick={handleAutoGenerate} className="h-9 px-4 bg-indigo-500 text-white rounded-md">Generate</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

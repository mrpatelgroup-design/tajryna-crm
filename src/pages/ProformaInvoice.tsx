import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2, Upload, FileText, X, Check, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { useCrud } from '../lib/useCrud';

interface Proforma {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

const initialData: Proforma[] = [
  { id: 'PI-001', customer: 'Metro Mart', date: '2026-02-21', amount: 45000, status: 'Pending' },
  { id: 'PI-002', customer: 'ABC Distributors', date: '2026-02-20', amount: 120000, status: 'Invoice Created' },
  { id: 'PI-003', customer: 'Quick Shop', date: '2026-02-19', amount: 28000, status: 'Pending' },
];

const empty: Proforma = { id: '', customer: '', date: new Date().toISOString().slice(0, 10), amount: 0, status: 'Pending' };

interface PdfImportData {
  invoiceNumber: string;
  date: string;
  customer: string;
  amount: number;
}

function PdfImportModal({ open, onClose, onImport }: {
  open: boolean;
  onClose: () => void;
  onImport: (data: Proforma) => void;
}) {
  const [pdfData, setPdfData] = useState<PdfImportData | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractPdfDetails = (text: string): PdfImportData => {
    let invoiceNumber = '';
    let date = new Date().toISOString().slice(0, 10);
    let customer = '';
    let amount = 0;

    const invoicePatterns = [/invoice\s*#?\s*:?\s*([A-Z0-9-\/]+)/i, /proforma\s*#?\s*:?\s*([A-Z0-9-\/]+)/i, /pi\s*#?\s*:?\s*([A-Z0-9-\/]+)/i];
    for (const pattern of invoicePatterns) {
      const match = text.match(pattern);
      if (match) { invoiceNumber = match[1]; break; }
    }

    const datePatterns = [/date\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i, /dated?\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i];
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const parsed = new Date(match[1]);
          if (!isNaN(parsed.getTime())) { date = parsed.toISOString().slice(0, 10); break; }
        } catch {}
      }
    }

    const amountPatterns = [/total\s*:?\s*₹?\s*([\d,]+\.?\d*)/i, /grand\s*total\s*:?\s*₹?\s*([\d,]+\.?\d*)/i, /amount\s*:?\s*₹?\s*([\d,]+\.?\d*)/i, /net\s*amount\s*:?\s*₹?\s*([\d,]+\.?\d*)/i];
    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) { amount = parseFloat(match[1].replace(/,/g, '')) || 0; break; }
    }

    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const customerLines = lines.filter(l => {
      const hasOnlyNumbers = /^[\d,\.\s₹]+$/.test(l);
      const isHeader = /invoice|total|tax|gst|subtotal|grand|balance|due|date|mobile|phone|email|gstin/i.test(l);
      return !hasOnlyNumbers && !isHeader && l.length > 3;
    });

    if (customerLines.length > 0) {
      for (const line of customerLines.slice(0, 3)) {
        if (line.length > 3 && !line.match(/^[0-9]+$/) && !line.match(/^[₹\s,]+$/)) {
          customer = line;
          break;
        }
      }
    }

    return { invoiceNumber, date, customer, amount };
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');
    setPdfLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      const details = extractPdfDetails(fullText);
      
      if (!details.amount && !details.customer) {
        setFileError('Could not extract data from PDF. Please enter manually.');
        setPdfLoading(false);
        return;
      }

      setPdfData(details);
    } catch (err) {
      console.error('PDF parsing error:', err);
      setFileError('Failed to parse PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleImport = () => {
    if (!pdfData) return;

    onImport({
      id: pdfData.invoiceNumber || `PI-${Date.now()}`,
      date: pdfData.date,
      customer: pdfData.customer,
      amount: pdfData.amount,
      status: 'Pending',
    });
    
    setPdfData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Import from PDF</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="size-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {!pdfData ? (
            <>
              <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  id="proforma-pdf-upload"
                />
                <label htmlFor="proforma-pdf-upload" className="cursor-pointer">
                  {pdfLoading ? (
                    <div className="mx-auto h-12 w-12 mb-3 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                  ) : (
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  )}
                  <p className="text-sm font-medium">{pdfLoading ? 'Parsing PDF...' : 'Click to upload PDF Invoice'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Extracts proforma invoice details from PDF</p>
                </label>
              </div>
              
              {fileError && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">
                  <AlertCircle className="size-4" /> {fileError}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <Check className="size-4" /> Successfully extracted data from PDF
              </div>

              <div className="space-y-3">
                <div><p className="text-xs text-muted-foreground">Invoice #</p><p className="font-medium">{pdfData.invoiceNumber || 'Not found'}</p></div>
                <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{pdfData.date}</p></div>
                <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{pdfData.customer || 'Not found'}</p></div>
                <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-medium">₹{pdfData.amount.toLocaleString()}</p></div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setPdfData(null)} className="flex-1 h-9 border rounded-md hover:bg-muted text-sm">Back</button>
                <button onClick={handleImport} className="flex-1 h-9 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-sm">Import</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Form({ value, onChange, onSave, label }: { value: Proforma; onChange: (v: Proforma) => void; onSave: () => void; label: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Customer" required>
        <Input value={value.customer} onChange={e => onChange({ ...value, customer: e.target.value })} placeholder="Customer name" />
      </FormField>
      <FormField label="Date">
        <Input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })} />
      </FormField>
      <FormField label="Amount (₹)" required>
        <Input type="number" value={value.amount || ''} onChange={e => onChange({ ...value, amount: Number(e.target.value) })} />
      </FormField>
      <FormField label="Status">
        <Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}>
          <option>Pending</option>
          <option>Invoice Created</option>
          <option>Cancelled</option>
        </Select>
      </FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.customer || !value.amount} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function ProformaInvoice() {
  const crud = useCrud<Proforma>(initialData, 'proformaInvoices');
  const [form, setForm] = useState<Proforma>(empty);
  const [showPdfImport, setShowPdfImport] = useState(false);

  const columns = [
    { key: 'id', label: 'PI No.' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (v: number) => `₹${v.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Proforma) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.openEdit(row); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  const handlePdfImport = (data: Proforma) => {
    crud.add(data);
    setShowPdfImport(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Proforma Invoice" subtitle="Proforma invoices before final billing">
        <button onClick={() => setShowPdfImport(true)} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Upload className="size-4" />Import PDF</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('PI-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />New Proforma</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total PI</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Pending').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Invoice Created</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Invoice Created').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Value</p><p className="text-2xl font-bold mt-1">₹{(crud.data.reduce((s, d) => s + d.amount, 0) / 100000).toFixed(1)}L</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="New Proforma Invoice"><Form value={form} onChange={setForm} onSave={() => crud.add(form)} label="Create PI" /></Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Proforma Invoice"><Form value={form} onChange={setForm} onSave={() => crud.update(form)} label="Save Changes" /></Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={crud.remove} />
      <PdfImportModal open={showPdfImport} onClose={() => setShowPdfImport(false)} onImport={handlePdfImport} />
    </motion.div>
  );
}

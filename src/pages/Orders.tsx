import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2, X, Image, Save, Upload, FileText, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select, Textarea } from '../components/FormField';
import { useSmartStore } from '../lib/smartStore';
import { useCrud } from '../lib/useCrud';

interface OrderItem {
  id: string;
  item: string;
  productId: string;
  description: string;
  count: number;
  batchNo: string;
  expDate: string;
  mrp: number;
  qty: number;
  freeQty: number;
  unit: string;
  priceUnit: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  addCess: number;
  amount: number;
}

interface Order {
  id: string;
  type: string;
  partyType: string;
  customer: string;
  customerId: string;
  salesPerson: string;
  salesPersonId: string;
  payment: string;
  godown: string;
  billingName: string;
  billingAddress: string;
  shippingAddress: string;
  poNo: string;
  poDate: string;
  ewayBillNo: string;
  invoiceNumber: string;
  invoiceDate: string;
  time: string;
  stateOfSupply: string;
  items: OrderItem[];
  deliveryLocation: string;
  description: string;
  image: string;
  document: string;
  copies: string;
  discount: number;
  shipping: number;
  packaging: number;
  adjustment: number;
  roundOff: number;
  total: number;
  date: string;
  status: string;
}

interface ParsedInvoiceItem {
  itemName: string;
  itemCode: string;
  hsn: string;
  qty: number;
  rate: number;
  amount: number;
  taxRate: number;
  batchNo: string;
  expDate: string;
}

interface InvoiceImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (orderData: Partial<Order>) => void;
  products: any[];
}

const parsePdfText = (text: string): ParsedInvoiceItem[] => {
  const items: ParsedInvoiceItem[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const numberPattern = /[\d,]+\.?\d*/g;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('invoice') || lowerLine.includes('total') || lowerLine.includes('subtotal') ||
        lowerLine.includes('tax') || lowerLine.includes('gst') || lowerLine.includes('bill') ||
        lowerLine.includes('company') || lowerLine.includes('address') || lowerLine.includes('phone') ||
        lowerLine.includes('email') || lowerLine.includes('date') || lowerLine.includes('#') ||
        lowerLine.includes('mobile') || lowerLine.includes('gstin') || lowerLine.includes('state') ||
        lowerLine.includes('hsn') || lowerLine.includes('sac') || lowerLine.includes('rate') ||
        lowerLine.includes('amount') || lowerLine.includes('discount') || lowerLine.includes('cgst') ||
        lowerLine.includes('sgst') || lowerLine.includes('igst') || lowerLine.includes('cess') ||
        lowerLine.includes('grand') || lowerLine.includes('net') || lowerLine.includes('sub') ||
        lowerLine.includes('balance') || lowerLine.includes('due') || lowerLine.includes('payment') ||
        lowerLine.includes('bank') || lowerLine.includes('ifsc') || lowerLine.includes('account') ||
        lowerLine.includes('pan') || lowerLine.includes('tin') || lowerLine.includes('cst') ||
        lowerLine.includes('serial') || lowerLine.includes('no.') || lowerLine.includes('no ') ||
        lowerLine.includes('mrp') || lowerLine.includes('pack') || lowerLine.includes('unit')) {
      continue;
    }
    
    const numbers = line.match(numberPattern);
    if (!numbers || numbers.length < 2) continue;
    
    const cleanNumber = (n: string) => parseFloat(n.replace(/,/g, '')) || 0;
    let itemName = line.replace(numberPattern, '').replace(/[₹$,]/g, '').trim() || '';
    
    if (itemName.length < 2) continue;
    
    const qty = numbers.length > 1 ? cleanNumber(numbers[numbers.length - 2]) : 1;
    const rate = numbers.length > 0 ? cleanNumber(numbers[numbers.length - 1]) : 0;
    
    if (qty > 0 && rate > 0 && itemName.length > 1) {
      items.push({
        itemName: itemName.substring(0, 50),
        itemCode: '',
        hsn: '',
        qty,
        rate,
        amount: qty * rate,
        taxRate: 0,
        batchNo: '',
        expDate: '',
      });
    }
  }
  return items;
};

const extractPdfDetails = (text: string) => {
  let invoiceNumber = '';
  let date = new Date().toISOString().slice(0, 10);
  let customerName = '';
  let total = 0;
  
  const invoicePatterns = [
    /invoice\s*#?\s*:?\s*([A-Z0-9][A-Z0-9\-\/]*)/i,
    /inv\s*#?\s*:?\s*([A-Z0-9][A-Z0-9\-\/]*)/i,
    /bill\s*#?\s*:?\s*([A-Z0-9][A-Z0-9\-\/]*)/i,
    /order\s*#?\s*:?\s*([A-Z0-9][A-Z0-9\-\/]*)/i,
    /challan\s*#?\s*:?\s*([A-Z0-9][A-Z0-9\-\/]*)/i,
    /dc\s*#?\s*:?\s*([A-Z0-9][A-Z0-9\-\/]*)/i,
    /(?:invoice|inv|bill|order|challan|dc)\s*(?:no|number|no\.)\s*:?\s*([A-Z0-9][A-Z0-9\-\/]*)/i,
  ];
  for (const pattern of invoicePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 2) { 
      invoiceNumber = match[1]; 
      break; 
    }
  }
  
  const datePatterns = [
    /date\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /dated?\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        let dateStr = match[1];
        if (match[1].length === 8) {
          dateStr = `${dateStr.slice(0,2)}/${dateStr.slice(2,4)}/20${dateStr.slice(6,8)}`;
        }
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) { 
          date = parsed.toISOString().slice(0, 10); 
          break; 
        }
      } catch {}
    }
  }
  
  const totalPatterns = [
    /total\s*:?\s*₹?\s*([\d,]+\.?\d*)/i,
    /grand\s*total\s*:?\s*₹?\s*([\d,]+\.?\d*)/i,
    /amount\s*due\s*:?\s*₹?\s*([\d,]+\.?\d*)/i,
    /net\s*amount\s*:?\s*₹?\s*([\d,]+\.?\d*)/i,
    /balance\s*due\s*:?\s*₹?\s*([\d,]+\.?\d*)/i,
    /payable\s*:?\s*₹?\s*([\d,]+\.?\d*)/i,
    /₹\s*([\d,]+\.?\d*)\s*$/im,
  ];
  for (const pattern of totalPatterns) {
    const match = text.match(pattern);
    if (match) { 
      total = parseFloat(match[1].replace(/,/g, '')) || 0; 
      if (total > 0) break; 
    }
  }
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const customerLines = lines.filter(l => {
    const hasOnlyNumbers = /^[\d,\.\s₹]+$/.test(l);
    const isHeader = /invoice|total|tax|gst|subtotal|grand|balance|due|date|mobile|phone|email|gstin|hsn|state|country|pincode|pin/i.test(l);
    return !hasOnlyNumbers && !isHeader && l.length > 3 && l.length < 60;
  });
  
  if (customerLines.length > 0) {
    for (const line of customerLines.slice(0, 5)) {
      if (line.length > 3 && line.length < 50 && !line.match(/^[0-9]+$/) && !line.match(/^[₹\s,]+$/) && !line.match(/^[a-z]+$/i)) {
        customerName = line;
        break;
      }
    }
  }
  
  return { invoiceNumber, date, customer: customerName, total };
};

const findProductMatch = (item: ParsedInvoiceItem, products: any[]): string => {
  if (!products.length) return '';
  const matchByCode = products.find(p => p.itemCode === item.itemCode);
  if (matchByCode) return matchByCode.id;
  const matchByName = products.find(p => p.itemName?.toLowerCase() === item.itemName?.toLowerCase());
  if (matchByName) return matchByCode?.id || '';
  const partialMatch = products.find(p => p.itemName?.toLowerCase().includes(item.itemName?.toLowerCase()) || item.itemName?.toLowerCase().includes(p.itemName?.toLowerCase()));
  return partialMatch?.id || '';
};

function InvoiceImportModal({ open, onClose, onImport, products }: InvoiceImportModalProps) {
  const [importMode, setImportMode] = useState<'file' | 'pdf' | 'manual'>('file');
  const [csvData, setCsvData] = useState<ParsedInvoiceItem[]>([]);
  const [pdfData, setPdfData] = useState<{items: ParsedInvoiceItem[], invoiceNumber: string, date: string, customer: string, total: number} | null>(null);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState('');
  const [importStep, setImportStep] = useState(1);
  const [pdfParsing, setPdfParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [manualData, setManualData] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().slice(0, 10),
    customerName: '',
    customer: '',
    customerId: '',
    items: [] as ParsedInvoiceItem[],
  });

  const [newItem, setNewItem] = useState<ParsedInvoiceItem>({
    itemName: '',
    itemCode: '',
    hsn: '',
    qty: 1,
    rate: 0,
    amount: 0,
    taxRate: 0,
    batchNo: '',
    expDate: '',
  });

  const headerOptions = [
    { value: '', label: '-- Skip --' },
    { value: 'itemName', label: 'Item Name' },
    { value: 'itemCode', label: 'Item Code' },
    { value: 'hsn', label: 'HSN Code' },
    { value: 'qty', label: 'Quantity' },
    { value: 'rate', label: 'Rate/Price' },
    { value: 'amount', label: 'Amount' },
    { value: 'taxRate', label: 'Tax Rate' },
    { value: 'batchNo', label: 'Batch No' },
    { value: 'expDate', label: 'Expiry Date' },
  ];

  const { data } = useSmartStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setFileError('File must contain at least a header row and one data row');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        setParsedHeaders(headers);

        const defaultMapping: Record<string, string> = {};
        headers.forEach(h => {
          const lower = h.toLowerCase();
          if (lower.includes('item') || lower.includes('product') || lower.includes('name')) defaultMapping[h] = 'itemName';
          else if (lower.includes('code') || lower.includes('sku')) defaultMapping[h] = 'itemCode';
          else if (lower.includes('hsn')) defaultMapping[h] = 'hsn';
          else if (lower.includes('qty') || lower.includes('quantity')) defaultMapping[h] = 'qty';
          else if (lower.includes('rate') || lower.includes('price')) defaultMapping[h] = 'rate';
          else if (lower.includes('amount') || lower.includes('total')) defaultMapping[h] = 'amount';
          else if (lower.includes('tax') || lower.includes('gst')) defaultMapping[h] = 'taxRate';
          else if (lower.includes('batch')) defaultMapping[h] = 'batchNo';
          else if (lower.includes('exp') || lower.includes('expiry')) defaultMapping[h] = 'expDate';
        });
        setMapping(defaultMapping);

        const rows: ParsedInvoiceItem[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          
          headers.forEach((h, idx) => {
            const mappedField = defaultMapping[h];
            if (mappedField) {
              const val = values[idx] || '';
              if (mappedField === 'qty') row[mappedField] = parseFloat(val) || 0;
              else if (mappedField === 'rate' || mappedField === 'amount' || mappedField === 'taxRate') row[mappedField] = parseFloat(val) || 0;
              else row[mappedField] = val;
            }
          });
          
          if (row.itemName || row.itemCode) {
            row.amount = row.amount || (row.qty * row.rate);
            rows.push(row as ParsedInvoiceItem);
          }
        }

        setCsvData(rows);
        setImportStep(2);
      } catch (err) {
        setFileError('Failed to parse CSV file. Please check the format.');
      }
    };

    reader.readAsText(file);
  };

  const parseInvoiceText = (text: string): ParsedInvoiceItem[] => {
    const items: ParsedInvoiceItem[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    const numberPattern = /[\d,]+\.?\d*/g;
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('invoice') || lowerLine.includes('total') || lowerLine.includes('subtotal') ||
          lowerLine.includes('tax') || lowerLine.includes('gst') || lowerLine.includes('bill') ||
          lowerLine.includes('company') || lowerLine.includes('address') || lowerLine.includes('phone') ||
          lowerLine.includes('email') || lowerLine.includes('date') || lowerLine.includes('#')) {
        continue;
      }
      
      const numbers = line.match(numberPattern);
      if (!numbers || numbers.length < 2) continue;
      
      const cleanNumber = (n: string) => parseFloat(n.replace(/,/g, '')) || 0;
      
      const itemName = line.replace(numberPattern, '').replace(/[₹$,]/g, '').trim() || '';
      
      if (itemName.length < 2) continue;
      
      const qty = numbers.length > 1 ? cleanNumber(numbers[numbers.length - 2]) : 1;
      const rate = numbers.length > 0 ? cleanNumber(numbers[numbers.length - 1]) : 0;
      
      if (qty > 0 && rate > 0) {
        items.push({
          itemName: itemName.substring(0, 50),
          itemCode: '',
          hsn: '',
          qty,
          rate,
          amount: qty * rate,
          taxRate: 0,
          batchNo: '',
          expDate: '',
        });
      }
    }
    
    return items;
  };

  const extractInvoiceDetails = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    let invoiceNumber = '';
    let date = new Date().toISOString().slice(0, 10);
    let customerName = '';
    let total = 0;
    
    const invoicePatterns = [/invoice\s*#?\s*:?\s*([A-Z0-9-]+)/i, /inv\s*#?\s*:?\s*([A-Z0-9-]+)/i, /bill\s*#?\s*:?\s*([A-Z0-9-]+)/i];
    for (const pattern of invoicePatterns) {
      const match = text.match(pattern);
      if (match) {
        invoiceNumber = match[1];
        break;
      }
    }
    
    const datePatterns = [/date\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i, /dated?\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i];
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          const parsed = new Date(match[1]);
          if (!isNaN(parsed.getTime())) {
            date = parsed.toISOString().slice(0, 10);
          }
        } catch {}
        break;
      }
    }
    
    const totalPatterns = [/total\s*:?\s*₹?\s*([\d,]+\.?\d*)/i, /grand\s*total\s*:?\s*₹?\s*([\d,]+\.?\d*)/i, /amount\s*due\s*:?\s*₹?\s*([\d,]+\.?\d*)/i, /₹\s*([\d,]+\.?\d*)/];
    for (const pattern of totalPatterns) {
      const match = text.match(pattern);
      if (match) {
        total = parseFloat(match[1].replace(/,/g, '')) || 0;
        break;
      }
    }
    
    const linesWithoutNumbers = lines.filter(l => {
      const hasOnlyNumbers = /^[\d,\.\s₹]+$/.test(l);
      const isHeader = /invoice|total|tax|gst|subtotal|grand|balance|due/i.test(l);
      return !hasOnlyNumbers && !isHeader;
    });
    
    if (linesWithoutNumbers.length > 0) {
      customerName = linesWithoutNumbers[0];
    }
    
    return { invoiceNumber, date, customer: customerName, total };
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');
    setPdfParsing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      const items = parseInvoiceText(fullText);
      const details = extractInvoiceDetails(fullText);

      if (items.length === 0) {
        setFileError('Could not extract line items from PDF. Try manual entry or CSV import.');
        setPdfParsing(false);
        return;
      }

      setPdfData({ ...details, items });
      setImportStep(2);
    } catch (err) {
      console.error('PDF parsing error:', err);
      setFileError('Failed to parse PDF. Please try CSV or manual entry.');
    } finally {
      setPdfParsing(false);
    }
  };

  const handlePdfImport = () => {
    if (!pdfData) return;

    const matchedItems: OrderItem[] = pdfData.items.map((item, idx) => {
      const productId = findMatchingProduct(item);
      const product = products.find(p => p.id === productId);
      
      return {
        id: `item-${idx}`,
        item: item.itemName || '',
        productId,
        description: '',
        count: idx + 1,
        batchNo: item.batchNo || '',
        expDate: item.expDate || '',
        mrp: product?.mrp || item.rate,
        qty: item.qty,
        freeQty: 0,
        unit: 'PCS',
        priceUnit: item.rate || product?.salePrice || 0,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: item.taxRate || product?.taxes ? parseInt(product?.taxes) || 0 : 0,
        taxAmount: 0,
        addCess: 0,
        amount: item.amount || (item.qty * item.rate),
      };
    });

    const total = matchedItems.reduce((sum, item) => sum + item.amount, 0);

    const customer = data.customers.find(c => 
      c.name.toLowerCase().includes(pdfData.customer.toLowerCase()) ||
      pdfData.customer.toLowerCase().includes(c.name.toLowerCase())
    );

    onImport({
      invoiceNumber: pdfData.invoiceNumber || `IMP-${Date.now()}`,
      invoiceDate: pdfData.date,
      date: pdfData.date,
      customer: customer?.name || pdfData.customer || '',
      customerId: customer?.id || '',
      billingName: customer?.name || pdfData.customer || '',
      billingAddress: customer?.billingAddress || customer?.location || '',
      shippingAddress: customer?.shippingAddress || customer?.location || '',
      items: matchedItems,
      total: pdfData.total || total,
      status: 'Confirmed',
    });
    
    resetForm();
  };

  const handleAddManualItem = () => {
    if (!newItem.itemName && !newItem.itemCode) return;
    const item = { ...newItem, amount: newItem.amount || (newItem.qty * newItem.rate) };
    setManualData(prev => ({ ...prev, items: [...prev.items, item] }));
    setNewItem({
      itemName: '',
      itemCode: '',
      hsn: '',
      qty: 1,
      rate: 0,
      amount: 0,
      taxRate: 0,
      batchNo: '',
      expDate: '',
    });
  };

  const handleRemoveManualItem = (index: number) => {
    setManualData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const findMatchingProduct = (item: ParsedInvoiceItem): string => {
    if (!products.length) return '';
    
    const matchByCode = products.find(p => p.itemCode === item.itemCode);
    if (matchByCode) return matchByCode.id;
    
    const matchByName = products.find(p => 
      p.itemName?.toLowerCase() === item.itemName?.toLowerCase()
    );
    if (matchByName) return matchByName.id;
    
    const partialMatch = products.find(p => 
      p.itemName?.toLowerCase().includes(item.itemName?.toLowerCase()) ||
      item.itemName?.toLowerCase().includes(p.itemName?.toLowerCase())
    );
    return partialMatch?.id || '';
  };

  const handleFileImport = () => {
    const matchedItems: OrderItem[] = csvData.map((item, idx) => {
      const productId = findMatchingProduct(item);
      const product = products.find(p => p.id === productId);
      
      return {
        id: `item-${idx}`,
        item: item.itemName || '',
        productId,
        description: '',
        count: idx + 1,
        batchNo: item.batchNo || '',
        expDate: item.expDate || '',
        mrp: product?.mrp || item.rate,
        qty: item.qty,
        freeQty: 0,
        unit: 'PCS',
        priceUnit: item.rate || product?.salePrice || 0,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: item.taxRate || product?.taxes ? parseInt(product?.taxes) || 0 : 0,
        taxAmount: 0,
        addCess: 0,
        amount: item.amount || (item.qty * item.rate),
      };
    });

    const total = matchedItems.reduce((sum, item) => sum + item.amount, 0);

    onImport({
      invoiceNumber: `IMP-${Date.now()}`,
      invoiceDate: new Date().toISOString().slice(0, 10),
      date: new Date().toISOString().slice(0, 10),
      items: matchedItems,
      total,
      status: 'Confirmed',
    });
    
    resetForm();
  };

  const handleManualImport = () => {
    const matchedItems: OrderItem[] = manualData.items.map((item, idx) => {
      const productId = findMatchingProduct(item);
      const product = products.find(p => p.id === productId);
      
      return {
        id: `item-${idx}`,
        item: item.itemName || '',
        productId,
        description: '',
        count: idx + 1,
        batchNo: item.batchNo || '',
        expDate: item.expDate || '',
        mrp: product?.mrp || item.rate,
        qty: item.qty,
        freeQty: 0,
        unit: 'PCS',
        priceUnit: item.rate || product?.salePrice || 0,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: item.taxRate || product?.taxes ? parseInt(product?.taxes) || 0 : 0,
        taxAmount: 0,
        addCess: 0,
        amount: item.amount || (item.qty * item.rate),
      };
    });

    const total = matchedItems.reduce((sum, item) => sum + item.amount, 0);

    const customer = data.customers.find(c => c.id === manualData.customerId);

    onImport({
      invoiceNumber: manualData.invoiceNumber || `ORD-${Date.now()}`,
      invoiceDate: manualData.invoiceDate,
      date: manualData.invoiceDate,
      customer: customer?.name || manualData.customerName || '',
      customerId: manualData.customerId,
      billingName: customer?.name || manualData.customerName || '',
      billingAddress: customer?.billingAddress || customer?.location || '',
      shippingAddress: customer?.shippingAddress || customer?.location || '',
      items: matchedItems,
      total,
      status: 'Confirmed',
    });
    
    resetForm();
  };

  const resetForm = () => {
    setImportStep(1);
    setCsvData([]);
    setParsedHeaders([]);
    setMapping({});
    setManualData({
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().slice(0, 10),
      customerName: '',
      customer: '',
      customerId: '',
      items: [],
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Import Invoice Data</h2>
          <button onClick={resetForm} className="p-1 hover:bg-muted rounded"><X className="size-5" /></button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => { setImportMode('file'); setImportStep(1); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${importMode === 'file' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-muted-foreground'}`}
          >
            <FileSpreadsheet className="size-4" /> CSV Import
          </button>
          <button
            onClick={() => { setImportMode('pdf'); setImportStep(1); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${importMode === 'pdf' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-muted-foreground'}`}
          >
            <FileText className="size-4" /> PDF Invoice
          </button>
          <button
            onClick={() => { setImportMode('manual'); setImportStep(1); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${importMode === 'manual' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-muted-foreground'}`}
          >
            <Pencil className="size-4" /> Manual Entry
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {importMode === 'file' ? (
            <>
              {importStep === 1 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium">Click to upload CSV file</p>
                      <p className="text-xs text-muted-foreground mt-1">Supports CSV format with invoice line items</p>
                    </label>
                  </div>
                  
                  {fileError && (
                    <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">
                      <AlertCircle className="size-4" /> {fileError}
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4 text-sm">
                    <p className="font-medium mb-2">Expected CSV format:</p>
                    <p className="text-muted-foreground font-mono text-xs">Item Name, Item Code, HSN, Qty, Rate, Amount, Tax Rate, Batch No, Expiry Date</p>
                  </div>
                </div>
              )}

              {importStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-green-500" />
                    Found {csvData.length} items from CSV
                  </div>

                  {parsedHeaders.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm font-medium mb-3">Field Mapping (Auto-detected)</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {parsedHeaders.map((header, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-24 truncate">{header}</span>
                            <span className="text-xs">→</span>
                            <select
                              value={mapping[header] || ''}
                              onChange={(e) => setMapping(prev => ({ ...prev, [header]: e.target.value }))}
                              className="text-xs border rounded px-2 py-1 flex-1"
                            >
                              {headerOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left">Item</th>
                          <th className="px-3 py-2 text-left">Qty</th>
                          <th className="px-3 py-2 text-left">Rate</th>
                          <th className="px-3 py-2 text-left">Amount</th>
                          <th className="px-3 py-2 text-left">Match</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 5).map((item, idx) => {
                          const matched = findMatchingProduct(item);
                          return (
                            <tr key={idx} className="border-t">
                              <td className="px-3 py-2">{item.itemName || item.itemCode}</td>
                              <td className="px-3 py-2">{item.qty}</td>
                              <td className="px-3 py-2">₹{item.rate}</td>
                              <td className="px-3 py-2">₹{item.amount.toFixed(2)}</td>
                              <td className="px-3 py-2">
                                {matched ? (
                                  <span className="inline-flex items-center gap-1 text-green-600 text-xs"><Check className="size-3" /> Found</span>
                                ) : (
                                  <span className="text-amber-600 text-xs">New Item</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {csvData.length > 5 && (
                      <div className="text-xs text-muted-foreground p-2 bg-muted/30">...and {csvData.length - 5} more items</div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : importMode === 'pdf' ? (
            <>
              {importStep === 1 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      {pdfParsing ? (
                        <div className="mx-auto h-12 w-12 mb-3 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                      ) : (
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      )}
                      <p className="text-sm font-medium">{pdfParsing ? 'Parsing PDF...' : 'Click to upload PDF Invoice'}</p>
                      <p className="text-xs text-muted-foreground mt-1">Extracts invoice number, date, customer & line items</p>
                    </label>
                  </div>
                  
                  {fileError && (
                    <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">
                      <AlertCircle className="size-4" /> {fileError}
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-lg p-4 text-sm border border-amber-200">
                    <p className="font-medium mb-2 text-amber-800">PDF Import Tips:</p>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Works best with text-based PDFs (not scanned images)</li>
                      <li>• Automatically detects invoice number, date, and total</li>
                      <li>• Extracts line items with quantities and rates</li>
                      <li>• Matches products by name from your inventory</li>
                    </ul>
                  </div>
                </div>
              )}

              {importStep === 2 && pdfData && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    <Check className="size-4" /> Successfully extracted {pdfData.items.length} items from PDF
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div><p className="text-xs text-muted-foreground">Invoice #</p><p className="font-medium">{pdfData.invoiceNumber || 'Not found'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{pdfData.date}</p></div>
                    <div><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium">{pdfData.customer || 'Not found'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Total</p><p className="font-medium">₹{pdfData.total.toLocaleString()}</p></div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left">Item</th>
                          <th className="px-3 py-2 text-right">Qty</th>
                          <th className="px-3 py-2 text-right">Rate</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-left">Match</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pdfData.items.slice(0, 8).map((item, idx) => {
                          const matched = findMatchingProduct(item);
                          return (
                            <tr key={idx} className="border-t">
                              <td className="px-3 py-2">{item.itemName}</td>
                              <td className="px-3 py-2 text-right">{item.qty}</td>
                              <td className="px-3 py-2 text-right">₹{item.rate}</td>
                              <td className="px-3 py-2 text-right">₹{item.amount.toFixed(2)}</td>
                              <td className="px-3 py-2">
                                {matched ? (
                                  <span className="inline-flex items-center gap-1 text-green-600 text-xs"><Check className="size-3" /> Found</span>
                                ) : (
                                  <span className="text-amber-600 text-xs">New Item</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {pdfData.items.length > 8 && (
                      <div className="text-xs text-muted-foreground p-2 bg-muted/30">...and {pdfData.items.length - 8} more items</div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {importStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Invoice Number">
                      <Input
                        value={manualData.invoiceNumber}
                        onChange={e => setManualData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                        placeholder="Auto-generated if empty"
                      />
                    </FormField>
                    <FormField label="Invoice Date">
                      <Input
                        type="date"
                        value={manualData.invoiceDate}
                        onChange={e => setManualData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                      />
                    </FormField>
                    <FormField label="Customer Name">
                      <Input
                        value={manualData.customerName}
                        onChange={e => setManualData(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Or select from existing"
                      />
                    </FormField>
                    <FormField label="Select Existing Customer">
                      <Select
                        value={manualData.customerId}
                        onChange={e => setManualData(prev => ({ ...prev, customerId: e.target.value }))}
                      >
                        <option value="">Select Customer</option>
                        {data.customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Select>
                    </FormField>
                  </div>

                  <div className="border rounded-lg">
                    <div className="bg-muted/50 px-4 py-2 font-medium text-sm">Add Line Items</div>
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Input
                          placeholder="Item Name *"
                          value={newItem.itemName}
                          onChange={e => setNewItem(prev => ({ ...prev, itemName: e.target.value }))}
                        />
                        <Input
                          placeholder="Item Code"
                          value={newItem.itemCode}
                          onChange={e => setNewItem(prev => ({ ...prev, itemCode: e.target.value }))}
                        />
                        <Input
                          placeholder="HSN Code"
                          value={newItem.hsn}
                          onChange={e => setNewItem(prev => ({ ...prev, hsn: e.target.value }))}
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={newItem.qty || ''}
                          onChange={e => setNewItem(prev => ({ ...prev, qty: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={newItem.rate || ''}
                          onChange={e => setNewItem(prev => ({ ...prev, rate: Number(e.target.value), amount: prev.qty * Number(e.target.value) }))}
                        />
                        <Input
                          type="number"
                          placeholder="Tax %"
                          value={newItem.taxRate || ''}
                          onChange={e => setNewItem(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                        />
                        <Input
                          placeholder="Batch No"
                          value={newItem.batchNo}
                          onChange={e => setNewItem(prev => ({ ...prev, batchNo: e.target.value }))}
                        />
                        <Input
                          type="date"
                          placeholder="Expiry Date"
                          value={newItem.expDate}
                          onChange={e => setNewItem(prev => ({ ...prev, expDate: e.target.value }))}
                        />
                        <button
                          onClick={handleAddManualItem}
                          disabled={!newItem.itemName}
                          className="h-9 px-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 text-sm"
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                  </div>

                  {manualData.items.length > 0 && (
                    <div className="border rounded-lg">
                      <div className="bg-muted/50 px-4 py-2 font-medium text-sm flex justify-between items-center">
                        <span>Added Items ({manualData.items.length})</span>
                        <span className="text-xs font-normal">Total: ₹{manualData.items.reduce((sum, i) => sum + (i.amount || i.qty * i.rate), 0).toFixed(2)}</span>
                      </div>
                      <table className="w-full text-xs">
                        <thead className="border-b">
                          <tr>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-left">Code</th>
                            <th className="px-4 py-2 text-right">Qty</th>
                            <th className="px-4 py-2 text-right">Rate</th>
                            <th className="px-4 py-2 text-right">Amount</th>
                            <th className="px-4 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {manualData.items.map((item, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="px-4 py-2">{item.itemName}</td>
                              <td className="px-4 py-2 text-muted-foreground">{item.itemCode}</td>
                              <td className="px-4 py-2 text-right">{item.qty}</td>
                              <td className="px-4 py-2 text-right">₹{item.rate}</td>
                              <td className="px-4 py-2 text-right">₹{(item.amount || item.qty * item.rate).toFixed(2)}</td>
                              <td className="px-4 py-2">
                                <button onClick={() => handleRemoveManualItem(idx)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                                  <X className="size-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <button onClick={resetForm} className="text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <div className="flex gap-2">
            {(importMode === 'file' || importMode === 'pdf') && importStep === 2 && (
              <button onClick={() => setImportStep(1)} className="h-9 px-4 text-sm border rounded-md hover:bg-muted">
                Back
              </button>
            )}
            {(importMode === 'file' ? importStep === 2 && csvData.length : importMode === 'pdf' ? importStep === 2 && pdfData : manualData.items.length > 0) && (
              <button
                onClick={importMode === 'file' ? handleFileImport : importMode === 'pdf' ? handlePdfImport : handleManualImport}
                className="h-9 px-4 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 flex items-center gap-2"
              >
                <Upload className="size-4" /> Import {importMode === 'file' ? csvData.length : importMode === 'pdf' ? pdfData?.items.length : manualData.items.length} Items
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrderItem {
  id: string;
  item: string;
  productId: string;
  description: string;
  count: number;
  batchNo: string;
  expDate: string;
  mrp: number;
  qty: number;
  freeQty: number;
  unit: string;
  priceUnit: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  addCess: number;
  amount: number;
}

interface Order {
  id: string;
  type: string;
  partyType: string;
  customer: string;
  customerId: string;
  payment: string;
  godown: string;
  billingName: string;
  billingAddress: string;
  shippingAddress: string;
  poNo: string;
  poDate: string;
  ewayBillNo: string;
  invoiceNumber: string;
  invoiceDate: string;
  time: string;
  stateOfSupply: string;
  items: OrderItem[];
  deliveryLocation: string;
  description: string;
  image: string;
  document: string;
  copies: string;
  discount: number;
  shipping: number;
  packaging: number;
  adjustment: number;
  roundOff: number;
  total: number;
  date: string;
  status: string;
}

const createEmptyItem = (index: number): OrderItem => ({
  id: `item-${index}`,
  item: '',
  productId: '',
  description: '',
  count: index + 1,
  batchNo: '',
  expDate: '',
  mrp: 0,
  qty: 0,
  freeQty: 0,
  unit: 'PCS',
  priceUnit: 0,
  discountPercent: 0,
  discountAmount: 0,
  taxPercent: 0,
  taxAmount: 0,
  addCess: 0,
  amount: 0,
});

const empty: Order = {
  id: '',
  type: 'Secondary',
  partyType: '',
  customer: '',
  customerId: '',
  salesPerson: '',
  salesPersonId: '',
  payment: 'Credit',
  godown: '',
  billingName: '',
  billingAddress: '',
  shippingAddress: '',
  poNo: '',
  poDate: '',
  ewayBillNo: '',
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().slice(0, 10),
  time: new Date().toTimeString().slice(0, 5),
  stateOfSupply: '',
  items: [createEmptyItem(0)],
  deliveryLocation: '',
  description: '',
  image: '',
  document: '',
  copies: 'Original, Duplicate',
  discount: 0,
  shipping: 0,
  packaging: 0,
  adjustment: 0,
  roundOff: 0,
  total: 0,
  date: new Date().toISOString().slice(0, 10),
  status: 'Confirmed',
};

function OrderForm({ value, onChange, onSave, label, products, customers, team }: { 
  value: Order; 
  onChange: (v: Order) => void; 
  onSave: () => void; 
  label: string;
  products: any[];
  customers: any[];
  team: any[];
}) {
  const [imagePreview, setImagePreview] = useState<string>(value.image || '');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        onChange({ ...value, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfLoading(true);
    setPdfError('');

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

      const items = parsePdfText(fullText);
      const details = extractPdfDetails(fullText);

      if (items.length === 0) {
        setPdfError('Could not extract items from PDF. Please add manually.');
        setPdfLoading(false);
        return;
      }

      const matchedItems: OrderItem[] = items.map((item: ParsedInvoiceItem, idx: number) => {
        const productId = findProductMatch(item, products);
        const product = products.find((p: any) => p.id === productId);
        return {
          id: `item-${idx}`,
          item: item.itemName || '',
          productId,
          description: '',
          count: idx + 1,
          batchNo: item.batchNo || '',
          expDate: item.expDate || '',
          mrp: product?.mrp || item.rate,
          qty: item.qty,
          freeQty: 0,
          unit: 'PCS',
          priceUnit: item.rate || product?.salePrice || 0,
          discountPercent: 0,
          discountAmount: 0,
          taxPercent: item.taxRate || (product?.taxes ? parseInt(product.taxes) || 0 : 0),
          taxAmount: 0,
          addCess: 0,
          amount: item.amount || (item.qty * item.rate),
        };
      });

      const customer = customers.find(c => 
        c.name.toLowerCase().includes(details.customer?.toLowerCase() || '') ||
        details.customer?.toLowerCase().includes(c.name.toLowerCase())
      );

      const subtotal = matchedItems.reduce((sum, item) => sum + (item.qty * item.priceUnit), 0);
      const totalTax = matchedItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const total = Math.round(subtotal + totalTax);

      onChange({
        ...value,
        invoiceNumber: details.invoiceNumber || value.invoiceNumber,
        invoiceDate: details.date || value.invoiceDate,
        date: details.date || value.date,
        customer: customer?.name || details.customer || value.customer,
        customerId: customer?.id || value.customerId,
        billingName: customer?.name || details.customer || value.billingName,
        billingAddress: customer?.billingAddress || customer?.location || value.billingAddress,
        shippingAddress: customer?.shippingAddress || customer?.location || value.shippingAddress,
        items: matchedItems,
        total,
      });

    } catch (err) {
      console.error('PDF parsing error:', err);
      setPdfError('Failed to parse PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      onChange({
        ...value,
        customerId,
        customer: customer.name,
        billingName: customer.name,
        billingAddress: customer.billingAddress || customer.location,
        shippingAddress: customer.shippingAddress || customer.location,
        stateOfSupply: customer.state || '',
      });
    }
  };

  const handleSalesPersonChange = (salesPersonId: string) => {
    const member = team.find(t => t.id === salesPersonId);
    onChange({
      ...value,
      salesPersonId,
      salesPerson: member?.name || '',
    });
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newItems = [...value.items];
      newItems[index] = {
        ...newItems[index],
        item: product.itemName,
        productId,
        description: product.description,
        mrp: product.mrp,
        priceUnit: product.salePrice,
        taxPercent: parseInt(product.taxes) || 0,
      };
      onChange({ ...value, items: newItems });
    }
  };

  const addItem = () => {
    onChange({ ...value, items: [...value.items, createEmptyItem(value.items.length)] });
  };

  const removeItem = (index: number) => {
    if (value.items.length > 1) {
      const newItems = value.items.filter((_, i) => i !== index);
      onChange({ ...value, items: newItems });
    }
  };

  const updateItem = (index: number, field: keyof OrderItem, val: string | number) => {
    const newItems = [...value.items];
    const item = { ...newItems[index], [field]: val };
    
    item.amount = item.qty * item.priceUnit;
    item.discountAmount = (item.amount * item.discountPercent) / 100;
    item.taxAmount = ((item.amount - item.discountAmount) * item.taxPercent) / 100;
    item.amount = item.amount - item.discountAmount + item.taxAmount + item.addCess;
    
    newItems[index] = item;
    onChange({ ...value, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = value.items.reduce((sum, item) => sum + (item.qty * item.priceUnit), 0);
    const totalDiscount = value.items.reduce((sum, item) => sum + item.discountAmount, 0);
    const totalTax = value.items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalCess = value.items.reduce((sum, item) => sum + item.addCess, 0);
    const total = subtotal - totalDiscount + totalTax + totalCess + value.shipping + value.packaging + value.adjustment;
    return Math.round(total);
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField label="Order Type">
          <Select value={value.type} onChange={e => onChange({ ...value, type: e.target.value })}>
            <option>Secondary</option>
            <option>Primary</option>
          </Select>
        </FormField>
        
        {value.type === 'Primary' && (
          <FormField label="Party Type">
            <Select value={value.partyType} onChange={e => onChange({ ...value, partyType: e.target.value })}>
              <option value="">Select</option>
              <option>Super Stockist</option>
              <option>Distributor</option>
            </Select>
          </FormField>
        )}
        
        <FormField label="Customer / Party" required>
          <Select value={value.customerId} onChange={e => handleCustomerChange(e.target.value)}>
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} - {c.location}</option>
            ))}
          </Select>
        </FormField>
        
        <FormField label="Sales Person">
          <Select value={value.salesPersonId} onChange={e => handleSalesPersonChange(e.target.value)}>
            <option value="">Select Sales Person</option>
            {team.map(t => (
              <option key={t.id} value={t.id}>{t.name} - {t.role}</option>
            ))}
          </Select>
        </FormField>
        
        <FormField label="Payment">
          <Select value={value.payment} onChange={e => onChange({ ...value, payment: e.target.value })}>
            <option>Credit</option>
            <option>Cash</option>
          </Select>
        </FormField>
        
        <FormField label="Godown">
          <Select value={value.godown} onChange={e => onChange({ ...value, godown: e.target.value })}>
            <option value="">Select Godown</option>
            <option>Mumbai Central</option>
            <option>Delhi Hub</option>
            <option>Bangalore WH</option>
            <option>Chennai Depot</option>
          </Select>
        </FormField>
        
        <FormField label="Billing Name">
          <Input value={value.billingName} onChange={e => onChange({ ...value, billingName: e.target.value })} placeholder="Optional" />
        </FormField>
        
        <FormField label="Billing Address">
          <Textarea value={value.billingAddress} onChange={e => onChange({ ...value, billingAddress: e.target.value })} rows={2} />
        </FormField>
        
        <FormField label="Shipping Address">
          <Textarea value={value.shippingAddress} onChange={e => onChange({ ...value, shippingAddress: e.target.value })} rows={2} />
        </FormField>
        
        <FormField label="PO No.">
          <Input value={value.poNo} onChange={e => onChange({ ...value, poNo: e.target.value })} />
        </FormField>
        
        <FormField label="PO Date">
          <Input type="date" value={value.poDate} onChange={e => onChange({ ...value, poDate: e.target.value })} />
        </FormField>
        
        <FormField label="E-Way Bill No.">
          <Input value={value.ewayBillNo} onChange={e => onChange({ ...value, ewayBillNo: e.target.value })} />
        </FormField>
        
        <FormField label="Invoice Number">
          <Input value={value.invoiceNumber} onChange={e => onChange({ ...value, invoiceNumber: e.target.value })} />
        </FormField>
        
        <FormField label="Invoice Date">
          <Input type="date" value={value.invoiceDate} onChange={e => onChange({ ...value, invoiceDate: e.target.value })} />
        </FormField>
        
        <FormField label="Time">
          <Input type="time" value={value.time} onChange={e => onChange({ ...value, time: e.target.value })} />
        </FormField>
        
        <FormField label="State of Supply">
          <Input value={value.stateOfSupply} onChange={e => onChange({ ...value, stateOfSupply: e.target.value })} placeholder="Select state" />
        </FormField>
        
        <FormField label="Date">
          <Input type="date" value={value.date} onChange={e => onChange({ ...value, date: e.target.value })} />
        </FormField>
        
        <FormField label="Status">
          <Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}>
            <option>Confirmed</option>
            <option>Processing</option>
            <option>Dispatched</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </Select>
        </FormField>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b font-medium text-sm flex justify-between items-center">
          <span>Order Items</span>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".pdf"
              ref={pdfInputRef}
              onChange={handlePdfChange}
              className="hidden"
              id="order-pdf-upload"
            />
            <label htmlFor="order-pdf-upload" className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">
              {pdfLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <FileText className="size-3" />
              )}
              {pdfLoading ? 'Parsing...' : 'Attach PDF Invoice'}
            </label>
            {pdfError && <span className="text-xs text-red-500 ml-2">{pdfError}</span>}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left w-8">#</th>
                <th className="px-2 py-2 text-left min-w-[150px]">PRODUCT</th>
                <th className="px-2 py-2 text-left w-16">BATCH NO.</th>
                <th className="px-2 py-2 text-left w-20">EXP. DATE</th>
                <th className="px-2 py-2 text-left w-16">MRP</th>
                <th className="px-2 py-2 text-left w-14">QTY</th>
                <th className="px-2 py-2 text-left w-16">UNIT</th>
                <th className="px-2 py-2 text-left w-20">PRICE</th>
                <th className="px-2 py-2 text-left w-12">DISC %</th>
                <th className="px-2 py-2 text-left w-14">TAX %</th>
                <th className="px-2 py-2 text-left w-16">AMOUNT</th>
                <th className="px-2 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {value.items.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="px-2 py-1">{index + 1}</td>
                  <td className="px-1 py-1">
                    <select
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.productId}
                      onChange={e => handleProductSelect(index, e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.itemName} - ₹{p.salePrice}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-1 py-1">
                    <input
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.batchNo}
                      onChange={e => updateItem(index, 'batchNo', e.target.value)}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="date"
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.expDate}
                      onChange={e => updateItem(index, 'expDate', e.target.value)}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.mrp || ''}
                      onChange={e => updateItem(index, 'mrp', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.qty || ''}
                      onChange={e => updateItem(index, 'qty', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <select
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.unit}
                      onChange={e => updateItem(index, 'unit', e.target.value)}
                    >
                      <option>PCS</option>
                      <option>KG</option>
                      <option>LTR</option>
                      <option>BOX</option>
                      <option>SET</option>
                    </select>
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.priceUnit || ''}
                      onChange={e => updateItem(index, 'priceUnit', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.discountPercent || ''}
                      onChange={e => updateItem(index, 'discountPercent', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <select
                      className="w-full px-2 py-1 border rounded text-xs"
                      value={item.taxPercent}
                      onChange={e => updateItem(index, 'taxPercent', Number(e.target.value))}
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </td>
                  <td className="px-2 py-1 text-right font-medium">₹{item.amount.toFixed(2)}</td>
                  <td className="px-1 py-1">
                    <button
                      onClick={() => removeItem(index)}
                      disabled={value.items.length === 1}
                      className="p-1 text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                    >
                      <X className="size-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td colSpan={10} className="px-2 py-2 text-right">TOTAL</td>
                <td className="px-2 py-2 text-right">₹{calculateTotal().toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="p-2 border-t">
          <button onClick={addItem} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
            <Plus className="size-3" /> ADD ROW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <FormField label="Delivery Location">
            <Input value={value.deliveryLocation} onChange={e => onChange({ ...value, deliveryLocation: e.target.value })} />
          </FormField>
          <FormField label="Add Description">
            <Textarea value={value.description} onChange={e => onChange({ ...value, description: e.target.value })} rows={3} />
          </FormField>
        </div>
        
        <div className="space-y-3">
          <FormField label="Add Image">
            <div className="border-2 border-dashed rounded-lg p-3 text-center hover:bg-gray-50">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="max-h-24 rounded" />
                  <button onClick={() => { setImagePreview(''); onChange({ ...value, image: '' }); }} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5">
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Image className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Click to upload</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </FormField>
          <FormField label="No. of copies">
            <Select value={value.copies} onChange={e => onChange({ ...value, copies: e.target.value })}>
              <option>Original</option>
              <option>Duplicate</option>
              <option>Original, Duplicate</option>
              <option>Original, Duplicate, Triplicate</option>
            </Select>
          </FormField>
        </div>
        
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Discount (%)</span>
            <input
              type="number"
              className="w-20 px-2 py-1 border rounded text-right"
              value={value.discount || ''}
              onChange={e => onChange({ ...value, discount: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <input
              type="number"
              className="w-20 px-2 py-1 border rounded text-right"
              value={value.shipping || ''}
              onChange={e => onChange({ ...value, shipping: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>Packaging</span>
            <input
              type="number"
              className="w-20 px-2 py-1 border rounded text-right"
              value={value.packaging || ''}
              onChange={e => onChange({ ...value, packaging: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span>Adjustment</span>
            <input
              type="number"
              className="w-20 px-2 py-1 border rounded text-right"
              value={value.adjustment || ''}
              onChange={e => onChange({ ...value, adjustment: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.customer} className="h-10 px-6 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          <Save className="size-4" /> {label}
        </button>
      </div>
    </div>
  );
}

export default function Orders() {
  const { data, addOrder, updateOrder, deleteOrder, initializeDefaults } = useSmartStore();
  const crud = useCrud<Order>([] as Order[], 'orders');
  const [form, setForm] = useState<Order>(empty);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    initializeDefaults();
  }, []);

  useEffect(() => {
    crud.setData(data.orders as Order[]);
  }, [data.orders]);

  const handleImportCSV = (orderData: Partial<Order>) => {
    addOrder({ 
      ...empty, 
      ...orderData, 
      id: crud.nextId('ORD-'),
      items: orderData.items || [createEmptyItem(0)]
    } as Order);
    setShowImport(false);
  };

  const handleAdd = () => {
    const total = calculateOrderTotal(form);
    addOrder({ ...form, total, id: crud.nextId('ORD-') });
    crud.setShowAdd(false);
    setForm(empty);
  };

  const handleUpdate = () => {
    const total = calculateOrderTotal(form);
    updateOrder({ ...form, total });
    crud.setShowEdit(false);
  };

  const handleDelete = (id: string) => {
    deleteOrder(id);
    crud.setShowDelete(false);
  };

  const calculateOrderTotal = (order: Order) => {
    const subtotal = order.items.reduce((sum, item) => sum + (item.qty * item.priceUnit), 0);
    const totalDiscount = order.items.reduce((sum, item) => sum + item.discountAmount, 0);
    const totalTax = order.items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalCess = order.items.reduce((sum, item) => sum + item.addCess, 0);
    return Math.round(subtotal - totalDiscount + totalTax + totalCess + order.shipping + order.packaging + order.adjustment);
  };

  const columns = [
    { key: 'id', label: 'Invoice No.' },
    { key: 'date', label: 'Date' },
    { key: 'customer', label: 'Customer' },
    { key: 'salesPerson', label: 'Sales Person' },
    { key: 'type', label: 'Type' },
    { key: 'payment', label: 'Payment' },
    { key: 'stateOfSupply', label: 'State' },
    { key: 'total', label: 'Total', render: (v: number) => `₹${v.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Order) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm({ ...row, items: row.items || [createEmptyItem(0)] }); crud.setShowEdit(true); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Orders" subtitle="All sales orders across channels">
        <button onClick={() => setShowImport(true)} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Upload className="size-4" />Import Invoice</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('ORD-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />New Order</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Orders</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Confirmed</p><p className="text-2xl font-bold mt-1">{crud.data.filter((d: Order) => d.status === 'Confirmed').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Processing</p><p className="text-2xl font-bold mt-1">{crud.data.filter((d: Order) => d.status === 'Processing').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Delivered</p><p className="text-2xl font-bold mt-1">{crud.data.filter((d: Order) => d.status === 'Delivered').length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data as unknown as Record<string, unknown>[]} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="New Order">
        <OrderForm value={form} onChange={setForm} onSave={handleAdd} label="Create Order" products={data.products} customers={data.customers} team={data.team} />
      </Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Order">
        <OrderForm value={form} onChange={setForm} onSave={handleUpdate} label="Save Changes" products={data.products} customers={data.customers} team={data.team} />
      </Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={() => handleDelete(crud.deleteId || '')} />
      <InvoiceImportModal open={showImport} onClose={() => setShowImport(false)} onImport={handleImportCSV} products={data.products} />
    </motion.div>
  );
}

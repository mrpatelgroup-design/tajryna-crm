import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2, Upload, X, FileSpreadsheet, Check, AlertCircle, Edit3 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select, Textarea } from '../components/FormField';
import { useSmartStore } from '../lib/smartStore';
import { useCrud } from '../lib/useCrud';

interface Prod {
  id: string;
  itemName: string;
  itemHSN: string;
  category: string;
  description: string;
  itemCode: string;
  servicePeriod: number;
  itemImage: string;
  mrp: number;
  salePrice: number;
  wholesalePrice: number;
  purchasePrice: number;
  taxes: string;
  stock: number;
  minStock: number;
  status: string;
}

const empty: Prod = {
  id: '',
  itemName: '',
  itemHSN: '',
  category: 'General',
  description: '',
  itemCode: '',
  servicePeriod: 0,
  itemImage: '',
  mrp: 0,
  salePrice: 0,
  wholesalePrice: 0,
  purchasePrice: 0,
  taxes: '',
  stock: 0,
  minStock: 0,
  status: 'In Stock'
};

function Form({ value, onChange, onSave, label }: { value: Prod; onChange: (v: Prod) => void; onSave: () => void; label: string }) {
  const [imagePreview, setImagePreview] = useState<string>(value.itemImage || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        onChange({ ...value, itemImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    onChange({ ...value, itemImage: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FormField label="Item Name" required>
        <Input value={value.itemName} onChange={e => onChange({ ...value, itemName: e.target.value })} placeholder="Enter item name" />
      </FormField>

      <FormField label="Item HSN">
        <Input value={value.itemHSN} onChange={e => onChange({ ...value, itemHSN: e.target.value })} placeholder="Enter HSN code" />
      </FormField>

      <FormField label="Category">
        <Select value={value.category} onChange={e => onChange({ ...value, category: e.target.value })}>
          <option>General</option>
          <option>Flour</option>
          <option>Oils</option>
          <option>Rice</option>
          <option>Sugar</option>
          <option>Beverages</option>
          <option>Pulses</option>
          <option>Dairy</option>
          <option>Spices</option>
          <option>Packaged Foods</option>
          <option>Household</option>
          <option>Personal Care</option>
        </Select>
      </FormField>

      <FormField label="Description">
        <Textarea value={value.description} onChange={e => onChange({ ...value, description: e.target.value })} placeholder="Enter item description" rows={3} />
      </FormField>

      <FormField label="Item Code">
        <Input value={value.itemCode} onChange={e => onChange({ ...value, itemCode: e.target.value })} placeholder="Enter item code" />
      </FormField>

      <FormField label="Service Period (No. of Days)">
        <Input type="number" value={value.servicePeriod || ''} onChange={e => onChange({ ...value, servicePeriod: Number(e.target.value) })} placeholder="Enter service period" />
      </FormField>

      <FormField label="Add Item Image">
        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
          {imagePreview ? (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Item preview" className="max-h-32 mx-auto rounded" />
              <button onClick={removeImage} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
      </FormField>

      <FormField label="MRP">
        <Input type="number" value={value.mrp || ''} onChange={e => onChange({ ...value, mrp: Number(e.target.value) })} placeholder="Enter MRP" />
      </FormField>

      <FormField label="Sale Price">
        <Input type="number" value={value.salePrice || ''} onChange={e => onChange({ ...value, salePrice: Number(e.target.value) })} placeholder="Enter sale price" />
      </FormField>

      <FormField label="Wholesale Price">
        <Input type="number" value={value.wholesalePrice || ''} onChange={e => onChange({ ...value, wholesalePrice: Number(e.target.value) })} placeholder="Enter wholesale price" />
      </FormField>

      <FormField label="Purchase Price">
        <Input type="number" value={value.purchasePrice || ''} onChange={e => onChange({ ...value, purchasePrice: Number(e.target.value) })} placeholder="Enter purchase price" />
      </FormField>

      <FormField label="Taxes">
        <Select value={value.taxes} onChange={e => onChange({ ...value, taxes: e.target.value })}>
          <option value="">Select Tax</option>
          <option value="0%">0% GST</option>
          <option value="5%">5% GST</option>
          <option value="12%">12% GST</option>
          <option value="18%">18% GST</option>
          <option value="28%">28% GST</option>
        </Select>
      </FormField>

      <FormField label="Stock">
        <Input type="number" value={value.stock || ''} onChange={e => onChange({ ...value, stock: Number(e.target.value) })} />
      </FormField>

      <FormField label="Min Stock">
        <Input type="number" value={value.minStock || ''} onChange={e => onChange({ ...value, minStock: Number(e.target.value) })} />
      </FormField>

      <FormField label="Status">
        <Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </Select>
      </FormField>

      <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-4">
        <button onClick={onSave} disabled={!value.itemName} className="h-10 px-6 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">
          {label}
        </button>
      </div>
    </div>
  );
}

function BulkImportModal({ open, onClose, onImport }: { open: boolean; onClose: () => void; onImport: (products: Prod[]) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Prod[]>([]);
  const [error, setError] = useState<string>('');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): Prod[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    const fieldMap: Record<string, string> = {};
    const possibleFields = ['itemname', 'item_name', 'name', 'product', 'productname'];
    const hsnFields = ['itemhsn', 'hsn', 'hsncode'];
    const categoryFields = ['category', 'cat'];
    const descFields = ['description', 'desc'];
    const codeFields = ['itemcode', 'item_code', 'code', 'sku'];
    const serviceFields = ['serviceperiod', 'service_period'];
    const mrpFields = ['mrp', 'maxretailprice'];
    const saleFields = ['saleprice', 'sellingprice', 'price'];
    const wholesaleFields = ['wholesaleprice', 'wsprice'];
    const purchaseFields = ['purchaseprice', 'costprice', 'cost'];
    const taxFields = ['taxes', 'tax', 'gst'];
    const stockFields = ['stock', 'quantity', 'qty'];
    const minStockFields = ['minstock', 'reorderlevel'];
    const statusFields = ['status', 'stockstatus'];

    possibleFields.forEach(f => { if (headers.includes(f)) fieldMap.itemName = f; });
    hsnFields.forEach(f => { if (headers.includes(f)) fieldMap.itemHSN = f; });
    categoryFields.forEach(f => { if (headers.includes(f)) fieldMap.category = f; });
    descFields.forEach(f => { if (headers.includes(f)) fieldMap.description = f; });
    codeFields.forEach(f => { if (headers.includes(f)) fieldMap.itemCode = f; });
    serviceFields.forEach(f => { if (headers.includes(f)) fieldMap.servicePeriod = f; });
    mrpFields.forEach(f => { if (headers.includes(f)) fieldMap.mrp = f; });
    saleFields.forEach(f => { if (headers.includes(f)) fieldMap.salePrice = f; });
    wholesaleFields.forEach(f => { if (headers.includes(f)) fieldMap.wholesalePrice = f; });
    purchaseFields.forEach(f => { if (headers.includes(f)) fieldMap.purchasePrice = f; });
    taxFields.forEach(f => { if (headers.includes(f)) fieldMap.taxes = f; });
    stockFields.forEach(f => { if (headers.includes(f)) fieldMap.stock = f; });
    minStockFields.forEach(f => { if (headers.includes(f)) fieldMap.minStock = f; });
    statusFields.forEach(f => { if (headers.includes(f)) fieldMap.status = f; });

    const products: Prod[] = [];
    let idCounter = Date.now();

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length < 1 || !values[0]) continue;

      const getValue = (field: string) => {
        const idx = headers.indexOf(field);
        return idx >= 0 ? values[idx] : '';
      };

      const getNum = (field: string) => {
        const val = getValue(field);
        return val ? Number(val) : 0;
      };

      const getTax = () => {
        const val = getValue(fieldMap.taxes).toLowerCase();
        if (val.includes('0') || val === 'nil') return '0%';
        if (val.includes('5')) return '5%';
        if (val.includes('12')) return '12%';
        if (val.includes('18')) return '18%';
        if (val.includes('28')) return '28%';
        return getValue(fieldMap.taxes) || '';
      };

      const getStatus = () => {
        const val = getValue(fieldMap.status).toLowerCase();
        if (val.includes('out') || val === '0' || getNum(fieldMap.stock) === 0) return 'Out of Stock';
        if (val.includes('low') || getNum(fieldMap.stock) < getNum(fieldMap.minStock)) return 'Low Stock';
        return 'In Stock';
      };

      products.push({
        id: `P-${idCounter++}`,
        itemName: getValue(fieldMap.itemName) || `Item ${i}`,
        itemHSN: getValue(fieldMap.itemHSN) || '',
        category: getValue(fieldMap.category) || 'General',
        description: getValue(fieldMap.description) || '',
        itemCode: getValue(fieldMap.itemCode) || `CODE${idCounter}`,
        servicePeriod: getNum(fieldMap.servicePeriod),
        itemImage: '',
        mrp: getNum(fieldMap.mrp),
        salePrice: getNum(fieldMap.salePrice),
        wholesalePrice: getNum(fieldMap.wholesalePrice),
        purchasePrice: getNum(fieldMap.purchasePrice),
        taxes: getTax(),
        stock: getNum(fieldMap.stock),
        minStock: getNum(fieldMap.minStock),
        status: getStatus()
      });
    }

    return products;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = parseCSV(text);
          if (parsed.length === 0) {
            setError('No valid products found in file. Please check CSV format.');
            setPreview([]);
          } else {
            setPreview(parsed);
          }
        } catch (err) {
          setError('Error parsing file. Please use CSV format.');
          setPreview([]);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = () => {
    if (preview.length === 0) return;
    setImporting(true);
    setTimeout(() => {
      onImport(preview);
      setImporting(false);
      handleClose();
    }, 500);
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setError('');
    onClose();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadSampleCSV = () => {
    const sample = 'Item Name,Item HSN,Category,Description,Item Code,Service Period (Days),MRP,Sale Price,Wholesale Price,Purchase Price,Taxes,Stock,Min Stock,Status\nPremium Wheat Flour 5kg,11010010,Flour,High quality wheat flour,WF-5KG-P,180,320,285,275,260,5%,1250,500,In Stock';
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Bulk Import Products">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Upload a CSV file with product data</p>
          <button onClick={downloadSampleCSV} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
            <FileSpreadsheet className="size-3" /> Download Sample
          </button>
        </div>

        <div 
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="hidden" 
          />
          {file ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Check className="size-5" />
              <span className="font-medium">{file.name}</span>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload CSV file</p>
            </>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-3 rounded-lg">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        {preview.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Preview ({preview.length} products)</p>
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Check className="size-3" /> Ready to import
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={handleClose} className="h-9 px-4 rounded-md text-sm border hover:bg-gray-50">Cancel</button>
          <button 
            onClick={handleImport} 
            disabled={preview.length === 0 || importing}
            className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {importing ? 'Importing...' : `Import ${preview.length} Products`}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function BulkEditModal({ 
  open, 
  onClose, 
  products, 
  selectedIds, 
  onSave 
}: { 
  open: boolean; 
  onClose: () => void; 
  products: Prod[]; 
  selectedIds: string[];
  onSave: (updates: Partial<Prod>) => void;
}) {
  const [updates, setUpdates] = useState({
    category: '',
    taxes: '',
    status: '',
    priceChange: 0,
  });

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));

  const handleSave = () => {
    const updateData: Partial<Prod> = {};
    
    if (updates.category) updateData.category = updates.category;
    if (updates.taxes) updateData.taxes = updates.taxes;
    if (updates.status) updateData.status = updates.status;
    if (updates.priceChange !== 0) {
      selectedProducts.forEach(p => {
        updateData.salePrice = Math.round(p.salePrice * (1 + updates.priceChange / 100));
        updateData.wholesalePrice = Math.round(p.wholesalePrice * (1 + updates.priceChange / 100));
        updateData.mrp = Math.round(p.mrp * (1 + updates.priceChange / 100));
      });
    }
    
    onSave(updateData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Bulk Edit ${selectedIds.length} Products`}>
      <div className="space-y-4">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <p className="text-sm text-indigo-700">
            <strong>{selectedIds.length}</strong> products selected for bulk edit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Update Category">
            <Select 
              value={updates.category} 
              onChange={e => setUpdates({ ...updates, category: e.target.value })}
            >
              <option value="">Keep Current</option>
              <option>General</option>
              <option>Flour</option>
              <option>Oils</option>
              <option>Rice</option>
              <option>Sugar</option>
              <option>Beverages</option>
              <option>Pulses</option>
              <option>Dairy</option>
              <option>Spices</option>
              <option>Packaged Foods</option>
              <option>Household</option>
              <option>Personal Care</option>
            </Select>
          </FormField>

          <FormField label="Update Tax">
            <Select 
              value={updates.taxes} 
              onChange={e => setUpdates({ ...updates, taxes: e.target.value })}
            >
              <option value="">Keep Current</option>
              <option value="0%">0% GST</option>
              <option value="5%">5% GST</option>
              <option value="12%">12% GST</option>
              <option value="18%">18% GST</option>
              <option value="28%">28% GST</option>
            </Select>
          </FormField>

          <FormField label="Update Status">
            <Select 
              value={updates.status} 
              onChange={e => setUpdates({ ...updates, status: e.target.value })}
            >
              <option value="">Keep Current</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </Select>
          </FormField>

          <FormField label="Price Change (%)">
            <Input 
              type="number" 
              value={updates.priceChange || ''} 
              onChange={e => setUpdates({ ...updates, priceChange: Number(e.target.value) })}
              placeholder="e.g. +10 or -5"
            />
            <p className="text-xs text-gray-500 mt-1">Use + for increase, - for decrease</p>
          </FormField>
        </div>

        <div className="border rounded-lg">
          <div className="bg-gray-50 px-4 py-2 border-b font-medium text-sm">Selected Products</div>
          <div className="max-h-40 overflow-auto">
            <table className="w-full text-xs">
              <tbody>
                {selectedProducts.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.itemName}</td>
                    <td className="px-4 py-2">₹{p.salePrice}</td>
                    <td className="px-4 py-2">{p.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="h-9 px-4 rounded-md text-sm border hover:bg-gray-50">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={!updates.category && !updates.taxes && !updates.status && updates.priceChange === 0}
            className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function Products() {
  const { data, addProduct, updateProduct, deleteProduct, initializeDefaults } = useSmartStore();
  const crud = useCrud<Prod>([] as Prod[], 'products');
  const [form, setForm] = useState<Prod>(empty);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    initializeDefaults();
  }, []);

  useEffect(() => {
    crud.setData(data.products as Prod[]);
  }, [data.products]);

  const handleBulkSave = (updates: Partial<Prod>) => {
    selectedIds.forEach(id => {
      const product = data.products.find(p => p.id === id);
      if (product) {
        const updated = { ...product, ...updates };
        updateProduct(updated);
      }
    });
    setSelectedIds([]);
    setShowBulkEdit(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    addProduct({ ...form, id: crud.nextId('P-') });
    crud.setShowAdd(false);
    setForm(empty);
  };

  const handleUpdate = () => {
    updateProduct(form);
    crud.setShowEdit(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    crud.setShowDelete(false);
  };

  const handleBulkImport = (products: Prod[]) => {
    products.forEach(p => addProduct(p));
  };

  const columns: any[] = [
    { 
      key: 'select', 
      label: '✓', 
      render: (_: string, row: Prod) => (
        <input 
          type="checkbox" 
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300"
          onClick={e => e.stopPropagation()}
        />
      )
    },
    { key: 'itemCode', label: 'Item Code' },
    { key: 'itemName', label: 'Item Name' },
    { key: 'itemImage', label: 'Image', render: (v: string) => v ? <img src={v} alt="Item" className="w-10 h-10 object-cover rounded" /> : <span className="text-gray-400">-</span> },
    { key: 'category', label: 'Category' },
    { key: 'mrp', label: 'MRP', render: (v: number) => `₹${v}` },
    { key: 'salePrice', label: 'Sale Price', render: (v: number) => `₹${v}` },
    { key: 'wholesalePrice', label: 'Wholesale', render: (v: number) => `₹${v}` },
    { key: 'purchasePrice', label: 'Purchase', render: (v: number) => `₹${v}` },
    { key: 'taxes', label: 'Tax' },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
    { key: 'id', label: 'Actions', render: (_: string, row: Prod) => (
      <div className="flex items-center gap-1">
        <button onClick={e => { e.stopPropagation(); setForm(row); crud.setShowEdit(true); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
        <button onClick={e => { e.stopPropagation(); crud.openDelete(row.id); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
      </div>
    )},
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Products" subtitle="Product catalog management">
        <button onClick={() => setShowBulkImport(true)} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><FileSpreadsheet className="size-4" />Bulk Import</button>
        <button 
          onClick={() => setShowBulkEdit(true)} 
          disabled={selectedIds.length === 0}
          className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit3 className="size-4" />Bulk Edit ({selectedIds.length})
        </button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...empty, id: crud.nextId('P-') }); crud.setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Product</button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total SKUs</p><p className="text-2xl font-bold mt-1">{crud.data.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">In Stock</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'In Stock').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Low Stock</p><p className="text-2xl font-bold mt-1">{crud.data.filter(d => d.status === 'Low Stock').length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Out of Stock</p><p className="text-2xl font-bold mt-1 text-rose-600">{crud.data.filter(d => d.status === 'Out of Stock').length}</p></div>
      </div>
      <DataTable columns={columns} data={crud.data} />
      <Modal open={crud.showAdd} onClose={() => crud.setShowAdd(false)} title="Add Product">
        <Form value={form} onChange={setForm} onSave={handleAdd} label="Add Product" />
      </Modal>
      <Modal open={crud.showEdit} onClose={() => crud.setShowEdit(false)} title="Edit Product">
        <Form value={form} onChange={setForm} onSave={handleUpdate} label="Save Changes" />
      </Modal>
      <ConfirmDialog open={crud.showDelete} onClose={() => crud.setShowDelete(false)} onConfirm={() => handleDelete(crud.deleteId || '')} />
      <BulkImportModal open={showBulkImport} onClose={() => setShowBulkImport(false)} onImport={handleBulkImport} />
      <BulkEditModal 
        open={showBulkEdit} 
        onClose={() => setShowBulkEdit(false)} 
        products={crud.data}
        selectedIds={selectedIds}
        onSave={handleBulkSave}
      />
    </motion.div>
  );
}

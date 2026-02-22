import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { useSmartStore } from '../lib/smartStore';

interface InventoryRecord {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  hqStock: number;
  superStockistStock: number;
  distributorStock: number;
  totalStock: number;
  minStock: number;
  unit: string;
  lastUpdated: string;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  fromType: string;
  toType: string;
  reference: string;
  date: string;
}

const emptyInventory: InventoryRecord = {
  id: '',
  productId: '',
  productName: '',
  productImage: '',
  category: '',
  hqStock: 0,
  superStockistStock: 0,
  distributorStock: 0,
  totalStock: 0,
  minStock: 10,
  unit: 'PCS',
  lastUpdated: new Date().toISOString().slice(0, 10),
};

export default function Inventory() {
  const { data, initializeDefaults } = useSmartStore();
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState<InventoryRecord>(emptyInventory);
  const [deleteId, setDeleteId] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { initializeDefaults(); }, []);

  useEffect(() => {
    // Sync inventory with products and orders
    const products = data.products || [];
    const orders = data.orders || [];

    // Create inventory from products
    const invMap = new Map<string, InventoryRecord>();

    products.forEach(p => {
      invMap.set(p.id, {
        id: `INV-${p.id}`,
        productId: p.id,
        productName: p.itemName,
        productImage: p.itemImage || '',
        category: p.category,
        hqStock: p.stock || 0,
        superStockistStock: 0,
        distributorStock: 0,
        totalStock: p.stock || 0,
        minStock: p.minStock || 10,
        unit: 'PCS',
        lastUpdated: new Date().toISOString().slice(0, 10),
      });
    });

    // Process orders to update inventory
    orders.forEach(order => {
      const orderType = order.type || 'Secondary';
      
      order.items?.forEach(item => {
        if (!invMap.has(item.productId)) return;
        
        const inv = invMap.get(item.productId)!;
        
        if (orderType === 'Secondary') {
          // Secondary sales - deduct from HQ/Stockist
          inv.hqStock -= item.qty;
          inv.distributorStock += item.qty;
          inv.totalStock = inv.hqStock + inv.superStockistStock + inv.distributorStock;
          
          setMovements(prev => [...prev, {
            id: `MOV-${order.id}-${item.id}`,
            productId: item.productId,
            productName: item.item,
            type: 'OUT',
            quantity: item.qty,
            fromType: 'HQ',
            toType: 'Distributor',
            reference: order.id,
            date: order.date,
          }]);
        } else {
          // Primary orders - add to HQ/Stockist
          inv.hqStock += item.qty;
          inv.totalStock = inv.hqStock + inv.superStockistStock + inv.distributorStock;
          
          setMovements(prev => [...prev, {
            id: `MOV-${order.id}-${item.id}`,
            productId: item.productId,
            productName: item.item,
            type: 'IN',
            quantity: item.qty,
            fromType: 'Manufacturer',
            toType: 'HQ',
            reference: order.id,
            date: order.date,
          }]);
        }
      });
    });

    setInventory(Array.from(invMap.values()));
  }, [data.products, data.orders]);

  const handleAdd = () => {
    const newInv = { ...form, id: `INV-${Date.now()}`, totalStock: form.hqStock + form.superStockistStock + form.distributorStock };
    setInventory([...inventory, newInv]);
    setShowAdd(false);
    setForm(emptyInventory);
  };

  const handleUpdate = () => {
    setInventory(inventory.map(i => i.id === form.id ? { ...form, totalStock: form.hqStock + form.superStockistStock + form.distributorStock } : i));
    setShowEdit(false);
    setForm(emptyInventory);
  };

  const handleDelete = () => {
    setInventory(inventory.filter(i => i.id !== deleteId));
    setShowDelete(false);
    setDeleteId('');
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'low') return item.totalStock < item.minStock;
    if (filter === 'out') return item.totalStock === 0;
    return true;
  });

  const lowStockCount = inventory.filter(i => i.totalStock < i.minStock).length;
  const outOfStockCount = inventory.filter(i => i.totalStock === 0).length;
  const totalValue = inventory.reduce((sum, i) => sum + (i.totalStock * 100), 0);

  const columns = [
    { key: 'productName', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'hqStock', label: 'HQ Stock', render: (v: number) => <span className={v < 10 ? 'text-amber-600' : ''}>{v}</span> },
    { key: 'superStockistStock', label: 'Super Stockist', render: (v: number) => <span className={v < 10 ? 'text-amber-600' : ''}>{v}</span> },
    { key: 'distributorStock', label: 'Distributor', render: (v: number) => <span className={v < 10 ? 'text-amber-600' : ''}>{v}</span> },
    { key: 'totalStock', label: 'Total', render: (v: number, row: InventoryRecord) => (
      <div className="flex items-center gap-2">
        <span className={v < row.minStock ? 'text-amber-600 font-medium' : v === 0 ? 'text-red-600 font-medium' : ''}>{v}</span>
        {v < row.minStock && <AlertTriangle className="size-3 text-amber-500" />}
        {v === 0 && <AlertTriangle className="size-3 text-red-500" />}
      </div>
    )},
    { key: 'status', label: 'Status', render: (v: number, row: InventoryRecord) => {
      if (v === 0) return <span className="text-red-600 font-medium">Out of Stock</span>;
      if (v < row.minStock) return <span className="text-amber-600 font-medium">Low Stock</span>;
      return <span className="text-green-600">In Stock</span>;
    }},
  ];

  const movementColumns = [
    { key: 'date', label: 'Date' },
    { key: 'productName', label: 'Product' },
    { key: 'type', label: 'Type', render: (v: string) => (
      v === 'IN' ? <span className="flex items-center gap-1 text-green-600"><ArrowDown className="size-3" /> In</span> : <span className="flex items-center gap-1 text-red-600"><ArrowUp className="size-3" /> Out</span>
    )},
    { key: 'quantity', label: 'Qty' },
    { key: 'fromType', label: 'From' },
    { key: 'toType', label: 'To' },
    { key: 'reference', label: 'Ref' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Inventory" subtitle="Stock tracking across HQ, Super Stockist & Distributors">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...emptyInventory, id: `INV-${Date.now()}` }); setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Stock</button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Total Products</p><p className="text-2xl font-bold mt-1">{inventory.length}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Low Stock</p><p className="text-2xl font-bold mt-1 text-amber-600">{lowStockCount}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Out of Stock</p><p className="text-2xl font-bold mt-1 text-red-600">{outOfStockCount}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Stock Value</p><p className="text-2xl font-bold mt-1">₹{(totalValue / 100000).toFixed(2)}L</p></div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm rounded-md ${filter === 'all' ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}>All</button>
        <button onClick={() => setFilter('low')} className={`px-3 py-1.5 text-sm rounded-md ${filter === 'low' ? 'bg-amber-500 text-white' : 'bg-gray-100'}`}>Low Stock</button>
        <button onClick={() => setFilter('out')} className={`px-3 py-1.5 text-sm rounded-md ${filter === 'out' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>Out of Stock</button>
      </div>

      <DataTable columns={columns} data={filteredInventory as unknown as Record<string, unknown>[]} onRowClick={(row) => { setForm(row as InventoryRecord); setShowEdit(true); }} />

      {movements.length > 0 && (
        <div className="bg-card rounded-xl border-0 shadow-lg">
          <div className="border-b px-6 py-4"><h3 className="font-semibold">Recent Stock Movements</h3></div>
          <DataTable columns={movementColumns} data={movements.slice(0, 10).reverse() as unknown as Record<string, unknown>[]} />
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Inventory">
        <InventoryForm value={form} onChange={setForm} onSave={handleAdd} label="Add Stock" products={data.products} />
      </Modal>
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Inventory">
        <InventoryForm value={form} onChange={setForm} onSave={handleUpdate} label="Save Changes" products={data.products} />
      </Modal>
      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} />
    </motion.div>
  );
}

function InventoryForm({ value, onChange, onSave, label, products }: {
  value: InventoryRecord;
  onChange: (v: InventoryRecord) => void;
  onSave: () => void;
  label: string;
  products: any[];
}) {
  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      onChange({
        ...value,
        productId,
        productName: product.itemName,
        category: product.category,
        productImage: product.itemImage || '',
        minStock: product.minStock || 10,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Product" required>
        <Select value={value.productId} onChange={e => handleProductChange(e.target.value)}>
          <option value="">Select Product</option>
          {products.map(p => (<option key={p.id} value={p.id}>{p.itemName}</option>))}
        </Select>
      </FormField>
      <FormField label="Category">
        <Input value={value.category} disabled className="bg-gray-50" />
      </FormField>
      <FormField label="HQ Stock">
        <Input type="number" value={value.hqStock || ''} onChange={e => onChange({ ...value, hqStock: Number(e.target.value) })} />
      </FormField>
      <FormField label="Super Stockist Stock">
        <Input type="number" value={value.superStockistStock || ''} onChange={e => onChange({ ...value, superStockistStock: Number(e.target.value) })} />
      </FormField>
      <FormField label="Distributor Stock">
        <Input type="number" value={value.distributorStock || ''} onChange={e => onChange({ ...value, distributorStock: Number(e.target.value) })} />
      </FormField>
      <FormField label="Min Stock Level">
        <Input type="number" value={value.minStock || ''} onChange={e => onChange({ ...value, minStock: Number(e.target.value) })} />
      </FormField>
      <FormField label="Unit">
        <Select value={value.unit} onChange={e => onChange({ ...value, unit: e.target.value })}>
          <option>PCS</option>
          <option>KG</option>
          <option>LTR</option>
          <option>BOX</option>
          <option>SET</option>
        </Select>
      </FormField>
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.productName} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

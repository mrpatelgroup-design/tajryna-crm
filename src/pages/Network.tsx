import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Filter, Pencil, Trash2, ChevronRight, Building2, Users, Truck, User, Image } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FormField, { Input, Select } from '../components/FormField';
import { useSmartStore } from '../lib/smartStore';

interface NetworkNode {
  id: string;
  name: string;
  type: 'HQ' | 'SuperStockist' | 'Distributor' | 'SalesPerson';
  parentId: string | null;
  location: string;
  contact: string;
  email: string;
  zone: string;
  status: string;
  image: string;
}

const nodeTypes = [
  { value: 'HQ', label: 'Head Quarter (HQ)' },
  { value: 'SuperStockist', label: 'Super Stockist' },
  { value: 'Distributor', label: 'Distributor' },
  { value: 'SalesPerson', label: 'Sales Person' },
];

const emptyNode: NetworkNode = {
  id: '',
  name: '',
  type: 'Distributor',
  parentId: null,
  location: '',
  contact: '',
  email: '',
  zone: '',
  status: 'Active',
  image: '',
};

function NetworkForm({ value, onChange, onSave, label, nodes }: {
  value: NetworkNode;
  onChange: (v: NetworkNode) => void;
  onSave: () => void;
  label: string;
  nodes: NetworkNode[];
}) {
  const [imagePreview, setImagePreview] = useState(value.image || '');

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

  const parentOptions = nodes.filter(n => {
    if (value.type === 'HQ') return false;
    if (value.type === 'SuperStockist') return n.type === 'HQ';
    if (value.type === 'Distributor') return n.type === 'SuperStockist';
    if (value.type === 'SalesPerson') return n.type === 'Distributor';
    return false;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Name" required>
        <Input value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Name" />
      </FormField>
      <FormField label="Type" required>
        <Select value={value.type} onChange={e => onChange({ ...value, type: e.target.value as NetworkNode['type'], parentId: null })}>
          {nodeTypes.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
        </Select>
      </FormField>
      {value.type !== 'HQ' && (
        <FormField label="Parent (Reports To)">
          <Select value={value.parentId || ''} onChange={e => onChange({ ...value, parentId: e.target.value || null })}>
            <option value="">Select Parent</option>
            {parentOptions.map(n => (<option key={n.id} value={n.id}>{n.name} ({n.type})</option>))}
          </Select>
        </FormField>
      )}
      <FormField label="Location">
        <Input value={value.location} onChange={e => onChange({ ...value, location: e.target.value })} placeholder="City, State" />
      </FormField>
      <FormField label="Contact">
        <Input value={value.contact} onChange={e => onChange({ ...value, contact: e.target.value })} placeholder="Phone Number" />
      </FormField>
      <FormField label="Email">
        <Input value={value.email} onChange={e => onChange({ ...value, email: e.target.value })} placeholder="Email" />
      </FormField>
      <FormField label="Zone">
        <Input value={value.zone} onChange={e => onChange({ ...value, zone: e.target.value })} placeholder="Zone/Area" />
      </FormField>
      <FormField label="Status">
        <Select value={value.status} onChange={e => onChange({ ...value, status: e.target.value })}>
          <option>Active</option>
          <option>Inactive</option>
        </Select>
      </FormField>
      <FormField label="Logo/Image">
        <div className="border-2 border-dashed rounded-lg p-3 text-center hover:bg-gray-50">
          {imagePreview ? (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="max-h-24 rounded" />
              <button onClick={() => { setImagePreview(''); onChange({ ...value, image: '' }); }} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 text-xs">✕</button>
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
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <button onClick={onSave} disabled={!value.name} className="h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 disabled:opacity-50">{label}</button>
      </div>
    </div>
  );
}

export default function Network() {
  const store = useSmartStore();
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [form, setForm] = useState<NetworkNode>(emptyNode);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  useEffect(() => {
    store.initializeDefaults();
  }, []);

  useEffect(() => {
    if (store.data.network) {
      setNodes(store.data.network as NetworkNode[]);
    }
  }, [store.data.network]);

  const handleAdd = () => {
    const newNode = { ...form, id: `NET-${Date.now()}` };
    store.addNetworkNode(newNode);
    setShowAdd(false);
    setForm(emptyNode);
  };

  const handleUpdate = () => {
    store.updateNetworkNode(form);
    setShowEdit(false);
    setForm(emptyNode);
  };

  const handleDelete = () => {
    store.deleteNetworkNode(deleteId);
    setShowDelete(false);
    setDeleteId('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HQ': return <Building2 className="size-4" />;
      case 'SuperStockist': return <Users className="size-4" />;
      case 'Distributor': return <Truck className="size-4" />;
      case 'SalesPerson': return <User className="size-4" />;
      default: return <Users className="size-4" />;
    }
  };

  const getChildren = (parentId: string | null) => nodes.filter(n => n.parentId === parentId);

  const renderTree = (parentId: string | null, level: number = 0): React.ReactNode => {
    const children = getChildren(parentId);
    return children.map(node => (
      <div key={node.id} style={{ marginLeft: level * 24 }}>
        <div className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${selectedNode?.id === node.id ? 'bg-indigo-50 border border-indigo-200' : ''}`}
          onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}>
          <ChevronRight className={`size-4 text-gray-400 transition-transform ${selectedNode?.id === node.id ? 'rotate-90' : ''}`} />
          {node.image ? (
            <img src={node.image} alt={node.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              {getTypeIcon(node.type)}
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-sm">{node.name}</p>
            <p className="text-xs text-gray-500">{node.type} • {node.location}</p>
          </div>
          <StatusBadge status={node.status} />
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); setForm(node); setShowEdit(true); }} className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600"><Pencil className="size-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); setDeleteId(node.id); setShowDelete(true); }} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="size-3.5" /></button>
          </div>
        </div>
        {selectedNode?.id === node.id && renderTree(node.id, level + 1)}
      </div>
    ));
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'zone', label: 'Zone' },
    { key: 'contact', label: 'Contact' },
    { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v} /> },
  ];

  const hqCount = nodes.filter(n => n.type === 'HQ').length;
  const ssCount = nodes.filter(n => n.type === 'SuperStockist').length;
  const distCount = nodes.filter(n => n.type === 'Distributor').length;
  const spCount = nodes.filter(n => n.type === 'SalesPerson').length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Network" subtitle="HQ → Super Stockist → Distributor → Sales Person hierarchy">
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Filter className="size-4" />Filter</button>
        <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm border bg-background hover:bg-accent"><Download className="size-4" />Export</button>
        <button onClick={() => { setForm({ ...emptyNode, id: `NET-${Date.now()}` }); setShowAdd(true); }} className="inline-flex items-center gap-2 h-8 px-3 rounded-md text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"><Plus className="size-4" />Add Node</button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Head Quarters</p><p className="text-2xl font-bold mt-1">{hqCount}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Super Stockists</p><p className="text-2xl font-bold mt-1">{ssCount}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Distributors</p><p className="text-2xl font-bold mt-1">{distCount}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-lg border-0"><p className="text-xs text-muted-foreground uppercase tracking-wider">Sales Persons</p><p className="text-2xl font-bold mt-1">{spCount}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border-0 shadow-lg">
          <div className="border-b px-6 py-4"><h3 className="font-semibold">Network Hierarchy</h3></div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {nodes.length > 0 ? renderTree(null) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No network nodes yet</p>
                <p className="text-sm">Add HQ first to start building the network</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border-0 shadow-lg">
          <div className="border-b px-6 py-4"><h3 className="font-semibold">Details</h3></div>
          <div className="p-4">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {selectedNode.image ? (
                    <img src={selectedNode.image} alt={selectedNode.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">{getTypeIcon(selectedNode.type)}</div>
                  )}
                  <div><p className="font-semibold text-lg">{selectedNode.name}</p><p className="text-sm text-gray-500">{selectedNode.type}</p></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Location</span><span>{selectedNode.location || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Zone</span><span>{selectedNode.zone || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Contact</span><span>{selectedNode.contact || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{selectedNode.email || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><StatusBadge status={selectedNode.status} /></div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Children: {getChildren(selectedNode.id).length}</p>
                  <button onClick={() => { setForm({ ...emptyNode, parentId: selectedNode.id, type: selectedNode.type === 'HQ' ? 'SuperStockist' : selectedNode.type === 'SuperStockist' ? 'Distributor' : 'SalesPerson' }); setShowAdd(true); }} className="w-full h-9 text-sm border rounded-md hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Plus className="size-4" /> Add Child Node
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">Select a node to view details</div>
            )}
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={nodes as unknown as Record<string, unknown>[]} />
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Network Node">
        <NetworkForm value={form} onChange={setForm} onSave={handleAdd} label="Add Node" nodes={nodes} />
      </Modal>
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Network Node">
        <NetworkForm value={form} onChange={setForm} onSave={handleUpdate} label="Save Changes" nodes={nodes} />
      </Modal>
      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} />
    </motion.div>
  );
}

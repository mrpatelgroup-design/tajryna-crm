import { useLocation, Link } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import {
  LayoutDashboard, ShoppingCart, Truck, FileText,
  Building2, Users, Package, UsersRound,
  MapPin, Route, Warehouse,
  TrendingUp, Gift, Tags, Target, Clock, FileText as FileTextAlt,
  Settings, LogOut, ChevronLeft
} from 'lucide-react';

const mainModules = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
];

const salesModules = [
  { name: 'Secondary Sales', icon: ShoppingCart, path: '/secondary-sales' },
  { name: 'Primary Sales', icon: Truck, path: '/primary-sales' },
  { name: 'Orders', icon: FileText, path: '/orders' },
];

const operationsModules = [
  { name: 'Distribution', icon: Building2, path: '/distribution' },
  { name: 'Customers', icon: Users, path: '/customers' },
  { name: 'Products', icon: Package, path: '/products' },
  { name: 'Team', icon: UsersRound, path: '/team' },
];

const fieldModules = [
  { name: 'Beats', icon: MapPin, path: '/beats' },
  { name: 'Routes', icon: Route, path: '/routes' },
  { name: 'Inventory', icon: Warehouse, path: '/inventory' },
];

const performanceModules = [
  { name: 'Growth & Tracking', icon: TrendingUp, path: '/tracking' },
  { name: 'Loyalty', icon: Gift, path: '/loyalty' },
  { name: 'Schemes', icon: Tags, path: '/schemes' },
  { name: 'Targets', icon: Target, path: '/targets' },
  { name: 'Attendance', icon: Clock, path: '/attendance' },
  { name: 'Reports', icon: FileTextAlt, path: '/reports' },
];

function SidebarGroup({ label, items, onNavigate }: { label?: string; items: typeof mainModules; onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <div className="px-2 py-1">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.15em] text-indigo-300/50 font-semibold px-2 h-8 flex items-center">
          {label}
        </div>
      )}
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onNavigate}
                className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-all h-8
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white font-medium border-l-2 border-indigo-400'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border-l-2 border-transparent'
                  }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <SidebarGroup items={mainModules} onNavigate={onNavigate} />
      <div className="mx-4 my-1 h-px bg-white/5" />
      <SidebarGroup label="Sales" items={salesModules} onNavigate={onNavigate} />
      <div className="mx-4 my-1 h-px bg-white/5" />
      <SidebarGroup label="Operations" items={operationsModules} onNavigate={onNavigate} />
      <div className="mx-4 my-1 h-px bg-white/5" />
      <SidebarGroup label="Field Ops" items={fieldModules} onNavigate={onNavigate} />
      <div className="mx-4 my-1 h-px bg-white/5" />
      <SidebarGroup label="Performance" items={performanceModules} onNavigate={onNavigate} />
    </>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="border-t border-white/5 p-2">
      <Link
        to="/settings"
        onClick={onNavigate}
        className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-slate-400 hover:text-white hover:bg-white/10 h-8"
      >
        <Settings className="size-4" />
        <span>Settings</span>
      </Link>
      <button className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8">
        <LogOut className="size-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="flex flex-col gap-2 p-4 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-75" />
          <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white size-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/30">T</div>
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight block leading-none text-white">TAJRYNA</span>
          <span className="text-[10px] text-indigo-300/70 uppercase tracking-[0.2em]">Field Sales CRM</span>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarOpen, mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();

  const closeMobile = () => setMobileSidebarOpen(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={`hidden md:flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-200 ease-linear bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-r-0 ${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <SidebarHeader />
        <div className="flex-1 overflow-auto py-2">
          <SidebarContent />
        </div>
        <SidebarFooter />
      </div>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={closeMobile} />
          <div className="relative w-64 h-full bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 animate-slide-in-left overflow-auto flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-75" />
                  <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white size-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/30">T</div>
                </div>
                <div>
                  <span className="font-bold text-lg tracking-tight block leading-none text-white">TAJRYNA</span>
                  <span className="text-[10px] text-indigo-300/70 uppercase tracking-[0.2em]">Field Sales CRM</span>
                </div>
              </div>
              <button onClick={closeMobile} className="text-white/50 hover:text-white p-1">
                <ChevronLeft className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <SidebarContent onNavigate={closeMobile} />
            </div>
            <SidebarFooter onNavigate={closeMobile} />
          </div>
        </div>
      )}
    </>
  );
}

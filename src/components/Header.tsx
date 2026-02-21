import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { PanelLeft, Search, Bell, X, Check } from 'lucide-react';

const searchablePages = [
  { name: 'Dashboard', path: '/' },
  { name: 'Secondary Sales', path: '/secondary-sales' },
  { name: 'Primary Sales', path: '/primary-sales' },
  { name: 'Orders', path: '/orders' },
  { name: 'Distribution', path: '/distribution' },
  { name: 'Customers', path: '/customers' },
  { name: 'Products', path: '/products' },
  { name: 'Team', path: '/team' },
  { name: 'Beats', path: '/beats' },
  { name: 'Routes', path: '/routes' },
  { name: 'Inventory', path: '/inventory' },
  { name: 'Growth & Tracking', path: '/tracking' },
  { name: 'Loyalty', path: '/loyalty' },
  { name: 'Schemes', path: '/schemes' },
  { name: 'Targets', path: '/targets' },
  { name: 'Attendance', path: '/attendance' },
  { name: 'Reports', path: '/reports' },
  { name: 'Settings', path: '/settings' },
];

export default function Header() {
  const { toggleSidebar, toggleMobileSidebar, searchQuery, setSearchQuery, notifications, markNotificationRead, markAllRead } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredPages = searchQuery.trim()
    ? searchablePages.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchSelect(path: string) {
    navigate(path);
    setSearchQuery('');
    setShowSearch(false);
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-4">
        {/* Desktop toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden md:inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground size-7 transition-colors"
        >
          <PanelLeft className="size-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>
        {/* Mobile toggle */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground size-7 transition-colors"
        >
          <PanelLeft className="size-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </button>

        {/* Search */}
        <div ref={searchRef} className="hidden md:block relative">
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md w-80">
            <Search className="size-4 text-muted-foreground" />
            <input
              placeholder="Search leads, deals, tasks..."
              className="bg-transparent border-none text-sm focus:outline-none w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                <X className="size-3" />
              </button>
            )}
          </div>
          {showSearch && filteredPages.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50">
              {filteredPages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => handleSearchSelect(page.path)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors text-left"
                >
                  <Search className="size-3 text-muted-foreground" />
                  {page.name}
                </button>
              ))}
            </div>
          )}
          {showSearch && searchQuery.trim() && filteredPages.length === 0 && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50">
              <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground size-9 transition-colors relative"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 size-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-slate-50 to-indigo-50/50">
                <span className="text-sm font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <Check className="size-3" />Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-auto divide-y">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className={`mt-1 size-2 rounded-full shrink-0 ${!n.read ? 'bg-indigo-500' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-xs leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm cursor-pointer hover:bg-primary/20 transition-colors">
          JD
        </div>
      </div>
    </header>
  );
}

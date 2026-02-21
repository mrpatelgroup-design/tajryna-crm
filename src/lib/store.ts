import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  searchQuery: string;
  notifications: { id: string; text: string; time: string; read: boolean }[];
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setSearchQuery: (q: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  searchQuery: '',
  notifications: [
    { id: '1', text: 'New order from Metro Mart - ₹45,000', time: '2 min ago', read: false },
    { id: '2', text: 'Priya Singh achieved daily target', time: '15 min ago', read: false },
    { id: '3', text: 'Low stock alert: Basmati Rice 5kg', time: '1 hr ago', read: false },
    { id: '4', text: 'ABC Distributors payment received', time: '2 hrs ago', read: true },
    { id: '5', text: 'New customer registered: Daily Mart', time: '3 hrs ago', read: true },
  ],
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}));

import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Database, Globe } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const settingSections = [
  { name: 'Profile', description: 'Manage your personal information', icon: User, items: ['Display Name', 'Email', 'Phone', 'Avatar'] },
  { name: 'Notifications', description: 'Configure alert preferences', icon: Bell, items: ['Email Alerts', 'Push Notifications', 'SMS Alerts', 'Daily Digest'] },
  { name: 'Security', description: 'Password and access settings', icon: Shield, items: ['Change Password', 'Two-Factor Auth', 'Session Management', 'API Keys'] },
  { name: 'Appearance', description: 'Customize the look and feel', icon: Palette, items: ['Theme', 'Language', 'Date Format', 'Currency'] },
  { name: 'Data', description: 'Import, export, and backup', icon: Database, items: ['Import Data', 'Export Data', 'Backup Settings', 'Data Retention'] },
  { name: 'Integrations', description: 'Connect external services', icon: Globe, items: ['ERP Integration', 'Accounting', 'SMS Gateway', 'Maps API'] },
];

export default function Settings() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your CRM preferences" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-xl p-5 shadow-lg border-0 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-100">
                  <Icon className="size-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{section.name}</h3>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-slate-50 transition-colors">
                    <span className="text-xs text-foreground">{item}</span>
                    <span className="text-[10px] text-muted-foreground">›</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

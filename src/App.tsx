import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import SecondarySales from './pages/SecondarySales';
import PrimarySales from './pages/PrimarySales';
import Orders from './pages/Orders';
import Distribution from './pages/Distribution';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Team from './pages/Team';
import Beats from './pages/Beats';
import RoutesPage from './pages/Routes';
import Inventory from './pages/Inventory';
import Tracking from './pages/Tracking';
import Loyalty from './pages/Loyalty';
import Schemes from './pages/Schemes';
import Targets from './pages/Targets';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/secondary-sales" element={<SecondarySales />} />
          <Route path="/primary-sales" element={<PrimarySales />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/team" element={<Team />} />
          <Route path="/beats" element={<Beats />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/targets" element={<Targets />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import SecondarySales from './pages/SecondarySales';
import PrimarySales from './pages/PrimarySales';
import Orders from './pages/Orders';
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
import Estimates from './pages/Estimates';
import ProformaInvoice from './pages/ProformaInvoice';
import PaymentIn from './pages/PaymentIn';
import DeliveryChallan from './pages/DeliveryChallan';
import SalesReturn from './pages/SalesReturn';
import Payroll from './pages/Payroll';
import Network from './pages/Network';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/estimates" element={<Estimates />} />
          <Route path="/proforma-invoice" element={<ProformaInvoice />} />
          <Route path="/payment-in" element={<PaymentIn />} />
          <Route path="/delivery-challan" element={<DeliveryChallan />} />
          <Route path="/sales-return" element={<SalesReturn />} />
          <Route path="/secondary-sales" element={<SecondarySales />} />
          <Route path="/primary-sales" element={<PrimarySales />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/team" element={<Team />} />
          <Route path="/beats" element={<Beats />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/network" element={<Network />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/targets" element={<Targets />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

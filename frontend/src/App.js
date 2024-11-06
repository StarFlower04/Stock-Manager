// src/pages/App.js
import './App.css';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store'; 
import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterUserPage from './pages/RegisterUserPage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage'; 
import ForBusinessPage from './pages/ForBusinessPage'; 
import ForCustomersPage from './pages/ForCustomersPage'; 
import UpgradePaymentPage from './pages/UpgradePaymentPage'; 
import PrivateRoute from './components/PrivateRoute';
import LogoutConfirmationModal from './components/LogoutConfirmationModal';
import { AuthProvider, useAuth } from './components/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons';
import WarehouseManagementPage from './pages/WarehouseManagementPage';
import EditProductPage from './pages/EditProductPage';
import AddProductPage from './pages/AddProductPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage'; 
import PaymentPage from './pages/PaymentPage';
import AdminPanel from './components/AdminPanel';
import './i18n/i18n';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header /> {}
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/registerUser" element={<RegisterUserPage />} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/products/details" element={<ProductsPage />} />
                <Route path="/for-business" element={<ForBusinessPage />} />
                <Route path="/for-customers" element={<ForCustomersPage />} />
                <Route path="/payment" element={<PrivateRoute><UpgradePaymentPage /></PrivateRoute>} />
                <Route path="/warehouse-management" element={<WarehouseManagementPage />} />
                <Route path="/user-inventory/products/:id" element={<EditProductPage />} />
                <Route path="/user-inventory/products/add" element={<AddProductPage />} />
                <Route path="/shopping_cart/user/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
                <Route path="/sales/user/purchases" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
                <Route path="/payments/checkout" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

const Header = () => {
  const { t } = useTranslation(); 

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/');
    setIsModalOpen(false);
  };

  return (
    <header>
      <nav>
        <ul className="navigation-menu">
          <li className="brand">
            <FontAwesomeIcon icon={faWarehouse} className="brand-icon" />
            {t('StockManager')}
          </li>
          <li><NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('Home')}</NavLink></li>
          <li><NavLink to="/for-business" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('For Business')}</NavLink></li>
          <li><NavLink to="/for-customers" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('For Customers')}</NavLink></li>
          <li><NavLink to="/products/details" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('Products')}</NavLink></li>
          {isAuthenticated && (
            <>
              <li><NavLink to="/shopping_cart/user/cart" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('Cart')}</NavLink></li>
              <li><NavLink to="/sales/user/purchases" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('Order History')}</NavLink></li>
              <li><NavLink to="/profile" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('Profile')}</NavLink></li>
            </>
          )}
          <div className="right-nav">
            <LanguageSwitcher /> 
            {isAuthenticated ? (
              <>
                <li><button onClick={handleLogoutClick}>{t('Log Out')}</button></li>
                <LogoutConfirmationModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  onConfirm={handleConfirmLogout}
                />
              </>
            ) : (
              <>
                <li><NavLink to="/auth/login" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('Log In')}</NavLink></li>
                <li><NavLink to="/auth/registerUser" className={({ isActive }) => (isActive ? "active-link" : "")}>{t('Register')}</NavLink></li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default App;
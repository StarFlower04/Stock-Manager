import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import './ForCustomersPage.css';
import { useTranslation } from 'react-i18next';

const ForCustomersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); 
  const { t } = useTranslation(); // Додаємо переклад

  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/products/details');
    } else {
      navigate('/auth/registerUser');
    }
  };

  return (
    <div className="for-users-page">
      <div className="background-overlay">
        <div className="content">
          <h1>{t('Discover a World of Products')}</h1>
          <p>
            {t('At StockManager, we bring you an extensive selection of products sourced from warehouses across the country. Explore a diverse range of high-quality items, all managed with our advanced automation technology. Enjoy seamless shopping with real-time stock updates, competitive prices, and reliable delivery. Find everything you need in one place, backed by our commitment to excellence and efficiency.')}
          </p>
          <button onClick={handleGetStartedClick} className="get-started-button">{t('Get Started')}</button>
        </div>
      </div>
    </div>
  );
};

export default ForCustomersPage;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import './ForBusinessPage.css';
import { useTranslation } from 'react-i18next';

const ForBusinessPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); 
  const { t, i18n } = useTranslation(); 

  // Функція для конвертації доларів у гривні
  const convertToUAH = (usdAmount) => {
    const exchangeRate = 36.5; // Приклад курсу долара до гривні
    return (usdAmount * exchangeRate).toFixed(2);
  };

  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth/registerUser');
    }
  };

  // Обираємо відображення ціни залежно від мови
  const premiumPrice = i18n.language === 'ua' ? `${convertToUAH(199)} грн/місяць` : '$199/month';

  return (
    <div className="for-business-page">
      <div className="background-overlay">
        <div className="content">
          <div className="box">
            <p>
              {t('StockManager provides a comprehensive solution for efficient warehouse management. Our platform automates inventory tracking, order placement, and restocking processes, helping you save time and reduce labor costs.')}
            </p>
            <ul>
              <li>{t('Automated Inventory Tracking')}</li>
              <li>{t('Efficient Order Management')}</li>
              <li>{t('Real-Time Stock Updates')}</li>
              <li>{t('Data-Driven Reordering')}</li>
            </ul>
          </div>
          <div className="box">
            <p>
              {t('By choosing StockManager, you’ll streamline your operations, optimize warehouse space, and improve overall productivity. Our competitive pricing ensures you get the best value for your investment. Additionally, our IoT solutions provide you with enhanced visibility and control over your inventory, ensuring maximum efficiency and accuracy.')}
            </p>
          </div>
          <div className="box">
            <p>
              <strong>{t('Pricing')}:</strong><br />
              {t('Premium Plan')}: {premiumPrice}<br />
            </p>
             <p>
              {t('Investing in StockManager is not just about managing inventory—it’s about transforming your operations. By automating processes and integrating IoT technology, you will save on labor costs, reduce errors, and optimize resource use.')}
            </p>
           <button onClick={handleGetStartedClick} className="get-started-button">{t('Get Started')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForBusinessPage;
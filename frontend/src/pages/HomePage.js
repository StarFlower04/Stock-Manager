import React, { useEffect } from 'react';
import './HomePage.css'; 
import heroImage from '../assets/images/warehouse.jpg'; 
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation(); 

  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className="home-page">
      <div className="image-container">
        <img src={heroImage} alt="Warehouse management" />
      </div>
      <div className="content">
        <h1>{t('welcome_message')}</h1>
        <p>
          {t('description')} {/* Використання перекладу */}
        </p>
        <div className="buttons">
          <a href="/for-business" className="button">{t('for_business')}</a> {/* Використання перекладу */}
          <a href="/for-customers" className="button">{t('for_customers')}</a> {/* Використання перекладу */}
        </div>
        <div className="login-prompt">
          <p>{t('login_prompt')} <a href="/auth/login" className="login-button">{t('login_button')}</a></p> {/* Використання перекладу */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
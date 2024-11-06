import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';
import ukFlag from '../assets/icons/ukraine-flag.png'; // завантажте ваші зображення прапорів
import usFlag from '../assets/icons/us-flag.png';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <img 
        src={usFlag} 
        alt="English" 
        onClick={() => changeLanguage('en')} 
        className="flag-icon"
      />
      <img 
        src={ukFlag} 
        alt="Українська" 
        onClick={() => changeLanguage('ua')} 
        className="flag-icon"
      />
    </div>
  );
};

export default LanguageSwitcher;
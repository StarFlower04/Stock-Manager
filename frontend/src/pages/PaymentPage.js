import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css'; // Імпортуємо CSS файл для стилізації
import axios from 'axios'; // Імпортуємо axios для відправки запитів
import { useTranslation } from 'react-i18next'; // Імпортуємо useTranslation для локалізації
import i18n from 'i18next'; // Імпортуємо i18n для отримання поточної мови

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Використовуємо useTranslation для перекладу

  // Отримання суми з state замість queryParams
  const amountInDollars = location.state?.amount || 0;

  // Функція для конвертації суми
  const convertAmount = (amount) => {
    const conversionRate = 40; // Наприклад, 1 $ = 40 грн
    return amount * conversionRate;
  };

  // Функція для форматування суми в залежності від мови
  const formatAmount = (amount) => {
    const currentLang = i18n.language; // Отримуємо поточну мову
    const currencySymbol = currentLang === 'ua' ? 'грн' : '$';
    const amountValue = currentLang === 'ua' ? convertAmount(amount) : amount;
    return `${amountValue.toFixed(2)} ${currencySymbol}`;
  };

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/payments/checkout', {
        amount: amountInDollars, // Відправляємо суму в доларах
        payment_method: 'credit_card', // Або інший метод, якщо потрібен
        card_number: formData.cardNumber,
        card_expiry: formData.cardExpiry,
        card_cvv: formData.cardCVV,
        first_name: formData.firstName,
        last_name: formData.lastName
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Якщо потрібно авторизацію
        }
      });
      navigate('/profile');
    } catch (error) {
      console.error('Payment failed:', error);
      // Можна додати обробку помилок
    }
  };

  return (
    <div className="payment-page">
      <h1>{t('paymentPage.title')}</h1>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="amount">{t('paymentPage.amountLabel')}</label>
          <input type="text" id="amount" value={formatAmount(amountInDollars)} readOnly className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">{t('paymentPage.cardNumberLabel')}</label>
          <input 
            type="text" 
            id="cardNumber" 
            name="cardNumber" 
            value={formData.cardNumber} 
            onChange={handleInputChange} 
            required 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardExpiry">{t('paymentPage.cardExpiryLabel')}</label>
          <input 
            type="text" 
            id="cardExpiry" 
            name="cardExpiry" 
            value={formData.cardExpiry} 
            onChange={handleInputChange} 
            required 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardCVV">{t('paymentPage.cardCVVLabel')}</label>
          <input 
            type="text" 
            id="cardCVV" 
            name="cardCVV" 
            value={formData.cardCVV} 
            onChange={handleInputChange} 
            required 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">{t('paymentPage.firstNameLabel')}</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleInputChange} 
            required 
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">{t('paymentPage.lastNameLabel')}</label>
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleInputChange} 
            required 
            className="form-control" 
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="confirm-button">{t('paymentPage.confirmButton')}</button>
          <button type="button" className="cancel-button" onClick={() => navigate(-1)}>{t('paymentPage.cancelButton')}</button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
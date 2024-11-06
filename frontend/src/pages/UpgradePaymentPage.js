import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './UpgradePaymentPage.css';
import LoadingAnimation from '../components/LoadingAnimation';
import { useTranslation } from 'react-i18next';

const UpgradePaymentPage = () => {
  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);
  
  const { t } = useTranslation();
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState(199);
  const [formData, setFormData] = useState({
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    first_name: '',
    last_name: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const isFormDirty = () => {
    return Object.values(formData).some((value) => value.trim() !== '');
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isFormDirty()) {
        const message = t('You have unsaved changes. Are you sure you want to leave?');
        event.returnValue = message; // For old browsers
        return message; // For new browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formData, t]);

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);

    if (selectedCurrency === 'UAH') {
        setAmount(199 * 40); // Множимо 199 доларів на 40 для переведення в гривні
    } else {
        setAmount(199); // Якщо обирається USD, залишаємо 199 доларів
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.card_number ||
      !formData.card_expiry ||
      !formData.card_cvv ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.location
    ) {
      setError(t('Please fill out all fields.'));
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('User not authenticated'));
        return;
      }

      setIsProcessing(true);

      const response = await fetch('http://localhost:3000/transactions/upgrade-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          status: 'Completed',
          card_number: formData.card_number,
          card_expiry: formData.card_expiry,
          card_cvv: formData.card_cvv,
          first_name: formData.first_name,
          last_name: formData.last_name,
          location: formData.location,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t('Error processing transaction'));
        setIsProcessing(false);
        return;
      }

      setTimeout(() => {
        setIsProcessing(false);
        setShowConfirmDialog(false);
        navigate('/profile');
      }, 5000);
    } catch (error) {
      setError(t('Error processing transaction'));
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const getMinDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  return (
    <div className="payment-page-container">
      {isProcessing ? (
        <div className="processing-container">
          <LoadingAnimation />
          <p>{t('Please wait, we are processing your payment...')}</p>
        </div>
      ) : (
        <div className="payment-page">
          <h2>{t('Payment Details')}</h2>

          <div className="section">
            <div className="amount-section">
              <label>
                {t('Amount')}: {amount} {currency}
              </label>
              <select value={currency} onChange={handleCurrencyChange}>
                <option value="USD">$ USD</option>
                <option value="UAH">₴ UAH</option>
              </select>
            </div>
          </div>

          <div className="section">
            <h3>{t('Card Details')}</h3>
            {error && <div className="error-message">{error}</div>}
            <input
              type="text"
              name="card_number"
              placeholder={t('Card Number')}
              value={formData.card_number}
              onChange={handleChange}
            />
            <div className="date-cvv-row">
              <DatePicker
                selected={formData.card_expiry ? new Date(`01/${formData.card_expiry}`) : null}
                onChange={(date) => handleChange({ target: { name: 'card_expiry', value: date ? `${date.getMonth() + 1}/${date.getFullYear()}` : '' } })}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText={t('Card Expiry (MM/YYYY)')}
                minDate={getMinDate()}
              />
              <input
                type="text"
                name="card_cvv"
                placeholder={t('Card CVV')}
                value={formData.card_cvv}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="section">
            <h3>{t('Personal Information')}</h3>
            <input
              type="text"
              name="first_name"
              placeholder={t('First Name')}
              value={formData.first_name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder={t('Last Name')}
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="section">
            <h3>{t('Location')}</h3>
            <input
              type="text"
              name="location"
              placeholder={t('Location')}
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="modal-buttons">
            <button className="submit-button" onClick={handleSubmit}>
              {t('Submit Payment')}
            </button>
            <button onClick={handleCancel}>{t('Cancel')}</button>
          </div>

          {showConfirmDialog && (
            <div className="confirm-dialog">
              <h3>{t('Confirm Payment')}</h3>
              <p>{t('Are you sure you want to proceed with this payment?')}</p>
              <button onClick={handleConfirmPayment}>{t('Yes')}</button>
              <button onClick={() => setShowConfirmDialog(false)}>{t('No')}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpgradePaymentPage;
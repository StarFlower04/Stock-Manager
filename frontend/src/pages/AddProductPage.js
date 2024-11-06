// src/pages/AddProductPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Імпортуйте хук перекладу
import './AddProductPage.css';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Ініціалізуйте переклад
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    min_quantity: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.price) {
      setError(t('Please fill in the required fields (Name, Price).'));
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsSaveModalOpen(true);
    }
  };

  const handleConfirmSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('User not authenticated'));
        return;
      }

      const response = await fetch('http://localhost:3000/user-inventory/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t('Error adding product'));
        return;
      }

      navigate('/warehouse-management');
    } catch (error) {
      setError(t('Error adding product'));
    } finally {
      setIsSaveModalOpen(false); // Закриваємо модальне вікно після збереження
    }
  };

  const handleCancel = () => {
    setIsCancelModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      min_quantity: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
    });
    navigate('/warehouse-management');
  };

  return (
    <div className="addProductPage">
      {error && <div className="addProductErrorMessage">{error}</div>}
      <div className="addProductContainer">
        <div className="addProductFormSection">
          <h1>{t('Add Product')}</h1>
          {/* Form fields */}
          <div>
            <label>{t('Name')}: <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{t('Description')}:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{t('Price')}: <span style={{ color: 'red' }}>*</span></label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{t('Minimum Quantity')}:</label>
            <input
              type="number"
              name="min_quantity"
              value={formData.min_quantity}
              onChange={handleInputChange}
            />
          </div>
          <h2>{t('Supplier Information')}</h2>
          <div>
            <label>{t('First Name')}:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{t('Last Name')}:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{t('Email')}:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>{t('Phone Number')}:</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </div>
          <div className="addProductModalButtons">
            <button onClick={handleSave}>{t('Save')}</button>
            <button onClick={handleCancel}>{t('Cancel')}</button>
          </div>
        </div>
      </div>

      {isCancelModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>{t('Are you sure you want to cancel adding the new product? All changes will be discarded.')}</p>
            <div className="modalButtons">
              <button onClick={handleConfirmCancel}>{t('Yes')}</button>
              <button onClick={handleCloseModal}>{t('No')}</button>
            </div>
          </div>
        </div>
      )}

      {isSaveModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>{t('Are you sure you want to add this new product to your warehouse?')}</p>
            <div className="modalButtons">
              <button onClick={handleConfirmSave}>{t('Yes')}</button>
              <button onClick={() => setIsSaveModalOpen(false)}>{t('No')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
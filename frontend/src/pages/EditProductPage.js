// src/pages/EditProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Імпортуйте хук перекладу
import './EditProductPage.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // Ініціалізуйте переклад
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError(t('User not authenticated'));
          return;
        }

        const response = await fetch(`http://localhost:3000/user-inventory/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || t('Error fetching product'));
          return;
        }

        const data = await response.json();
        setProduct(data);
        setFormData({
          ...data,
          supplier_first_name: data.supplier?.first_name || '',
          supplier_last_name: data.supplier?.last_name || '',
          supplier_email: data.supplier?.email || '',
          supplier_phone_number: data.supplier?.phone_number || '',
        });
      } catch (error) {
        setError(t('Error fetching product'));
      }
    };

    fetchProduct();
  }, [id, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('User not authenticated'));
        return;
      }

      const updatedProduct = {
        name: formData.name,
        description: formData.description,
        min_quantity: formData.min_quantity,
        price: formData.price,
        first_name: formData.supplier_first_name,
        last_name: formData.supplier_last_name,
        email: formData.supplier_email,
        phone_number: formData.supplier_phone_number,
      };

      const response = await fetch(`http://localhost:3000/user-inventory/products/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t('Error updating product'));
        return;
      }

      navigate('/warehouse-management');
    } catch (error) {
      setError(t('Error updating product'));
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true); // Відображаємо модальне вікно підтвердження скасування
  };

  const handleConfirmCancel = () => {
    navigate('/warehouse-management'); // Переходимо на сторінку warehouse-management
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false); // Закриваємо модальне вікно підтвердження скасування
  };

  const handleImageFileChange = (event) => {
    setSelectedFile(event.target.files[0]); 
    setNewImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleImageConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('User not authenticated'));
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`http://localhost:3000/products/${id}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message || t('Error updating product image'));
        return;
      }

      setProduct(prevProduct => ({ ...prevProduct, image_url: responseData.image_url }));
      setShowImageModal(false);
      setNewImage(null);
      setSelectedFile(null); 
    } catch (error) {
      setError(t('Error updating product image'));
    }
  };

  const handleCancelImageChanges = () => {
    setNewImage(null);
    setSelectedFile(null); 
    setShowImageModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('User not authenticated'));
        return;
      }

      const response = await fetch(`http://localhost:3000/user-inventory/products/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t('Error deleting product'));
        return;
      }

      setShowDeleteModal(false);
      navigate('/warehouse-management');
    } catch (error) {
      setError(t('Error deleting product'));
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <div className="editProductPage">
      <div className="productContainer">
        <div className="productImageSection">
          <img 
            src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image+Available'} 
            alt={product.name} 
          />
          <button className="changeImageButton" onClick={() => setShowImageModal(true)}>{t('Change Image')}</button>
        </div>
        <div className="productFormSection">
          <h1>{t('Edit Product')}</h1>
          <div>
            <label>{t('Name')}:</label>
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
            <label>{t('Price')}:</label>
            <input 
              type="number" 
              name="price"
              value={formData.price} 
              onChange={handleInputChange} 
            />
          </div>
          <h2>{t('Supplier Information')}</h2>
          <div>
            <label>{t('First Name')}:</label>
            <input 
              type="text" 
              name="supplier_first_name"
              value={formData.supplier_first_name} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label>{t('Last Name')}:</label>
            <input 
              type="text" 
              name="supplier_last_name"
              value={formData.supplier_last_name} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label>{t('Email')}:</label>
            <input 
              type="email" 
              name="supplier_email"
              value={formData.supplier_email} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <label>{t('Phone Number')}:</label>
            <input 
              type="tel" 
              name="supplier_phone_number"
              value={formData.supplier_phone_number} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="modalButtons">
            <button className="saveButton" onClick={handleSave}>{t('Save')}</button>
            <button className="cancelButton" onClick={handleCancel}>{t('Cancel')}</button>
            <button className="deleteProductButton" onClick={() => setShowDeleteModal(true)}>{t('Delete Product')}</button>
          </div>
        </div>
      </div>

      {/* Модальне вікно підтвердження скасування */}
      {showCancelModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>{t('Are you sure you want to cancel changes?')}</h2>
            <div className="modalButtons">
              <button className="confirmButton" onClick={handleConfirmCancel}>{t('Yes')}</button>
              <button className="cancelButton" onClick={handleCancelModalClose}>{t('No')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальне вікно для зміни зображення */}
      {showImageModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>{t('Upload a new image')}</h2>
            <div className="fileInputContainer">
              <label className="fileInputLabel">{t('Choose file')}:</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageFileChange} 
              />
              {newImage && <img src={newImage} alt={t('New product')} className="imagePreview" />}
            </div>
            <div className="modalButtons">
              <button className="confirmButton" onClick={handleImageConfirm}>{t('Confirm')}</button>
              <button className="cancelButton" onClick={handleCancelImageChanges}>{t('Cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>{t('Are you sure you want to delete this product?')}</h2>
            <div className="modalButtons">
              <button className="confirmButton" onClick={handleDeleteConfirm}>{t('Yes')}</button>
              <button className="cancelButton" onClick={() => setShowDeleteModal(false)}>{t('No')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
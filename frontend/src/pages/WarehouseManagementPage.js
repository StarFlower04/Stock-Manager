// src/pages/WarehouseManagementPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Імпортуйте хук перекладу
import './WarehouseManagementPage.css';

const WarehouseManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation(); // Ініціалізуйте переклад

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError(t('User not authenticated'));
          navigate('/auth/login');
          return;
        }

        const response = await fetch('http://localhost:3000/user-inventory/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError(t('Unauthorized'));
            localStorage.removeItem('token');
            navigate('/auth/login');
          } else {
            const errorData = await response.json();
            setError(errorData.message || t('Error fetching products'));
          }
          return;
        }

        const data = await response.json();
        console.log(t("Backend Response:"), data);
        setProducts(data);
      } catch (error) {
        setError(t('Error fetching products'));
      }
    };

    fetchProducts();
  }, [navigate, t]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const handleEditProduct = (productId) => {
    navigate(`/user-inventory/products/${productId}`);
  };

  const handleAddProduct = () => {
    navigate('/user-inventory/products/add');
  };

  return (
    <div className="warehouse-management-page">
      <h1>{t('Warehouse Management')}</h1>
      <div className="products-grid">
        <div className="add-product-card" onClick={handleAddProduct}>
          <div className="plus-sign">+</div>
          <p>{t('Add New Product')}</p>
        </div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.product_id} className="product-card">
              <img
                src={product.image_url || `https://via.placeholder.com/400x300?text=${product.name}`}
                alt={product.name}
              />
              <div className="product-card-body">
                <div>
                  <h2 className="product-card-title">{product.name}</h2>
                  <p className="product-card-description">{product.description}</p>
                  <p className="product-card-supplier">
                    <strong>{t('Supplier')}:</strong> 
                    {product.supplier 
                      ? `${product.supplier.first_name} ${product.supplier.last_name}`
                      : t('No supplier data')}
                  </p>
                  <p className="product-card-min-quantity">
                    <strong>{t('Minimum Quantity')}:</strong> {product.min_quantity}
                  </p>
                  {product.warehouses && product.warehouses.length > 0 && (
                    <div className="product-card-warehouse">
                      <p><strong>{t('Quantity in Warehouse')}:</strong> {product.warehouses[0].quantity}</p>
                    </div>
                  )}
                  <p className="product-card-price">
                    <strong>{t('Price')}:</strong> ${product.price}
                  </p>
                </div>
                <button
                  className="product-card-button"
                  onClick={() => handleEditProduct(product.product_id)}
                >
                  {t('Edit Product')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>{t('No products found in your warehouses.')}</p>
        )}
      </div>
    </div>
  );
};

export default WarehouseManagementPage;
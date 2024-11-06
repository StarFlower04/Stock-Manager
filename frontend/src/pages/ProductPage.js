// src/pages/ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import './ProductPage.css';
import LoadingAnimation from '../components/LoadingAnimation';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/details?id=${id}`);
        const data = await response.json();
        console.log(t('Fetched product:'), data);
        setProduct(data);
      } catch (error) {
        console.error(t('Failed to fetch product'), error);
        setError(t('Failed to load product details'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('User not authenticated'));
        return;
      }

      const addToCartResponse = await fetch('http://localhost:3000/shopping_cart/product/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          amount: 1,
        }),
      });

      if (!addToCartResponse.ok) {
        const errorData = await addToCartResponse.json();
        setError(errorData.message || t('Failed to add product to cart'));
        return;
      }

      alert(t('Product added to cart successfully!'));
    } catch (error) {
      console.error(t('Failed to add product to cart'), error);
      setError(t('Failed to add product to cart'));
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <img 
        src={product.imageUrl || `https://via.placeholder.com/400x300?text=${product.name}`} 
        alt={product.name} 
      />
      <p>{product.description}</p>
      <p>{`${t('Price')}: $${product.price}`}</p>
      <p>{`${t('Supplier')}: ${product.supplier.firstName} ${product.supplier.lastName}`}</p>
      {product.warehouses && product.warehouses.map((warehouse) => (
        <div key={warehouse.warehouse_id}>
          <p>{`${t('Warehouse')}: ${warehouse.location}`}</p>
          <p>{`${t('Quantity')}: ${warehouse.quantity}`}</p>
        </div>
      ))}
      <button onClick={handleAddToCart}>
        {t('Add to Cart')}
      </button>
      {error && <div>{error}</div>}
    </div>
  );
};

export default ProductPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import LoadingAnimation from '../components/LoadingAnimation';
import EmptyCartImage from '../assets/images/empty-cart.png'; 
import { useTranslation } from 'react-i18next';

const CartPage = () => {
  const { t } = useTranslation();

  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shippingCost, setShippingCost] = useState(5); 
  const [shippingDescription, setShippingDescription] = useState('Standard delivery typically takes 3-5 business days.');

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const fetchCartProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      const response = await fetch('http://localhost:3000/shopping_cart/user/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error loading data');
        return;
      }

      const result = await response.json();
      setCartProducts(result);
    } catch (error) {
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:3000/shopping_cart/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error removing item');
        return;
      }

      // Оновити кошик після видалення товару
      fetchCartProducts();
    } catch (error) {
      setError('Error removing item');
    }
  };

  const updateQuantity = async (id, amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:3000/shopping_cart/change/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }), // Надсилаємо нову кількість
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error updating quantity');
        return;
      }

      // Оновлюємо кошик після зміни кількості
      fetchCartProducts();
    } catch (error) {
      setError('Error updating quantity');
    }
  };

  const handleQuantityChange = (cartItem, action) => {
    let newAmount = cartItem.amount;

    if (action === 'increase') {
      newAmount += 1;
    } else if (action === 'decrease' && cartItem.amount > 1) {
      newAmount -= 1; // Зменшуємо кількість, якщо вона більше 1
    }

    updateQuantity(cartItem.id, newAmount);
  };

  const handleCheckout = () => {
    // Розрахунок загальної суми
    const totalCost = cartProducts.reduce(
      (acc, item) => acc + item.amount * item.product.price,
      0
    );
    const finalAmount = totalCost + shippingCost;
    // Перенаправлення на сторінку оплати з параметрами через state
    navigate('/payments/checkout', { state: { amount: finalAmount } });
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (cartProducts.length === 0) {
    return (
      <div className="empty-cart">
        <img src={EmptyCartImage} alt="Your cart is empty" className="empty-cart-image" />
        <h2>Your cart is empty</h2>
        <p>{t('Looks like you have not added anything to your cart. Go ahead & explore top categories.')}</p>
      </div>
    );
  }

  const formatImageUrl = (imageUrl) => {
    const imageName = imageUrl.split('\\').pop();
    return `http://localhost:3000/uploads/products/${imageName}`;
  };

  const handleShippingOptionChange = (e) => {
    const selectedOption = e.target.value;
    if (selectedOption === 'standard') {
      setShippingCost(5); // Стандартна доставка $5
      setShippingDescription('Standard delivery typically takes 3-5 business days.');
    } else if (selectedOption === 'premium') {
      setShippingCost(15); // Преміум доставка $15
      setShippingDescription('Premium delivery guarantees delivery within 1-2 business days.');
    }
  };

  const totalCost = cartProducts.reduce(
    (acc, item) => acc + item.amount * item.product.price,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-content">
        <div className="cart-products">
        <h1>{t('Shopping Cart')}</h1>
          <div className="cart-header">
            <span>{t('Product Details')}</span>
            <span>{t('Quantity')}</span>
            <span>{t('Price')}</span>
            <span>{t('Total')}</span>
          </div>

          {cartProducts.map((cartItem, index) => (
            <div className="cart-item" key={index}>
              <div className="cart-product-info">
                <div className="cart-product-image">
                  <img 
                    src={formatImageUrl(cartItem.product.image_url) || `https://via.placeholder.com/400x300?text=${cartItem.product.name}`} 
                    alt={cartItem.product.name} 
                  />
                </div>
                <div className="cart-product-details">
                  <p className="cart-product-name">{cartItem.product.name}</p>
                  <p className="cart-product-description">{cartItem.product.description}</p>
                  <button 
                    className="remove-button" 
                    onClick={() => handleRemove(cartItem.id)}
                  >
                    {t('Remove')}
                  </button>
                </div>
              </div>
              <div className="cart-quantity">
                <button 
                  className="quantity-button" 
                  onClick={() => handleQuantityChange(cartItem, 'decrease')}
                >
                  -
                </button>
                <span>{cartItem.amount}</span>
                <button 
                  className="quantity-button" 
                  onClick={() => handleQuantityChange(cartItem, 'increase')}
                >
                  +
                </button>
              </div>
              <div className="cart-price">${cartItem.product.price}</div>
              <div className="cart-total">${(cartItem.amount * cartItem.product.price).toFixed(2)}</div>
            </div>
          ))}

          <a href="/products/details" className="continue-shopping">{t('← Continue Shopping')}</a>
        </div>

        <div className="cart-summary">
          <h2>{t('Order Summary')}</h2>
          <div className="summary-details">
            <div className="summary-item">
              <span>{t('Items')}</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>{t('Shipping')}</span>
              <div className="shipping-section">
                <select 
                  onChange={handleShippingOptionChange} 
                  className="shipping-options"
                  defaultValue="standard"
                >
                  <option value="standard">{t('Standard Delivery - $5')}</option>
                  <option value="premium">{t('Premium Delivery - $15')}</option>
                </select>
                <p className="shipping-description">{shippingDescription}</p>
              </div>
            </div>
            <div className="summary-total">
              <span>{t('Total Cost')}</span>
              <span>${(totalCost + shippingCost).toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>{t('Checkout')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
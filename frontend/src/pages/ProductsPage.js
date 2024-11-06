import React, { useEffect, useState } from 'react';
import './ProductsPage.css';
import LoadingAnimation from '../components/LoadingAnimation';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products/details');
        const data = await response.json();
        console.log('Fetched products:', data); // Лог для перевірки даних, отриманих з API

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setError('Fetched data is not an array');
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    console.log('Product ID received in handleAddToCart:', productId);
  
    if (!productId) {
      console.error('Product ID is undefined');
      alert('Product ID is undefined');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated');
        return;
      }
  
      const response = await fetch(`http://localhost:3000/products/details?id=${productId}`);
      const product = await response.json();
      console.log('Fetched product:', product);
  
      const addToCartResponse = await fetch('http://localhost:3000/shopping_cart/product/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          amount: 1,
        }),
      });
  
      if (!addToCartResponse.ok) {
        const errorData = await addToCartResponse.json();
        alert(errorData.message || 'Failed to add product to cart');
        return;
      }
  
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Failed to add product to cart', error);
      if (error.message === 'Product already in cart') {
        alert('This product is already in your cart.');
      } else {
        alert('Failed to add product to cart. Please try again later.');
      }
    }
  };  
  
  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <h1>Products</h1>
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.product_id}>
              <img 
                src={product.imageUrl || `https://via.placeholder.com/400x300?text=${product.name}`} 
                alt={product.name} 
              />
              <div className="product-card-body">
                <div>
                  <h2 className="product-card-title">{product.name}</h2>
                  <p className="product-card-description">{product.description}</p>
                  <p className="product-card-supplier">{`Supplier: ${product.supplier.firstName} ${product.supplier.lastName}`}</p>
                  {product.warehouses && product.warehouses.map((warehouse) => (
                    <div key={warehouse.warehouse_id} className="product-card-warehouse">
                      <p>{`Warehouse: ${warehouse.location}`}</p>
                      <p className="product-card-quantity">{`Quantity: ${warehouse.quantity}`}</p>
                    </div>
                  ))}
                </div>
                <button
                  className="product-card-button"
                  onClick={() => handleAddToCart(product.product_id)} // Переконайтеся, що використовуєте правильний шлях до ID продукту
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
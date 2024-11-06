import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    supplier_id: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('/admin/products/all');
    setProducts(response.data);
  }

  const handleCreateProduct = async () => {
    await axios.post('/admin/products/post', newProduct);
    fetchProducts();
  }

  const handleUpdateProduct = async (id, updatedProduct) => {
    await axios.put(`/admin/products/put/${id}`, updatedProduct);
    fetchProducts();
  }

  const handleDeleteProduct = async (id) => {
    await axios.delete(`/admin/products/delete/${id}`);
    fetchProducts();
  }

  return (
    <div>
      <h2>Products Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.product_id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.supplier_id}</td>
              <td>
                <button onClick={() => handleUpdateProduct(product.product_id, product)}>Update</button>
                <button onClick={() => handleDeleteProduct(product.product_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Create New Product</h3>
      <form onSubmit={handleCreateProduct}>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={newProduct.description}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
          placeholder="Price"
          required
        />
        <input
          type="text"
          value={newProduct.supplier_id}
          onChange={(e) => setNewProduct({...newProduct, supplier_id: e.target.value})}
          placeholder="Supplier ID"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default ProductsManagement;
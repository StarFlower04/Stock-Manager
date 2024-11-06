import React, { useEffect, useState } from 'react';
import './OrderHistoryPage.css';
import { useTranslation } from 'react-i18next';

const OrderHistoryPage = () => {
  const { t } = useTranslation(); 
  const [orders, setOrders] = useState({ pending: [], past: [] });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/sales/user/purchases', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const text = await response.text();

        try {
          const data = JSON.parse(text);
          const pending = data.filter(order => order.status === 'Processed');
          const past = data.filter(order => order.status === 'Delivered');

          setOrders({ pending, past });
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError);
          throw new Error('Invalid JSON response');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const renderOrderItem = (order) => (
    <tr key={order.sale_id}>
      <td>{new Date(order.sale_date).toLocaleDateString()}</td>
      <td>{order.saleProducts.map(product => product.product.name).join(', ')}</td>
      <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
      {order.tracking_number && (
        <td>
          <a href={`https://tracking-service.com/track/${order.tracking_number}`} target="_blank" rel="noopener noreferrer">
            {order.tracking_number}
          </a>
        </td>
      )}
    </tr>
  );  

  return (
    <div className="order-history">
      <h1>{t('Your Order History')}</h1>

      <h2>{t('Pending Orders')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('Order Invoiced Date')}</th>
            <th>{t('Order details')}</th>
            <th>{t('Status')}</th>
            {orders.pending.some(order => order.tracking_number) && <th>{t('Tracking number')}</th>}
          </tr>
        </thead>
        <tbody>
          {orders.pending.map(renderOrderItem)}
        </tbody>
      </table>

      <h2>{t('Past Orders')}</h2>
      <table>
        <thead>
          <tr>
            <th>{t('Order Invoiced Date')}</th>
            <th>{t('Order details')}</th>
            <th>{t('Status')}</th>
            {orders.past.some(order => order.tracking_number) && <th>{t('Tracking number')}</th>}
          </tr>
        </thead>
        <tbody>
          {orders.past.map(renderOrderItem)}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistoryPage;
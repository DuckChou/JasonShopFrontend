import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OrderListScreen() {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getOrders = useCallback(async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.get('/api/orders/allOrders/', config);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }, [userInfo.token]);

  useEffect(() => {
    if (!(userInfo && userInfo.isAdmin)) {
      navigate('/login');
    } else {
      getOrders();
    }
    // @ts-ignore
  }, [getOrders, navigate, userInfo]);

  const checkDliveredHandler = async (id) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      getOrders();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>OPERATION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)} </td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <i className="fas fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <i className="fas fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td className="text-center">
                  <Button
                    variant="success"
                    onClick={() => {
                      checkDliveredHandler(order._id);
                    }}
                    disabled={order.isDelivered}
                  >
                    delivered
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default OrderListScreen;

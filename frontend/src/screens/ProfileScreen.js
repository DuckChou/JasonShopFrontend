import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { updateProfile } from '../store/UserReducer';

import axios from 'axios';

function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { loading, error, userInfo } = user;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
    if (userInfo) {
      setEmail(userInfo.email);
      setName(userInfo.name);
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            // @ts-ignore
            Authorization: `Bearer ${
              // @ts-ignore
              JSON.parse(localStorage.getItem('userInfo')).token
            }`,
          },
        };
        const response = await axios.get(`/api/orders`, config);

        const newOrders = response.data.map((order) => ({
          _id: order._id,
          createdAt: order.createdAt,
          paidAt: order.paidAt,
          totalPrice: order.totalPrice,
          isPaid: order.isPaid,
        }));

        setOrders(newOrders);
        // return response.data;
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const memoizedOrders = useMemo(() => {
    return orders.map((order) => ({
      _id: order._id,
      createdAt: order.createdAt,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
    }));
  }, [orders]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      //dispatch update profile
      setMessage('');
      dispatch(
        updateProfile({
          email: email,
          name: name,
          password: password,
          token: userInfo.token,
        })
      );
    }
  };
  return (
    <Row>
      <Col lg={3}>
        <h2>User Profile</h2>

        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className='my-2'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password" className='my-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="passwordConfirm" className='my-2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className='my-3'>
            Update
          </Button>
        </Form>
      </Col>

      <Col lg={9}>
        <h2>My Orders</h2>
        <Table striped responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {memoizedOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className="btn-sm">Details</Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}

export default ProfileScreen;

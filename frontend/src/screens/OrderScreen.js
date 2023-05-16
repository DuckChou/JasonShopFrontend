import React, { useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';

import { getOrder } from '../store/OrderSlice';
import Loader from '../components/Loader';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

function PlaceOrderScreen() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { id } = useParams();

  const orderData = useSelector((state) => state.order);

  useEffect(() => {
    // @ts-ignore
    dispatch(getOrder(id));
  }, [dispatch, id, orderData.isPaid]);

  const {
    order,
    shippingAddress,
    user,
    paymentMethod,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    loading,
    error,
  } = orderData;

  const date = new Date(paidAt).toLocaleString();

  const payOrder = async () => {
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
      const response = await axios.put(`https://jasonshop.space/api/orders/${id}/pay`, {}, config);
      dispatch(getOrder(id));
      return response.data;
    } catch (error) {
      throw new Error('pay order failed');
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1>ORDER {id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item className="my-3 my-md-0">
                  <h2>Details</h2>
                  <p>
                    <strong>name: </strong>
                    {user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {user.email}
                  </p>
                  <p>
                    <strong>Shipping: </strong>
                    {shippingAddress.address}, {shippingAddress.city}
                    {'  '}
                    {shippingAddress.postalCode},{'  '}
                    {shippingAddress.country}
                  </p>
                  {isDelivered ? (
                    <Message variant="success">
                      Delivered on {deliveredAt.substring(0, 10)}
                    </Message>
                  ) : (
                    <Message variant="warning">Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item className="my-3 my-md-0">
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {paymentMethod}
                  </p>
                  {isPaid ? (
                    <Message variant="success">Paid on {date}</Message>
                  ) : (
                    <Message variant="warning">Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item className="my-3 my-md-0">
                  <h2>Order Items</h2>
                  {order.length === 0 ? (
                    <Message variant="info">Your cart is empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>

                            <Col className="mt-3 mt-md-0">
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>

                            <Col md={4}>
                              {item.qty} X ${item.price} = $
                              {(item.qty * item.price).toFixed(2)}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Items:</Col>
                      <Col>
                        ${(totalPrice - taxPrice - shippingPrice).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col>${shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Tax:</Col>
                      <Col>${taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Total:</Col>
                      <Col>${totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>

                  {!isPaid && (
                    <ListGroup.Item>
                      <PayPalScriptProvider
                        options={{
                          'client-id':
                            'AdG6fV9p83IgtpqOzRFEG4IkVAmWLgRrEtXqIPlJb_WqOFxqj08BNd-4S5cd2jAiZKjSh13_s4AdONj1',
                        }}
                      >
                        <PayPalButtons
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: totalPrice,
                                  },
                                  shipping: {
                                    name: {
                                      full_name: user.name,
                                    },
                                    address: {
                                      address_line_1: '1200 Main St',
                                      address_line_2: 'Unit 10',
                                      admin_area_2: 'Phoenix',
                                      admin_area_1: 'AZ',
                                      postal_code: '85001',
                                      country_code: 'US',
                                    },
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order
                              .capture()
                              .then(function (details) {
                                payOrder();
                                dispatch(getOrder(id));
                                console.log('haha');
                              });
                          }}
                        />
                      </PayPalScriptProvider>
                    </ListGroup.Item>
                  )}
                  {error && (
                    <ListGroup.Item>
                      <Message variant="danger">{error}</Message>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default PlaceOrderScreen;

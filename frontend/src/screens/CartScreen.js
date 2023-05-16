import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  getCartProducts,
  changeItemQty,
  removeItem,
} from '../store/CartReducer';
import {
  ListGroup,
  Row,
  Col,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';

function CartScreen() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const productId = location.pathname.split('/')[2];

  const cart = useSelector((state) => state.cart);

  const { cartItems, loading } = cart;

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (productId) {
      dispatch(getCartProducts({ id: productId, qty: Number(qty) }));
    }
  }, [productId, qty, dispatch]);

  const removeFromCartHandler = (id) => {
    dispatch(removeItem(id));
  };

  const CheckoutHandler = () => {
    if (user.userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login');
    }
  };

  return (
    <Row>
      <Col lg={8}>
        <h1>Cart Screen</h1>
        {loading ? (
          <Loader />
        ) : cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty
            <Link to="/" className="btn btn-light my-3 mx-2">
              Go Back
            </Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3} className="mt-3 mt-md-0">
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2} className="mt-3 mt-md-0">
                    ${item.price}
                  </Col>
                  <Col md={5} className="mt-3 mt-md-0">
                    <Row>
                      <Col>
                        <Form.Select
                          value={item.qty}
                          onChange={(e) => {
                            dispatch(
                              changeItemQty({
                                id: item._id,
                                qty: Number(e.target.value),
                              })
                            );
                          }}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => {
                            removeFromCartHandler(item._id);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col
        md={10}
        lg={4}
        className="text-center text-lg-start mx-auto mt-4 mt-lg-0"
      >
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal {cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
                items
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={CheckoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;

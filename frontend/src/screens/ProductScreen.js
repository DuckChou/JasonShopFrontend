import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';

import { useParams,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../store/ProductReducer';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProductScreen() {

  const [qty, setQty] = useState(1);

  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);
  const { data, loading, error } = product;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`)
  };

  return (
    <div>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {error ? (
        <Message variant={'danger'}>{error}</Message>
      ) : loading || !data ? (
        <Loader />
      ) : (
        <Row>
          <Col lg={5} className='text-center'>
            <Image src={data?.image} alt={data?.name} fluid></Image>
          </Col>
          <Col lg={4} className='mt-5 mt-lg-0'>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{data.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={data?.rating}
                  text={`${data?.numReviews} reviews`}
                  color={'#f8e825'}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${data?.price}</ListGroup.Item>
              <ListGroup.Item>Description: {data?.description}</ListGroup.Item>
            </ListGroup>
          </Col>

          <Col lg={3} className='mt-5 mt-lg-0'>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${data?.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {
                        // @ts-ignore
                        data?.countInStock > 0 ? 'In Stock' : 'Out Of Stock'
                      }
                    </Col>
                  </Row>
                </ListGroup.Item>

                {data.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col xs="auto" className="my-1">
                        <Form.Select
                          
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {
                            [...Array(data?.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )

                          }
                        </Form.Select>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block w-100"
                    type="button"
                    disabled={data?.countInStock === 0}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default ProductScreen;

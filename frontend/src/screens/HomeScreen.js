// rfce

import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/ProductsReducer';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { useLocation } from 'react-router-dom';

function HomeScreen() {
  const dispatch = useDispatch();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const myParam = searchParams.get('keyword');
  const keyword = myParam == null ? '' : `?keyword=${myParam}`;


  const products = useSelector((state) => state.products);
  const { data, loading, error } = products;

  useEffect(() => {
    dispatch(getProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={'danger'}>{error}</Message>
      ) : (
        <Row>
          {data.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default HomeScreen;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteProductModal from '../components/DeleteProductModal';

import { getProducts } from '../store/ProductsReducer';
import Loader from '../components/Loader';

function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading } = useSelector((state) => state.products);

  const { userInfo } = useSelector((state) => state.user);

  const [modalShow, setModalShow] = useState(false);
  const [deleteProductName, setDeleteProductName] = useState('');
  const [deleteProductPrice, setDeleteProductPrice] = useState('');
  const [deleteProductCategory, setDeleteProductCategory] = useState('');
  const [deleteProductBrand, setDeleteProductBrand] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(-1);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getProducts(''));
    } else {
      navigate('/login');
    }
    // @ts-ignore
  }, [dispatch, navigate, userInfo]);

  const deleteHandler = async (id) => {
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
      const response = await axios.delete(`/api/products/${id}/delete`, config);
      dispatch(getProducts(''));

      return response.data;
    } catch (error) {
      throw new Error('delete order failed');
    }
  };

  const comfirmDeleteHandler = (name, price, category, brand, id) => {
    setDeleteProductName(name);
    setDeleteProductPrice(price);
    setDeleteProductCategory(category);
    setDeleteProductBrand(brand);
    setDeleteProductId(id);
    setModalShow(true);
  };

  const addProductHandler = async () => {
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
      const response = await axios.post(`/api/products/addProduct`, {}, config);

      navigate(`/admin/product/${response.data._id}/edit`);
    } catch (error) {
      throw new Error('add order failed');
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col>
          <Button
            className="my-3"
            style={{ float: 'right' }}
            onClick={addProductHandler}
          >
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th className="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name} </td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td className="text-center">
                    <LinkContainer
                      to={`/admin/product/${product._id}/edit`}
                      className="mx-2"
                    >
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>

                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => {
                        comfirmDeleteHandler(
                          product.name,
                          product.price,
                          product.category,
                          product.brand,
                          product._id
                        );
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <DeleteProductModal
            show={modalShow}
            header="Products DELETE"
            bodyHeader="Do you really want to delete this product?"
            name={deleteProductName}
            price={deleteProductPrice}
            category={deleteProductCategory}
            brand={deleteProductBrand}
            id={deleteProductId}
            onHide={() => setModalShow(false)}
            onDeleteUser={deleteHandler}
          />
        </div>
      )}
    </>
  );
}

export default ProductListScreen;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, updateProduct } from '../store/ProductReducer';
import axios from 'axios';

function ProjectEditScreen() {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const [uploadImage, setUploadImage] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const product = useSelector((state) => state.product.data);

  useEffect(() => {
    // @ts-ignore
    dispatch(getProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    setName(product.name || '');
    setPrice(product.price || '');
    setImage(product.image || '');
    setBrand(product.brand || '');
    setCategory(product.category || '');
    setCountInStock(product.countInStock || '');
    setDescription(product.description || '');
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (uploadImage) {
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        const { data } = await axios.post(
          '/api/products/upload',
          uploadImage,
          config
        );

        localStorage.removeItem('cartItems')

        
      } catch (error) {}
    }

    // @ts-ignore
    dispatch(
      // @ts-ignore
      updateProduct({
        id,
        name,
        price,
        brand,
        category,
        countInStock,
        description,
      })
    );

    navigate('/admin/productlist');
  };

  const uploadFileHandler = (e) => {
    // @ts-ignore
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    // @ts-ignore
    formData.append('product_id', id);

    // @ts-ignore
    setUploadImage(formData);
  };

  return (
    <div>
      <Link to="/admin/productlist">Go Back</Link>

      <FormContainer>
        <h1>Edit Product</h1>

        <Form onSubmit={submitHandler} encType="multipart/form-data">
          <Form.Group controlId="name" className='mt-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className='mt-3'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="price"
              placeholder="Enter Email"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='mt-3'>
            <Form.Label>Image</Form.Label >
            <Form.Control
              // type="image"
              placeholder="Enter Image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>

            <Form.Control
              id="image-file"
              type="file"
              onChange={uploadFileHandler}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="brand" className='mt-3'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="brand"
              placeholder="Enter Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category" className='mt-3'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="category"
              placeholder="Enter Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="countInStock" className='mt-3'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="countInStock"
              placeholder="Enter Count In Stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="description" className='mt-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="description"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className='mt-3'>
            Update
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
}

export default ProjectEditScreen;

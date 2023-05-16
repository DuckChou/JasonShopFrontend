import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById,updateUserById } from '../store/UserUpdateSlice';

function UserEditScreen() {
  const { id } = useParams();
  const user = useSelector((state) => state.updateUser.user);



  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    // @ts-ignore
    dispatch(getUserById(id));
  }, [dispatch, id]);

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
    setIsAdmin(user.isAdmin || false);
  }, [user]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserById({ id, name, email, isAdmin }));
    navigate('/admin/userlist');
  };

  return (
    <div>
      <Link to="/admin/userlist">Go Back</Link>

      <FormContainer>
        <h1>Edit User</h1>

        <Form onSubmit={submitHandler}>
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
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="isadmin" className='mt-3'>
            <Form.Check
              type="checkbox"
              label="Is Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></Form.Check>
          </Form.Group>

          <Button type="submit" variant="primary" className='mt-3'>
            Update
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
}

export default UserEditScreen;

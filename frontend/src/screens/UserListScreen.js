import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../store/AdminSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteUserModal from '../components/DeleteUserModal';

function UserListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userList, loading, error } = useSelector((state) => state.admin);

  const { userInfo } = useSelector((state) => state.user);

  const [modalShow, setModalShow] = useState(false);
  const [deleteUserEmail, setDeleteUserEmail] = useState('');
  const [deleteUserName, setDeleteUserName] = useState('');
  const [deleteUserIsAdmin, setDeleteUserIsAdmin] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(-1);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getAllUsers());
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
      const response = await axios.put(`https://jasonshop.space/api/users/${id}/delete`, {}, config);
      dispatch(getAllUsers());

      return response.data;
    } catch (error) {
      throw new Error('delete order failed');
    }
  };

  const comfirmDeleteHandler = (email, name, isAdmin, id) => {
    setDeleteUserEmail(email);
    setDeleteUserName(name);
    setDeleteUserIsAdmin(isAdmin);
    setDeleteUserId(id);
    setModalShow(true);
  };

  return (
    <div>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>OPERATION</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name} </td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td className="text-center">
                  <LinkContainer
                    to={`/admin/user/${user._id}/edit`}
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
                        user.email,
                        user.name,
                        user.isAdmin,
                        user._id
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
      )}

      <DeleteUserModal
        show={modalShow}
        header="USER DELETE"
        bodyHeader="Do you really want to delete this user?"
        name={deleteUserName}
        email={deleteUserEmail}
        isAdmin={deleteUserIsAdmin}
        id={deleteUserId}
        onHide={() => setModalShow(false)}
        onDeleteUser={deleteHandler}
      />
    </div>
  );
}

export default UserListScreen;

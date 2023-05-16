import React, { useState } from 'react';
import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
  NavDropdown,
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';

import { logout } from '../store/UserReducer';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // @ts-ignore
  const user = useSelector((state) => state.user);

  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const searchHandler = () => {
    if (search.trim()) {
      navigate(`/?keyword=${search}`);
    }else{
      navigate('/')
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container fluid className="my-1">
          <LinkContainer to="/" className="my-2">
            <Navbar.Brand>Jason's Shop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>CART
                </Nav.Link>
              </LinkContainer>

              {user.userInfo ? (
                <NavDropdown title={user.userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i>LOGIN
                  </Nav.Link>
                </LinkContainer>
              )}

              {user.userInfo && user.userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
            {isHomePage && (
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search for products"
                  className="me-2"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-success" onClick={searchHandler}>
                  Search
                </Button>
              </Form>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;

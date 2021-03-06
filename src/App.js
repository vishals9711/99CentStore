import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './LoginPage/LoginPage';
import ViewListing from './ViewListing/ViewListing';
import Listings from './Listings/Listings';
import CreateListing from './CreateListing/CreateListing';
import Registration from './Registration/Registration';
import Container from 'react-bootstrap/Container'
import NavbarComponent from './NavbarComponent';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const App = ({ store }) => {
  const isLoggedIn = useSelector(state => state.userReducer.isLoggedIn);
  const isAdmin = useSelector(state => state.userReducer.isAdmin);

  return (
    <Container className="App">
      <ToastContainer />
      <NavbarComponent />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {(isLoggedIn && isAdmin) &&
          <>
            <Route path="/createListing" element={<CreateListing />} />
            <Route path="/editListing/:id" element={<CreateListing />} />
          </>
        }
        <Route path="/viewListing/:id" element={<ViewListing />} />
        <Route exact path='/listing' element={<Listings />} />
        <Route path="/" element={<Navigate replace to="/listing" />} />
        <Route path="/registration" element={<Registration store={store}/>} />
      </Routes>
    </Container>
  );
};

export default App;

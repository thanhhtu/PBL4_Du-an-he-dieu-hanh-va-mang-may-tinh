import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './pages/Shop';
import ShopCategory from './pages/ShopCategory/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Footer from './components/Footer/Footer';
import men_banner from './components/assets/banner_mens.png';
import Login from './pages/LoginSignup/Login';
import Register from './pages/LoginSignup/Register';
import ForgetPassword from './pages/LoginSignup/ForgetPassword';
import ResetPassword from './pages/LoginSignup/ResetPassword';
import authService from './services/auth.service';
import { ReusableToastContainer } from './components/Notification/Notification';

const TokenManager = () => {
    useEffect(() => {
        authService.checkAuthToken();
    }, []);
    return null;
}

function App() {
    return (
        <div>
            <BrowserRouter>
                <ReusableToastContainer />
                <TokenManager />
                <Navbar/>
                <Routes>
                    <Route path ='/' element={<Shop/>}/>
                    <Route path ='/all-products' element={<ShopCategory banner={men_banner} category="allproducts"/>}/>
                    <Route path ="/product" element={<Product/>}>
                        <Route path=':productId' element={<Product/>}/>
                    </Route>
                    <Route path='/cart' element={<Cart/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/forget-password' element={<ForgetPassword/>}/>
                    <Route path='/reset-password' element={<ResetPassword/>}/>
                </Routes>
                <Footer/>
            </BrowserRouter>
        </div>
    );
}
export default App

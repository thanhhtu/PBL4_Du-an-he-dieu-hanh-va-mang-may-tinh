import React, { useContext, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar'
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';
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
import {ReusableToastContainer} from './components/Notification/Notification';
import Profile from './pages/Profile/Profile';
import Order from './components/Order/Order';
import { PrivateAuthRoute, PrivateCartRoute } from './services/PrivateRoute';
import Receipt from './components/Receipt/Receipt';

const TokenManager = () => {
    useEffect(() => {
        authService.checkAuthToken()
    }, []);
    return null;
};

const RouterForApp = () => {
    const location = useLocation();
    const isInvoicePage = location.pathname.startsWith('/receipt');
    return (
        <div>
            <ReusableToastContainer />
            <TokenManager />
            {!isInvoicePage && <Navbar />}
            <Routes>
                <Route path="/" element={<Shop />} />
                <Route
                    path="/all-products"
                    element={
                        <ShopCategory
                            banner={men_banner}
                            category="allproducts"
                        />
                    }
                />
                <Route path="/product" element={<Product />}>
                    <Route path=":productId" element={<Product />} />
                </Route>
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/profile/*" element={<Profile />} />

                <Route element={<PrivateCartRoute />}>
                    <Route path="/order" element={<Order />} />
                </Route>

                <Route element={<PrivateAuthRoute />}>
                    <Route path="/receipt" element={<Receipt />} />
                </Route>
            </Routes>
            {!isInvoicePage && <Footer />}
        </div>
    );
};

function App() {
    return (
        <div>
            <BrowserRouter>
                <RouterForApp />
            </BrowserRouter>
        </div>
    );
};

export default App;

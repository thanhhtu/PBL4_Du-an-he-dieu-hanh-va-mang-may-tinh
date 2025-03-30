import {  useEffect, useState } from "react";
import authService from "./auth.service";
import { Outlet, useNavigate } from "react-router-dom";
import { errorToast } from "../components/Notification/Notification";

export const PrivateAuthRoute = () => {
    const token = authService.getExpiredItem('auth-token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
        errorToast('Please login to continue');
        navigate('/');
        }
    }, [token, navigate]);

    return token ? <Outlet /> : null;
};

export const PrivateCartRoute = () => {
    const token = authService.getExpiredItem('auth-token');

    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:4000/cart', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            const data = await response.json();
            
            if (data.success) {
                setCartItems(data.data);
                if (data.data.length === 0) {
                    errorToast('Cart is empty. Please add items to cart first');
                    navigate('/');
                    return;
                }
            } else {
                errorToast(data.message);
                window.location.replace('/');
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    useEffect(() => {
        if (!token) {
            errorToast('Please login to continue');
            navigate('/');
            return;
        }
        fetchCart();
    }, [token, navigate]);

    return (cartItems || cartItems.length !== 0) ? <Outlet /> : null;
};
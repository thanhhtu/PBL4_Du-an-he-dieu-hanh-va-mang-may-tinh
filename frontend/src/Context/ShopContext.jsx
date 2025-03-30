import React, { createContext, useState, useEffect } from 'react';
import { errorToast, successToast } from '../components/Notification/Notification';
import authService from '../services/auth.service';

export const ShopContext = createContext(null);

const getDefaultCart = (allProducts) => {
    let cart = {};
    for (let i = 0; i < allProducts.length + 1; i++) {
        cart[i] = 0;   
    }
    return cart;
}

const ShopContextProvider = (props) => {
    //List products
    const [allProducts, setAllProducts] = useState([]);
    const fetchProduct = async () => {
        try {
            const response = await fetch('http://localhost:4000/product', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })

            const data = await response.json();
            
            if (data.success) {
                setAllProducts(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    //Cart
    const [cartItems, setCartItems] = useState([]);
    const fetchCart = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
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
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    useEffect(() => {
        fetchProduct();
        if(localStorage.getItem('auth-token')){
            fetchCart();
        }
    }, []);

    //Add to cart
    const addToCart = async (productId, newQuantity) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/cart/${productId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({Quantity: newQuantity})
            });
    
            const data = await response.json();
            
            if (data.success) {
                successToast(data.message);
                fetchCart();
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    }

    //Update cart item
    const updateCartItem = async (productId, newQuantity) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({Quantity: newQuantity})
            });
    
            const data = await response.json();
            
            if (data.success) {
                successToast(data.message);
                fetchCart();
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    }

    //Remove form cart
    const removeFromCart = async (productId) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            const data = await response.json();
            
            if (data.success) {
                successToast(data.message);
                fetchCart();
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    }

    const getTotalCartAmount = () => {
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.ProductPrice * item.CartQuantity,
            0
        );
        return totalAmount;
    };

    const getTotalCartItems= () => {
        return cartItems.length;
    }

    useEffect(() => {}, [cartItems]);

    const contextValue = {getTotalCartItems, getTotalCartAmount, allProducts, cartItems, addToCart, updateCartItem, removeFromCart, fetchCart};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;

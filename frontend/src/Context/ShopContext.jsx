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

    // useEffect(() => {
    //     fetchProduct();
    //     if(localStorage.getItem('auth-token')){
    //         fetchCart();
    //         console.log('bbbb:', cartItems); //không có giá trị cập nhật
    //     }
    // }, []);

    useEffect(() => {
        fetchProduct();
        if(localStorage.getItem('auth-token')){
            fetchCart();
        }
    }, []);
    
    // useEffect(() => {
    //     if (localStorage.getItem('auth-token')) {
    //         fetchCart();
    //         console.log('bbbb:', cartItems);
    //     }
    // }, [allProducts]);




    //Add to cart
    const addToCart = (itemId) => {
        // console.log("Item ID:", itemId); // Kiểm tra xem itemId có hợp lệ không
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: prev[itemId] + 1 };
            // console.log("Updated Cart:", updatedCart); // Kiểm tra trạng thái mới
            return updatedCart;
        });

        // if(localStorage.getItem('auth-token')){
        //     fetch('http://localhost:4000/add-to-cart', {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/form-data',
        //             'auth-token': `${localStorage.getItem('auth-token')}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({'itemId': itemId})
        //     })
        //     .then((res) => res.json)
        //     .then((data) => {
        //         console.log(data)
        //     })
        // }
    }

    //Update cart item
    const updateCartItem = async (cartId, newQuantity) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/cart/${cartId}`, {
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
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        // if(localStorage.getItem('auth-token')){
        //     fetch('http://localhost:4000/remove-from-cart', {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/form-data',
        //             'auth-token': `${localStorage.getItem('auth-token')}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({'itemId': itemId})
        //     })
        //     .then((res) => res.json)
        //     .then((data) => {
        //         console.log(data)
        //     })
        // }
    }

    const getTotalCartAmount = () => {
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.ProductPrice * item.Quantity,
            0
        );
        return totalAmount;
    };

    const getTotalCartItems= () => {
        return cartItems.length;
    }

    //useEffect để log ra giá trị của cartItems mỗi khi nó thay đổi
    useEffect(() => {
        // console.log("Cart Items Updated:", cartItems);
    }, [cartItems]);

    const contextValue = {getTotalCartItems, getTotalCartAmount, allProducts, cartItems, addToCart, updateCartItem, removeFromCart};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;

import React, { createContext, useState, useEffect } from 'react';
import all_product from '../components/assets/all_product';

export const ShopContext = createContext(null);
// let all_product = []; 

const getDefaultCart = () => {
    // console.log(all_product)
    let cart = {};
    for (let i = 0; i < 300 + 1; i++) {
        cart[i] = 0;   
    }
    return cart;
}

const ShopContextProvider = (props) => {
    // const [all_product, setAll_product] = useState([]);

    const [cartItems, setCartItems] = useState(getDefaultCart());


    // useEffect(() => {
    //     fetch('http://localhost:4000/allproducts')
    //     .then((res) => res.json())
    //     .then((data) => setAll_product(data.products));

    //     if(localStorage.getItem('auth-token')){
    //         fetch('http://localhost:4000/getcart', {
    //             method: 'POST',
    //             header: {
    //                 Accept: 'application/form-data',
    //                 'auth-token': `${localStorage.getItem('auth-token')}`,
    //                 'Content-type': 'application/json'
    //             },
    //             body: '',
    //         })
    //         .then((res) => res.json())
    //         .then((data) => setCartItems(data));
    //     }
    // }, []);

    //Add to cart
    const addToCart = (itemId) => {
        console.log("Item ID:", itemId); // Kiểm tra xem itemId có hợp lệ không
        setCartItems((prev) => {
            const updatedCart = { ...prev, [itemId]: prev[itemId] + 1 };
            console.log("Updated Cart:", updatedCart); // Kiểm tra trạng thái mới
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
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount; // Di chuyển return ra ngoài vòng lặp
    };

    const getTotalCartItems= () => {
        let totalItem = 0;
        for(const item in cartItems){
            if (cartItems[item]>0){
                totalItem+= cartItems[item];
            }
        }
        return totalItem;
    }

    //useEffect để log ra giá trị của cartItems mỗi khi nó thay đổi
    useEffect(() => {
        console.log("Cart Items Updated:", cartItems);
    }, [cartItems]);

    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;

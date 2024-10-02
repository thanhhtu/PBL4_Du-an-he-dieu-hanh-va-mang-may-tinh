import React, { createContext, useState, useEffect } from 'react';
import all_product from '../components/assets/all_product';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < all_product.length; index++) {
    cart[index] = 0;   
  }
  return cart;
}

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // Hàm thêm vào giỏ hàng
  const addToCart = (itemId) => {
    console.log("Item ID:", itemId); // Kiểm tra xem itemId có hợp lệ không
    setCartItems((prev) => {
      const updatedCart = { ...prev, [itemId]: prev[itemId] + 1 };
      console.log("Updated Cart:", updatedCart); // Kiểm tra trạng thái mới
      return updatedCart;
    });
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
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

  // useEffect để log ra giá trị của cartItems mỗi khi nó thay đổi
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

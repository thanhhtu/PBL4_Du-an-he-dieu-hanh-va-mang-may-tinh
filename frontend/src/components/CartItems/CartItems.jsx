import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';

const CartItems = () => {
    const {getTotalCartAmount, cartItems, updateCartItem, removeFromCart} = useContext(ShopContext);
    
    const handleQuantityChange = (productId, quantity) => {
        const quantityNum = parseInt(quantity) || 0;
        if (quantityNum >= 0) {
            updateCartItem(productId, quantityNum);
        }
    };

    const handleQuantityAdjust = (productId, action) => {
        const currentItem = cartItems.find(item => item.ProductId === productId);
        
        if (currentItem) {
            let quantity = currentItem.CartQuantity;
            
            if (action === 'increase') {
                quantity += 1;
            } else if (action === 'decrease') {
                quantity = Math.max(1, quantity - 1);
            }
            
            updateCartItem(productId, quantity);
        }
    };

    const formattedPrice = (price) => {
        const newPrice = price;
        return new Intl.NumberFormat('vi-VN').format(newPrice);
    }

    return (
        <div className='cartItems'>
            <div className='cartItems-format-main'>
                <p>Product</p>
                <p>Name</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr/>
            {cartItems.map((cartItem) => {
                return (
                    <div key={cartItem.CartId}>
                        <div className='cartItems-format cartItems-format-main'>
                            <img src={cartItem.ProductImgUrl} alt={cartItem.ProductName} className='cartIcon-product-icon' />
                            
                            <p>{cartItem.ProductName}</p>
                            
                            <p>{formattedPrice(cartItem.ProductPrice)} VND</p>

                            <div className='cartItems-quantity'>
                                <div className='quantity'>
                                    <button 
                                        onClick={() => handleQuantityAdjust(cartItem.ProductId, 'decrease')}
                                        disabled={cartItem.CartQuantity === 1}
                                    > - </button>
                                    <input 
                                        type='number' 
                                        pattern="\d*"
                                        inputMode="numeric"
                                        value={cartItem.CartQuantity}
                                        onChange={(e) => {
                                            const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
                                            handleQuantityChange(cartItem.ProductId, sanitizedValue);
                                        }}
                                        min="1"
                                    />
                                    <button 
                                        onClick={() => handleQuantityAdjust(cartItem.ProductId, 'increase')}
                                        disabled={cartItem.CartQuantity === cartItem.ProductQuantity}
                                    > + </button>
                                </div>
                                <div className='product-quantity'>{cartItem.ProductQuantity} products left</div>
                            </div>
                            <p>{formattedPrice(cartItem.ProductPrice * cartItem.CartQuantity)} VND</p>

                            <p onClick={() => removeFromCart(cartItem.ProductId)} className='cartItems-icon cartItems-remove-icon'>
                                <i className='fa-solid fa-trash' />
                            </p>

                        </div>
                        <hr />
                    </div>
                );
            })}
            <div className='cartItems-down'>
                <div className='cartItems-total'>
                    <h1>Cart Totals</h1>
                    <div>
                        <div className='cartItems-total-item'>
                            <p>Subtotal</p>
                            <p>{formattedPrice(getTotalCartAmount())} VND</p>
                        </div>
                        <hr/>
                        <div className='cartItems-total-item'>
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr/>
                        <div className='cartItems-total-item'>
                            <h3>Total</h3>
                            <h3>{formattedPrice(getTotalCartAmount())} VND</h3>
                        </div>
                    </div>
                    <button>PROCEED TO CHECKOUT</button>
                </div>
                <div className='cartItems-promoCode'>
                    <p>If you have a promo code, enter it here</p>
                    <div className='cartItems-promoBox'>
                        <input type='text' placeholder='promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;

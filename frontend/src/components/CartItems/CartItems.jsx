import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
// import remove_icon from '../assets/cart_cross_icon.png';

const CartItems = () => {
    const {getTotalCartAmount, cartItems, updateCartItem} = useContext(ShopContext);
    
    const handleQuantityChange = (cartId, newQuantity) => {
        const quantity = parseInt(newQuantity) || 0;
        if (quantity >= 0) {
            updateCartItem(cartId, quantity);
        }
    };

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
                            
                            <p>{cartItem.ProductPrice} VND</p>
                            
                            <input 
                                className='cartItems-quantity' 
                                type='number' 
                                value={cartItem.Quantity} 
                                onChange={(e) => handleQuantityChange(cartItem.ProductId, e.target.value)}
                            />
                            
                            <p>{(cartItem.ProductPrice * cartItem.Quantity).toFixed(2)} VND</p>

                            <p onClick={() => removeProduct(product.ProductId)} className='cartItems-icon cartItems-remove-icon'>
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
                            <p>{getTotalCartAmount()} VND</p>
                        </div>
                        <hr/>
                        <div className='cartItems-total-item'>
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr/>
                        <div className='cartItems-total-item'>
                            <h3>Total</h3>
                            <h3>{getTotalCartAmount()} VND</h3>
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

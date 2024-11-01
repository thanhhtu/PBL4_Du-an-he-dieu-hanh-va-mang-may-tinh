import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../assets/cart_cross_icon.png';

const CartItems = () => {
    const { all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext);

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr/>
            {all_product.map((product) => {
                if (cartItems[product.id] > 0) {
                    return (
                        <div key={product.id}>
                        <div className="cartitems-format cartitems-format-main">
                            {/* Hiển thị hình ảnh sản phẩm */}
                            <img src={product.image} alt={product.name} className='carticon-product-icon' />
                            
                            {/* Tên sản phẩm */}
                            <p>{product.name}</p>
                            
                            {/* Giá sản phẩm */}
                            <p>${product.new_price}</p>
                            
                            {/* Số lượng sản phẩm trong giỏ hàng */}
                            <button className='cartitems-quantity'>{cartItems[product.id]}</button>
                            
                            {/* Tổng tiền */}
                            <p>${(product.new_price * cartItems[product.id]).toFixed(2)}</p>
                            
                            {/* Nút xóa sản phẩm */}
                            <img className='cartitems-remove-icon' 
                                src={remove_icon} 
                                onClick={() => removeFromCart(product.id)} 
                                alt="Remove item" 
                            />
                        </div>
                        <hr />
                        </div>
                    );
                }
                return null; 
            })}
            <div className="cartitem-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className='cartitems-total-item'>
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <button>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code, enter it here</p>
                    <div className='cartitems-promobox'>
                        <input type="text" placeholder='promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;

import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './Order.css';
import { errorToast, successToast } from '../Notification/Notification';
import authService from '../../services/auth.service';
import { Link, useNavigate } from 'react-router-dom';
import { formattedPrice } from '../../services/formatNum.service';

const Order = () => {
    const {getTotalCartAmount, cartItems} = useContext(ShopContext);
    
    const [shippingInfoItem, setShippingInfoItem] = useState([]);

    const transformCartItems = () => {
        return cartItems.map(item => ({
            ProductId: item.ProductId,
            Quantity: item.CartQuantity,
            PriceAtOrder: item.ProductPrice
        }));
    };

    const [formData, setFormData] = useState({
        ShippingId: '',
        PaymentMethod: 'Cash on Delivery',
        OrderProducts: ''
    });
    
    //shipping information
    const fetchShippingInfo = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch('http://localhost:4000/shipping-information/default', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            const data = await response.json();
            
            if (data.success) {
                setShippingInfoItem(data.data);

                setFormData(prev => ({
                    ...prev,
                    ShippingId: data.data.ShippingId
                }));
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    useEffect(() => {
        if(localStorage.getItem('auth-token')){
            fetchShippingInfo();
        }
    }, []);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            OrderProducts: transformCartItems()
        }));
    }, [cartItems]);

    const handlePaymentChange = (method) => {
        setFormData(prev => ({
            ...prev,
            PaymentMethod: method
        }));
    };

    const navigate = useNavigate();
    //add order
    const fetchAddOrder = async () => {
        let resData;
        const token = authService.getExpiredItem('auth-token');
        await fetch('http://localhost:4000/order', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',  
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
        .then((res) => res.json())
        .then((data) => resData = data);

        if(resData.success){
            successToast('Order successfully');
            navigate(`/profile/order`);
        }else{
            errorToast(resData.message);
        }
    };

    return (
        <div className='order-container'>
            {/* <div className='order-container-header'>CHECKOUT</div> */}

            {/* Address */}
            <div className='order-section'>
                <div className='order-header'>
                    <i className='fa-solid fa-location-dot' />
                    <span>Shipping Address</span>
                </div>
                <div className='order-address-content'>
                    <span className='order-address-name'>{shippingInfoItem.Name}</span>
                    <span>{shippingInfoItem.PhoneNumber}</span>
                    <span>{shippingInfoItem.Address}</span>
                    <a href='#' className='order-change-address'>Change</a>
                </div>
            </div>

            {/* products in cart */}
            <div className='order-section'>
                <div className='order-header'>
                    <i className='fa-solid fa-cart-shopping'/>
                    <span>Products</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style={{textAlign: 'left'}}>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(cartItem => (
                            <tr key={cartItem.CartId}>
                                <td>
                                    <div className='order-product-info'>
                                        <img src={cartItem.ProductImgUrl} alt={cartItem.ProductName} />
                                        <p>{cartItem.ProductName}</p>
                                    </div>
                                </td>

                                <td>{formattedPrice(cartItem.ProductPrice)} VND</td>
                                
                                <td>{cartItem.CartQuantity}</td>

                                <td>{formattedPrice(cartItem.ProductPrice * cartItem.CartQuantity)} VND</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment method */}
            <div className='order-section'>
                <div className='order-header'>
                    <i className='fa-solid fa-file-invoice'/> 
                    <span>Payment Method</span>
                </div>

                <div className='order-payment-options'>
                    <label className='order-payment-option order-space-bottom'>
                        <input 
                            type='radio' 
                            name='payment' 
                            defaultChecked
                            onChange={() => handlePaymentChange('Cash on Delivery')}
                        />
                        <span>Cash on Delivery</span>
                    </label>
                    <label className='order-payment-option'>
                        <input 
                            type='radio' 
                            name='payment'
                            onChange={() => handlePaymentChange('E-Wallet')}
                        />
                        <span>E-Wallet</span>
                    </label>
                </div>
            </div>

            {/* Checkout */}
            <div className='order-section order-checkout'>
                <div className='order-checkout-name'>
                    <div className='order-space-bottom'>Subtotal</div>
                    <div className='order-space-bottom'>Shipping Fee</div>
                    <div>Total</div>
                </div>

                <div className='order-checkout-price'>
                    <div className='order-space-bottom'>{formattedPrice(getTotalCartAmount())} VND</div>
                    <div className='order-space-bottom'>Free</div>
                    <div className='order-checkout-total'>{formattedPrice(getTotalCartAmount())} VND</div>
                </div>
            </div>

            {/* Submit */}
            <div className='order-section order-submit'>
                <div className='order-submit-text'>Clicking "Order" means you agree to comply with TTShop's Terms and Conditions.</div>
                
                <button 
                    className='order-submit-btn'
                    onClick={fetchAddOrder}
                >
                    ORDER
                </button>
            </div>
        </div>
    );
};

export default Order;
import React, { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext);

    const formattedPrice = (price) => {
        const newPrice = price;
        return new Intl.NumberFormat('vi-VN').format(newPrice);
    }

    const [newQuantity, setNewQuantity] = useState(1);

    const handleQuantityChange = (quantity) => {
        const parsedQuantity = parseInt(quantity) || 1;
        const limitedQuantity = Math.min(
            Math.max(parsedQuantity, 1), 
            product.Quantity
        );
        setNewQuantity(limitedQuantity);
    };

    const handleQuantityAdjust = (action) => {
        let quantity = newQuantity;
            
        if (action === 'increase') {
            quantity = Math.min(product.Quantity, quantity + 1);
        } else if (action === 'decrease') {
            quantity = Math.max(1, quantity - 1);
        }
        
        setNewQuantity(quantity);
    };

    //get all reviews
    const [allReviews, setAllReviews] = useState([]); 
    const handleAllReviews = async () => {
        try {
            const response = await fetch(`http://localhost:4000/review/${product.ProductId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
    
            const data = await response.json();
            
            if (data.success) {
                setAllReviews(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };
    useEffect(() => {
        handleAllReviews();
    }, []);
    const sumRating = allReviews.reduce((sum, review) => sum + review.Rating, 0)
    const averageRating = Math.round(sumRating / allReviews.length); 

    return (
        <div className='productDisplay'>
            <div className='productDisplay-left'>
                <div className='productDisplay-img-list'>
                    <img src={product.ImageUrl} alt='' />
                    <img src={product.ImageUrl} alt='' />
                    <img src={product.ImageUrl} alt='' />
                </div>
                <div className='productDisplay-img'>
                    <img className='productDisplay-main-img' src={product.ImageUrl} alt='' />
                </div>
            </div>
            <div className='productDisplay-right'>
                <h1>{product.ProductName}</h1>
                <div className='productDisplay-right-starts'>
                    <div className='review-star'>
                        {'★'.repeat(averageRating)}
                        {'☆'.repeat(5 - averageRating)}
                    </div>
                    
                    <p>({allReviews.length})</p>
                </div>

                <div className='productDisplay-right-prices'>{formattedPrice(product.Price)} VND</div>
                
                <div className='productDisplay-right-description'>
                    A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.
                </div>

                <div className='productDisplay-right-safe'>
                    <i className='fa-regular fa-circle-check' />
                    <div>Enjoy worry-free shopping with TTShop</div>
                </div>

                <div className='productDisplay-right-quantity'>
                    <div className='productDisplay-quantity'>
                        <button 
                            onClick={() => handleQuantityAdjust('decrease')}
                            disabled={newQuantity === 1}
                        > - </button>
                        <input 
                            type='number' 
                            pattern='\d*'
                            inputMode='numeric'
                            value={newQuantity}
                            onChange={(e) => {
                                const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
                                handleQuantityChange(sanitizedValue);
                            }}
                            min='1'
                            max={product.Quantity}
                        />
                        <button 
                            onClick={() => handleQuantityAdjust('increase')}
                            disabled={newQuantity === product.Quantity}
                        > + </button>
                    </div>
                    <div className='productDisplay-product-quantity'>{product.Quantity} products left</div>
                </div>

                <button 
                    className='productDisplay-right-btn'
                    onClick={() => addToCart(product.ProductId, newQuantity)}
                >ADD TO CART</button>

            </div>
        </div>
    )
};

export default ProductDisplay;

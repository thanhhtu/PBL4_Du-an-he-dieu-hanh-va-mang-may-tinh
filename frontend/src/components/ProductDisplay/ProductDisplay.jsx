import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_dull_icon from '../assets/star_dull_icon.png'
import star_icon from '../assets/star_icon.png'
import { ShopContext } from '../../Context/ShopContext'

const ProductDisplay = (props) => {
    const {product} = props;
    const {addToCart} = useContext(ShopContext);
    return (
        <div className='productDisplay'>
            <div className="productDisplay-left">
                <div className="productDisplay-img-list">
                    <img src={product.ImageUrl} alt="" />
                    <img src={product.ImageUrl} alt="" />
                    <img src={product.ImageUrl} alt="" />
                </div>
                <div className="productDisplay-img">
                    <img className='productDisplay-main-img' src={product.ImageUrl} alt="" />
                </div>
            </div>
            <div className="productDisplay-right">
                <h1>{product.ProductName}</h1>
                <div className="productDisplay-right-start">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productDisplay-right-prices">
                <div className="productDisplay-right-price-old">${product.Price}</div>
                <div className="productDisplay-right-price-new">${product.Quantity}</div>
                </div>
                <div className="productDisplay-right-description">
                    A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.
                </div>
                <div className="productDisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productDisplay-right-sizes">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                        <div>XX</div>
                    </div>
                </div>
                <button onClick={()=>{addToCart(product.ProductId)}}>ADD TO CART</button>
                <p className='productDisplay-right-category'>
                    <span>Category: </span>
                    Women, T-Shirt, Crop
                    <br></br>
                    <span>Tag </span>
                    Modern, latest
                </p>
            </div>
        </div>
    )
}

export default ProductDisplay

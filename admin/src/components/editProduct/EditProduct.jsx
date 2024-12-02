import React, { useState } from 'react';
import './EditProduct.css';
import upload_area from '../../assets/upload_area.svg';
import authService from '../../services/auth.service';
import { errorToast, successToast } from '../notification/Notification';

const EditProductPopup = ({ product, onClose, fetchInfo }) => {
    //product detail
    const [productDetail, setProductDetail] = useState({
        ProductName: product.ProductName,
        Description: product.Description,
        Price: product.Price,
        Quantity: product.Quantity
    });

    const productHandler = (e) => {
        setProductDetail({
            ...productDetail, 
            [e.target.name]: e.target.value
        })
    };

    //image
    const [image, setImage] = useState(null);
    const imageHandler = (e) => {
        if(image !== product.ImageUrl){
            setImage(e.target.files[0]);
        }
    };

    //edit product
    const editProduct = async (productId) => {
        try {
            const formData = new FormData();
            for (let key in productDetail) {
                formData.append(key, productDetail[key]);
            }
            if(image){
                formData.append('image', image);
            }

            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            })
    
            const data = await response.json();

            if (data.success) {
                successToast(data.message);
            } else {
                errorToast(data.message);
            }
            onClose();
            fetchInfo();
        } catch (error) {
            errorToast(error.message);
            onClose();
        };
    }

    return (
        <div className='edit-product'>
            <div className='edit-product-content'>
                <div className='edit-product-header'>
                    <h2>EDIT PRODUCT</h2>
                    <button onClick={onClose} className='close-btn'>&times;</button>
                </div>

                <div className='edit-product-body'>
                    <div className='editProduct-itemField'>
                        <p>Product title</p>
                        <input 
                            value={productDetail.ProductName} 
                            onChange={productHandler} 
                            type='text' 
                            name='ProductName' 
                            placeholder='Type here' 
                        />
                    </div>
                    <div className='editProduct-itemField'>
                        <p>Product description</p>
                        <textarea 
                            value={productDetail.Description} 
                            onChange={productHandler} 
                            name='Description' 
                            placeholder='Type here' 
                        />
                    </div>
                    <div className='editProduct-price'>
                        <div className='editProduct-itemField'>
                            <p>Price</p>
                            <input 
                                value={productDetail.Price} 
                                onChange={productHandler} 
                                type='text' 
                                name='Price' 
                                placeholder='Type here' 
                            />
                        </div>
                        <div className='editProduct-itemField'>
                            <p>Quantity</p>
                            <input 
                                value={productDetail.Quantity} 
                                onChange={productHandler} 
                                type='text' 
                                name='Quantity' 
                                placeholder='Type here' 
                            />
                        </div>
                    </div>
                    <div className='editProduct-itemField editProduct-img'>
                        <label htmlFor='edit-file-input'>
                            <img 
                                src={image ? URL.createObjectURL(image) : (product.ImageUrl || upload_area)} 
                                alt='upload area' 
                                className='editProduct-thumbnail-img' 
                            />
                        </label>
                        <input 
                            onChange={imageHandler} 
                            type='file' 
                            accept='image/*' 
                            name='image' 
                            id='edit-file-input' 
                            hidden 
                        />
                    </div>
                </div>

                <div className='edit-product-footer'>
                    <button onClick={() => editProduct(product.ProductId)} className='update-btn'>UPDATE</button>
                    <button onClick={onClose} className='cancel-btn'>CANCEL</button>
                </div>
            </div>
        </div>
    );
};

export default EditProductPopup;
import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import authService from '../../services/auth.service';
import { ReusableToastContainer, errorToast, successToast } from '../notification/Notification';

const AddProduct = () => {
    //product detail
    const [productDetail, setProductDetail] = useState({
        'ProductName': '',
        'Description': '',
        'Price': '',
        'Quantity': ''
    });

    const productHandler = (e) => {
        setProductDetail({
            ...productDetail, 
            [e.target.name]: e.target.value
        })
    };

    //image
    const [image, setImage] = useState(false);
    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const addProduct = async () => {
        try {
            let formData = new FormData();
            for (let key in productDetail) {
                formData.append(key, productDetail[key]);
            }
            formData.append('image', image);            

            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/product`, {
                method: 'POST',
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
        } catch (error) {
            errorToast(error.message);
        }
    };

    return (
        <div className="add-product">
            <div className='add-product-header'>
                <h1>ADD PRODUCT</h1>
            </div>
            
            <div className='add-product-body'>
                <div className="addProduct-itemField">
                    <p>Product title</p>
                    <input 
                        value={productDetail.ProductName} 
                        onChange={productHandler} 
                        type='text' 
                        name='ProductName' 
                        placeholder='Type here' 
                    />
                </div>
                <div className="addProduct-itemField">
                    <p>Product description</p>
                    <textarea  
                        value={productDetail.Description} 
                        onChange={productHandler} 
                        type='text' 
                        name='Description' 
                        placeholder='Type here' 
                    />
                </div>
                <div className="addProduct-price">
                    <div className="addProduct-itemField">
                        <p>Price</p>
                        <input 
                            value={productDetail.Price} 
                            onChange={productHandler} 
                            type='text' 
                            name='Price' 
                            placeholder='Type here' 
                        />
                    </div>
                    <div className="addProduct-itemField">
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
                <div className="addProduct-itemField">
                    <label htmlFor="file-input">
                        <img 
                            src={image ? URL.createObjectURL(image) : upload_area} 
                            alt='upload area' 
                            className='addProduct-thumbnail-img' 
                        />
                    </label>
                    <input 
                        onChange={imageHandler} 
                        type='file' 
                        accept='image/*' 
                        name='image' 
                        id='file-input' 
                        hidden 
                    />
                </div>
            </div>

            <div className='add-product-footer'>
                <button onClick={() => {addProduct()}} className='addProduct-btn'>ADD</button>
            </div>
            
            <ReusableToastContainer />
        </div>
    )
};

export default AddProduct;

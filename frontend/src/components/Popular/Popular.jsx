import React, { useEffect, useState } from 'react';
import './Popular.css';
// import data_product from '../assets/data';
import Item from '../Item/Item';
import { errorToast } from '../Notification/Notification';

const Popular = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const fetchNewCollection = async () => {
        try {
            const response = await fetch('http://localhost:4000/product/popular', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
    
            const data = await response.json();
            
            if (data.success) {
                setPopularProducts(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    useEffect(() => {
        fetchNewCollection();
    }, []);

    return (
        <div className='popular'>
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className="popular-item">
                {popularProducts.map((item) => {
                    return (
                        <Item 
                            key={item.ProductId}  // Using item.id as the key
                            id={item.ProductId} 
                            name={item.ProductName} 
                            image={item.ImageUrl} 
                            price={item.Price}
                            quantity={item.Quantity}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Popular;

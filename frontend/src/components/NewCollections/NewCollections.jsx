import React, { useEffect, useState } from 'react';
import './NewCollections.css';
// import new_collection from '../assets/new_collections'
import Item from '../Item/Item';
import { errorToast } from '../Notification/Notification';

const NewCollections = () => {
    const [newCollection, setNewCollection] = useState([]);
    const fetchNewCollection = async () => {
        try {
            const response = await fetch('http://localhost:4000/product/new-collection', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
    
            const data = await response.json();
            
            if (data.success) {
                setNewCollection(data.data);
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
        <div className='new-collections'>
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className='collections'>
                {newCollection.map((item, i) => {
                    return (
                        <Item
                            key={item.ProductId}  // Using item.id as the key
                            id={item.ProductId} 
                            name={item.ProductName} 
                            image={item.ImageUrl} 
                            price={item.Price}
                            quantity={item.Quantity}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default NewCollections

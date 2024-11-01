import React, { useEffect, useState } from 'react'
import './NewCollections.css'
import new_collection from '../assets/new_collections'
import Item from '../Item/Item';

const NewCollections = () => {
    // const [new_collection, setNew_coleciton] = useState([]);
    
    // useEffect(() => {
    //     fetch('http://localhost:4000/new-collection')
    //     .then((res) => res.json())
    //     .then((data) => setNew_coleciton(data.products))
    // }, []);
    
    return (
        <div className='new-collections'>
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className='collections'>
                {new_collection.map((item, i) => {
                    return (
                        <Item
                            key={item.id}  // Using item.id as the key
                            id={item.id} 
                            name={item.name} 
                            image={item.image} 
                            new_price={item.new_price}
                            old_price={item.old_price}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default NewCollections

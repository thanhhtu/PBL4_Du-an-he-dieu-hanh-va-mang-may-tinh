import React, { useContext } from 'react';
import './RelatedProducts.css';
// import data_product from '../assets/data'
import Item from '../Item/Item';
import { ShopContext } from '../../Context/ShopContext';

const RelatedProducts = () => {
    const {allProducts} = useContext(ShopContext);
    return (
        <div className='relatedProducts'>
            <h1>
                Related Products
            </h1>
            <hr />
            <div className="relatedProducts-item">
                {allProducts.map((item, i)=>{
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

export default RelatedProducts

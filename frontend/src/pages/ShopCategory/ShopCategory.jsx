import React, { useContext } from 'react';
import './ShopCategory.css'
import { ShopContext } from '../../Context/ShopContext';
import dropdown_icon from '../../components/assets/dropdown_icon.png'
import Item from '../../components/Item/Item'

const ShopCategory = (props) => {
    const {allProducts} = useContext(ShopContext);
    return (
        <div className='shop-category'>
            <img className='shopCategory-banner' src={props.banner} alt="Banner" />
            <div className='shopCategory-indexSort'>
            <p>
                <span>Showing 1-12</span> out of 36 products
            </p>
            <div className='shopCategory-sort'>
                Sort by <img src={dropdown_icon} alt="" />
            </div>
            </div>
            <div className="shopCategory-product">
                {allProducts.map((item, i)=>{
                    // if (props.category === "allProducts" || props.category === item.category) {
                        return (
                            <Item
                                key={item.ProductId}  // Using item.id as the key
                                id={item.ProductId} 
                                name={item.ProductName} 
                                image={item.ImageUrl} 
                                price={item.Price}
                                quantity={item.Quantity}
                            /> )
                    // }
                    // else{
                    //     return null;
                    // }
                })}
            </div>
            <div className="shopCategory-loadMore">
                Explore More
            </div>
        </div>
    );
};

export default ShopCategory;
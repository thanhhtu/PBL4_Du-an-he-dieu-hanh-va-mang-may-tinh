import React from "react";
import { Link } from 'react-router-dom'; // Ensure this is imported
import './Item.css';

const Item = (props) => { 
    return (
        // <div className='item'>
            <Link to={`/product/${props.id}`}>
                <div className='item'>
                    <img onClick={window.scrollTo(0,0)} src={props.image} alt={props.name} />
                    <div className='item-name-price'>
                        <p>{props.name}</p>
                        <div className="item-prices">
                            <div className="item-price-new">
                                ${props.price}
                            </div>
                            <div className="item-price-old">
                                ${props.quantity}
                            </div>
                        </div>
                    </div>
                </div>
                
            </Link>
            // <div className='item-name-price'>
            //     <p>{props.name}</p>
            //     <div className="item-prices">
            //         <div className="item-price-new">
            //             ${props.new_price}
            //         </div>
            //         <div className="item-price-old">
            //             ${props.old_price}
            //         </div>
            //     </div>
            // </div>
        // </div>
    );
}

export default Item;

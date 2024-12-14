import React from "react";
import { Link } from 'react-router-dom'; // Ensure this is imported
import './Item.css';

const Item = (props) => { 
    const formattedPrice = (price) => {
        const newPrice = price;
        return new Intl.NumberFormat('vi-VN').format(newPrice);
    }

    return (
        <Link to={`/product/${props.id}`}>
            <div className='item'>
                <img onClick={window.scrollTo(0,0)} src={props.image} alt={props.name} />
                <div className='item-name-price'>
                    <p>{props.name}</p>
                    <div className="item-prices">
                        <div className="item-price-new">
                            {formattedPrice(props.price)} VND
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default Item;

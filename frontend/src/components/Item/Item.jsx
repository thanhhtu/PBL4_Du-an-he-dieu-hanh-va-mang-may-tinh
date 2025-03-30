import React from "react";
import { Link } from 'react-router-dom'; // Ensure this is imported
import './Item.css';
import { formattedPrice } from "../../services/formatNum.service";

const Item = (props) => { 
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

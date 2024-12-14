import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../../assets/product_cart.svg';
import list_products_icon from '../../assets/product_list_icon.svg';
import manage_users_icon from '../../assets/manage_users_icon.svg';


const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-item">
                <Link to={'/management/add-product'} style={{textDecoration: "none"}}>
                    <img src={add_product_icon} alt="product icon" />
                    <p>Add Product</p>
                </Link>
            </div>
            
            <div className="sidebar-item">
                <Link to={'/management/list-products'} style={{textDecoration: "none"}}>
                    <img src={list_products_icon} alt="product icon" />
                    <p>Product List</p>
                </Link>
            </div>
            
            <div className="sidebar-item">
                <Link to={'/management/manage-users'} style={{textDecoration: "none"}}>
                    <img src={manage_users_icon} alt="product icon" />
                    <p>Manage Users</p>
                </Link>
            </div>
        </div>
    )
};

export default Sidebar;

import React, {useContext, useState} from 'react';
import './Navbar.css'
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
    const [menu, setMenu] = useState("shop")
    const {getTotalCartItems}= useContext(ShopContext);

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="" />
                <p>TT SHOP</p>
            </div>

            <ul className="nav-menu">
                <li onClick={() => {setMenu("home")}}>
                        <Link style= {{textDecoration: 'none'}} to ='/'>Home</Link> 
                        {menu === "home" ? <hr/> : <></>}
                    </li>
                    <li onClick={() => {setMenu("all products")}}>
                        <Link style= {{ textDecoration: 'none'}} to ='/allproducts'>All products</Link> 
                        {menu === "all products" ? <hr/> : <></>}
                    </li>
                </ul> 
            <div className="nav-login-cart">
                <Link to='/login'><button>Login</button></Link>
                <Link to  ='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    );
};

export default Navbar;
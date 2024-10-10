import React, {useState} from 'react';
import './Navbar.css'
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'

const Navbar = () => {
    const [menu, setMenu] = useState("shop")

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="" />
                <p>TT SHOP</p>
            </div>

            <ul className="nav-menu">
                <li onClick={() => {setMenu("home")}}>
                        Home {menu === "home" ? <hr/> : <></>}
                    </li>
                    <li onClick={() => {setMenu("all products")}}>
                        All products {menu === "all products" ? <hr/> : <></>}
                    </li>
                </ul> 

            <div className="nav-login-cart">
                <button>Login</button>
                <img src={cart_icon} alt="" />
                <div className="nav-cart-count">0</div>
            </div>
        </div>
    );
};

export default Navbar;
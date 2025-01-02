import React, {useContext, useState, useEffect} from 'react';
import './Navbar.css'
import logo from '../assets/logo.png'
import cart_icon from '../assets/cart_icon.png'
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import authService from '../../services/auth.service';

const Navbar = () => {
    const [menu, setMenu] = useState('home')
    const {getTotalCartItems}= useContext(ShopContext);

    const [name, setName] = useState('');
    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="" />
                <p>TT SHOP</p>
            </div>

            <ul className='nav-menu'>
                <li onClick={() => {setMenu('home')}}>
                    <Link style= {{textDecoration: 'none'}} to ='/'>Home</Link> 
                    {menu === 'home' ? <hr/> : <></>}
                </li>
                <li onClick={() => {setMenu('all products')}}>
                    <Link style= {{ textDecoration: 'none'}} to ='/all-products'>All products</Link> 
                    {menu === 'all products' ? <hr/> : <></>}
                </li>
            </ul> 
            
            <div className='nav-name-login-cart'>
                <div className='nav-name-login'>
                    {name ? 
                        <Link style= {{textDecoration: 'none'}} to ='/profile'>
                            <div className='nav-name'>Hi {name}</div>
                        </Link> 
                        : <div className='nav-name'>Hi Guest</div>
                    }

                    {authService.getExpiredItem('auth-token')
                        ? <button onClick={() => {
                            localStorage.removeItem('auth-token');
                            localStorage.removeItem('name')
                            window.location.replace('/');
                        }}>Logout</button>

                        : <Link to ='/login'><button>Login</button></Link>
                    }
                </div>
                

                <Link to ='/cart'><img src={cart_icon} alt='' /></Link>
                <div className='nav-cart-count'>{getTotalCartItems()}</div>
            </div>
        </div>
    );
};

export default Navbar;
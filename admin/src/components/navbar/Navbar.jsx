import React, { useState, useEffect } from 'react';
import './Navbar.css';
import navLogo from '../../assets/nav-logo.svg';
import localstorageService from '../../services/auth.service';

const Navbar = () => {
    const [name, setName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    return (
        <div className="navbar">
            <img src={navLogo} alt="nav logo" className="nav-logo" />
            <div className="nav-login">
                <div>Hi {name || 'Guest'}</div>

                {localstorageService.getExpiredItem('auth-token') ? (
                    <button
                        onClick={() => {
                            localStorage.removeItem('auth-token')
                            localStorage.removeItem('name')
                            window.location.replace('/')
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Navbar;

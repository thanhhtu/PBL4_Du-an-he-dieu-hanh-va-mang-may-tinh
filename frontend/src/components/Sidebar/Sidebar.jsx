import React from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const navigationItems = [
        {
            path: '/profile/account',
            icon: 'fa-solid fa-gear',
            label: 'General Information'
        },
        {
            path: '/profile/reset-password',
            icon: 'fa-solid fa-key',
            label: 'Reset Password'
        },
        {
            path: '/profile/address',
            icon: 'fa-solid fa-location-dot',
            label: 'Addresses'
        },
        {
            path: '/profile/order',
            icon: 'fa-solid fa-bag-shopping',
            label: 'Orders'
        }
    ];

    return (
        <div className='sidebar'>
            <h1 className='sidebar-header'>USER SETTINGS</h1>

            <nav className='sidebar-nav-menu'>
                {navigationItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <i className={item.icon} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    )
};

export default Sidebar;

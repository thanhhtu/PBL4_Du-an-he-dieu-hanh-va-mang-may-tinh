import React from 'react';
import './Management.css';
import Sidebar from '../../components/sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AddProduct from '../../components/addProduct/AddProduct';
import ListProducts from '../../components/listProducts/ListProducts';
import ManageUsers from '../../components/manageUsers/ManageUsers';
import Navbar from '../../components/navbar/Navbar';

const Management = () => {
    return (
        <div className='management'>
            <Navbar />
            <div className='management-content'>
                <Sidebar />
                <Routes>
                    <Route path='/add-product' element={<AddProduct />} />
                    <Route path='/list-products' element={<ListProducts />} />
                    <Route path='/manage-users' element={<ManageUsers />} />
                </Routes>
            </div>
            
        </div>
    )
};

export default Management;


import React from 'react';
import Navbar from './components/navbar/Navbar';
import Admin from './pages/admin/Admin';
import { Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <div>
            <Navbar/>
            <Admin />
        </div>
    )
};

export default App;

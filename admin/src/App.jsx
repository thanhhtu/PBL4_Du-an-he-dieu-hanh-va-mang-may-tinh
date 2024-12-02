import React, { useEffect } from 'react';
import Login from './pages/login/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Management from './pages/management/Management';
import localstorageService from './services/auth.service';

const ProtectedRoute = ({ children }) => {
    const token = localstorageService.getExpiredItem('auth-token');
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return children;
}

const TokenManager = () => {
    useEffect(() => {
        localstorageService.checkAuthToken();
    }, []);
    return null;
}

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <TokenManager />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/management/*"
                        element={
                            <ProtectedRoute>
                                <Management />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;

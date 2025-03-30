import React, { useEffect, useState } from 'react';
import './ProfileAccount.css';
import { errorToast } from '../Notification/Notification.jsx';
import authService from '../../services/auth.service.js';
import { format } from 'date-fns';

const ProfileAccount = () => {
    const [userInfo, setUserInfo] = useState({
        FullName: '',
        Email: '',
        CreatedAt: ''
    });

    // Hàm format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
        } catch (error) {
            return '';
        }
    };

    // Hàm lấy thông tin user
    const fetchUserInfo = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch('http://localhost:4000/user/me', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            
            if (data.success) {
                setUserInfo(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchUserInfo();
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className='user-container'>
            <div className='user-header'>
                <h2>GENERAL INFORMATION</h2>
            </div>

            <div className='user-body'>
                <div className='user-itemField'>
                    <p>Full Name</p>
                    <input
                        value={userInfo.FullName || ''}
                        onChange={handleInputChange}
                        type='text'
                        name='FullName'
                        placeholder='Type here'
                        readOnly
                    />
                </div>

                <div className='user-itemField'>
                    <p>Email</p>
                    <input
                        value={userInfo.Email || ''}
                        onChange={handleInputChange}
                        name='Email'
                        placeholder='Type here'
                        readOnly
                    />
                </div>

                <div className='user-itemField'>
                    <p>Created At</p>
                    <input
                        value={formatDate(userInfo.CreatedAt)}
                        type='text'
                        name='CreatedAt'
                        placeholder='Type here'
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileAccount;
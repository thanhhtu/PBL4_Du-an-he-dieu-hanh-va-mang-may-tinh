import React, { useEffect, useState } from 'react';
import './ManageUsers.css';
import authService from '../../services/auth.service';
import { ReusableToastContainer, errorToast, successToast } from '../notification/Notification';
import Pagination from '../Pagination/Pagination';

const ManageUsers = () => {
    const [allUsers, setAllUsers] = useState([]);

    //list users
    const fetchInfo = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch('http://localhost:4000/user', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
    
            const data = await response.json();
            
            if (data.success) {
                setAllUsers(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    //delete user
    const deleteUser = async (userId) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
    
            const data = await response.json();
            
            if (data.success) {
                successToast(data.message);
                fetchInfo();
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5; //5 users per page

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(allUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='manage-user'>
            <h1>MANAGE USERS</h1>
            <div className='manageUser-format-main'>
                <p>No.</p>
                <p>ID</p>
                <p>Full Name</p>
                <p>Email</p>
                <p>Phone Number</p>
                <p>Remove</p>
            </div>
            <div className='manageUser-allUsers'>
                <hr />
                {currentUsers.map((user, index) => {
                    const no = index + (currentPage - 1) * usersPerPage + 1;
                    return (
                        <div key={index} className='manageUser-format-main manageUser-format'>
                            <p>{no}</p>
                            <p>{user.Id}</p>
                            <p>{user.FullName}</p>
                            <p>{user.Email}</p>
                            <p>{user.PhoneNumber}</p>
                            <div onClick={() => deleteUser(user.Id)} className='manageUser-remove-icon'>
                                <i className='fa-solid fa-trash'></i>
                            </div>
                        </div>
                )})}
            </div>

            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                paginate={paginate} 
            />
            <ReusableToastContainer />
        </div>
    );
};

export default ManageUsers;

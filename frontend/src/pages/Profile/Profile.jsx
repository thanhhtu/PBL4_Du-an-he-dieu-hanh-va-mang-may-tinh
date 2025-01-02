import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './Profile.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import ProfileAccount from '../../components/ProfileAccount/ProfileAccount'
import ProfilePassword from '../../components/ProfilePassword/ProfilePassword'
import ProfileAddress from '../../components/ProfileAddress/ProfileAddress'
import ProfileOrder from '../../components/ProfileOrder/ProfileOrder'

const Profile = () => {
    return (
        <div className='profile-container'>
            <Sidebar />
            <div className='profile-main-content'>
                <Routes className='profile-content'>
                    <Route path='/account' element={<ProfileAccount />} />
                    <Route path='/password' element={<ProfilePassword />} />
                    <Route path='/address' element={<ProfileAddress />} />
                    <Route path='/order' element={<ProfileOrder />} />
                </Routes>
            </div>
        </div>
    )
}

export default Profile

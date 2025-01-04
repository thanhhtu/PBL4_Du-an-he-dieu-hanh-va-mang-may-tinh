import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './Profile.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import ProfileAccount from '../../components/ProfileAccount/ProfileAccount'
import ProfileShipping from '../../components/ProfileShipping/ProfileShipping'
import ProfileOrder from '../../components/ProfileOrder/ProfileOrder'

const Profile = () => {
    return (
        <div className="profile-container">
            <Sidebar />
            <div className="profile-main-content">
                <Routes className="profile-content">
                    <Route path="/" element={<Navigate to="/profile/account" replace />} />
                    <Route path="/account" element={<ProfileAccount />} />
                    <Route
                        path="/shipping-information"
                        element={<ProfileShipping />}
                    />
                    <Route path="/order" element={<ProfileOrder />} />
                </Routes>
            </div>
        </div>
    )
}

export default Profile

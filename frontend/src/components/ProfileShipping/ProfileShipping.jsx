import React, { useEffect, useState } from 'react';
import { Phone, Edit, Trash } from 'lucide-react';
import './ProfileShipping.css';
import Pagination from '../Pagination/Pagination.jsx';
import { errorToast, successToast } from '../Notification/Notification.jsx';
import authService from '../../services/auth.service.js';
import DeleteConfirmPopup from '../DeleteConfirm/DeleteConfirm.jsx';
import EditProfileShippingPopup from '../EditProfileShipping/EditProfileShipping.jsx';
import AddProfileShippingPopup from '../AddProfileShipping/AddProfileShipping.jsx';

const ShippingInfoLabel = ({
    name,
    phone,
    address,
    isDefault,
    onSetDefault,
    onUpdate,
    onDelete,
}) => {
    return (
        <div className='shipping-label'>
            <div className='shipping-label-header'>
                <div className='shipping-label-title-section'>
                    <h3 className='shipping-label-name'>{name}</h3>
                    {isDefault && (
                        <span className='shipping-label-default-badge'>
                            Default
                        </span>
                    )}
                </div>

                <div className='shipping-label-action'>
                    <button onClick={onUpdate}>
                        <Edit />
                    </button>

                    {!isDefault && (
                        <button
                            onClick={onDelete}
                            className='shipping-label-del'
                        >
                            <Trash />
                        </button>
                    )}
                </div>
            </div>

            <p className='shipping-label-location'>{address}</p>

            <div className='shipping-label-phone-section'>
                <Phone size={16} />
                <span>{phone}</span>
            </div>

            {!isDefault && (
                <button
                    onClick={onSetDefault}
                    className='shipping-label-set-default'
                >
                    Set as default
                </button>
            )}
        </div>
    );
};

const ProfileShipping = () => {
    //show shipping information
    const [shippings, setAllShippings] = useState([]);
    const fetchShipping = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/shipping-information`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
            });

            const data = await response.json();

            if (data.success) {
                setAllShippings(data.data);
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    }

    useEffect(() => {
        fetchShipping();
    }, []);

    //add shipping info popup
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

    const openAddPopup = () => {
        setIsAddPopupOpen(true);
    }

    //edit shipping info popup
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [currentEditShipping, setCurrentEditShipping] = useState(null);

    const openEditPopup = (shipping) => {
        setCurrentEditShipping({ ...shipping });
        setIsEditPopupOpen(true);
    }

    //delete shipping info
    const [isDelConfirmPopupOpen, setIsDelConfirmPopupOpen] = useState(false);
    const [currentDelShipping, setCurrentDelShipping] = useState(null);

    const openDelConfirmPopup = (shippingId) => {
        setCurrentDelShipping(shippingId);
        setIsDelConfirmPopupOpen(true);
    };

    const deleteShipping = async (shippingId) => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/shipping-information/${shippingId}`, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
            });

            const data = await response.json();

            if (data.success) {
                successToast(data.message);
                fetchShipping();
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    };

    //change default shipping info
    const fetchDefaultShipping = async (shippingId) => {
        try {
            const token = authService.getExpiredItem('auth-token')
            const response = await fetch(`http://localhost:4000/shipping-information/default/${shippingId}`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
            });

            const data = await response.json();

            if (data.success) {
                successToast(data.message);
                fetchShipping();
            } else {
                errorToast(data.message);
            }
        } catch (error) {
            errorToast(error.message);
        }
    }

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const shippingPerPage = 3;

    const indexOfLastShipping = currentPage * shippingPerPage;
    const indexOfFirstShipping = indexOfLastShipping - shippingPerPage;
    const currentShippings = shippings.slice(indexOfFirstShipping, indexOfLastShipping);

    const totalPages = Math.ceil(shippings.length / shippingPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='shipping-container'>
            <div className='shipping-content'>
                <div className='shipping-header'>
                    <h2 className='shipping-header-title'>MY ADDRESSES</h2>
                    <button className='shipping-add' onClick={() => openAddPopup()}>
                        <span>+</span>
                        Add New Address
                    </button>
                </div>

                {currentShippings.map((shipping) => (
                    <ShippingInfoLabel
                        key={shipping.ShippingId}
                        name={shipping.Name}
                        phone={shipping.PhoneNumber}
                        address={shipping.Address}
                        isDefault={shipping.IsDefault}
                        onSetDefault={() => fetchDefaultShipping(shipping.ShippingId)}
                        onUpdate={() => openEditPopup(shipping)}
                        onDelete={() => openDelConfirmPopup(shipping.ShippingId)}
                    />
                ))}
            </div>     

            {/* Add popup */}
            {isAddPopupOpen && (
                <AddProfileShippingPopup
                    onClose={() => setIsAddPopupOpen(false)}
                    fetchInfo={fetchShipping}
                />
            )}       

            {/* Edit popup */}
            {isEditPopupOpen && currentEditShipping && (
                <EditProfileShippingPopup
                    product={currentEditShipping}
                    onClose={() => setIsEditPopupOpen(false)}
                    fetchInfo={fetchShipping}
                />
            )}

            {/* Delete confirm popup */}
            {isDelConfirmPopupOpen && currentDelShipping && (
                <DeleteConfirmPopup
                    itemId={currentDelShipping}
                    onClose={() => setIsDelConfirmPopupOpen(false)}
                    onDelete={deleteShipping}
                />
            )}

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
            />
        </div>
    )
}

export default ProfileShipping

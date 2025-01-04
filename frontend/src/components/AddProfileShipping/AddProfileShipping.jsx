import React, { useState } from 'react';
import './AddProfileShipping.css';
import authService from '../../services/auth.service';
import { errorToast, successToast } from '../Notification/Notification';

const AddProfileShippingPopup = ({ onClose, fetchInfo }) => {
    //shipping info detail
    const [shippingInfo, setShippingInfo] = useState({
        Name: '',
        PhoneNumber: '',
        Address: '',
    });

    //validate
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const isValidPhoneNumber = (phoneNumber) => {
        const regex = /^(0)([0-9]{9})$/; //start by 0
        return regex.test(phoneNumber);
    };
    
    const shippingHandler = (e) => {
        const { name, value } = e.target;
        
        setShippingInfo({
            ...shippingInfo, 
            [name]: value
        });

        //check phone number
        if (name === 'PhoneNumber') {
            if (!isValidPhoneNumber(value)) {
                setPhoneNumberError('Invalid phone number');
            } else {
                setPhoneNumberError('');
            }
        }
    };

    const isFormValid = () => {
        return (
            shippingInfo.Name.trim() !== '' &&
            shippingInfo.PhoneNumber.trim() !== '' && 
            isValidPhoneNumber(shippingInfo.PhoneNumber) &&
            shippingInfo.Address.trim() !== ''
        );
    };

    //add shipping info
    const fetchAddShipping = async () => {
        try {
            const token = authService.getExpiredItem('auth-token');
            const response = await fetch(`http://localhost:4000/shipping-information`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(shippingInfo),
            });

            const data = await response.json();

            if (data.success) {
                successToast(data.message);
            } else {
                errorToast(data.message);
            }
            onClose();
            fetchInfo();
        } catch (error) {
            errorToast(error.message);
            onClose();
        }
    };

    return (
        <div className='add-shipping'>
            <div className='add-shipping-content'>
                <div className='add-shipping-header'>
                    <h2>ADD SHIPPING ADDRESS</h2>
                    <button onClick={onClose} className='close-btn'>
                        &times;
                    </button>
                </div>

                <div className='add-shipping-body'>
                    <div className='editShipping-itemField'>
                        <p>Name</p>
                        <input
                            onChange={shippingHandler}
                            type='text'
                            name='Name'
                            placeholder='Type here'
                        />
                    </div>

                    <div className='editShipping-itemField'>
                        <p>Phone Number</p>
                        <input
                            className={phoneNumberError && 'error-info'}
                            onChange={shippingHandler}
                            name='PhoneNumber'
                            placeholder='Type here'
                        />
                        {phoneNumberError && <div className='error-message'>The phone number must have 10 numbers and start by 0</div>}
                    </div>

                    <div className='editShipping-price'>
                        <div className='editShipping-itemField'>
                            <p>Address</p>
                            <textarea
                                onChange={shippingHandler}
                                type='text'
                                name='Address'
                                placeholder='Type here'
                            />
                        </div>
                    </div>
                </div>

                <div className='add-shipping-footer'>
                     <button 
                        disabled={!isFormValid()} 
                        className={!isFormValid() ? 'update-disabled-button' : 'update-btn'} 
                        onClick={() => fetchAddShipping()}
                    >
                        ADD
                    </button>
                    <button onClick={onClose} className='cancel-btn'>
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddProfileShippingPopup

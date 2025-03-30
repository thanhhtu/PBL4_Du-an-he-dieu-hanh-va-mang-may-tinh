import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './loginRegister.css';
import { errorToast } from '../../components/Notification/Notification';

const ResetPassword = () => {
    //Toggle password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showPasswordHandler = () => {
        setShowPassword((state) => !state);
    };

    const showConfirmPasswordHandler = () => {
        setShowConfirmPassword((state) => !state);
    };

    //Register
    const location = useLocation();
    const [formData, setFormData] = useState({
        Email: location.state?.email,
        PasswordResetToken: '',
        NewPassword: '',
        ConfirmNewPassword: '',
    });

    const [passwordError, setPasswordError] = useState('');
    const changeHandler = (e) => {
        const { name, value } = e.target;
        
        setFormData(prevState => ({
            ...prevState, 
            [name]: value
        }));

        //check password
        if (name === 'ConfirmNewPassword') {
            if (formData.NewPassword !== value) {
                setPasswordError('Passwords not match');
            } else {
                setPasswordError('');
            }
        }

        if (name === 'NewPassword') {
            if (formData.ConfirmNewPassword && formData.ConfirmNewPassword !== value) {
                setPasswordError('Passwords not match');
            } else {
                setPasswordError('');
            }
        }
    };

    const isFormValid = () => {
        return (
            formData.PasswordResetToken.trim() !== '' &&
            formData.NewPassword.trim() !== '' &&
            formData.ConfirmNewPassword.trim() !== '' &&
            formData.NewPassword === formData.ConfirmNewPassword
        );
    };

    const register = async () => {
        try{
            let resData;
            await fetch('http://localhost:4000/auth/reset-password', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify(formData),
            })
            .then((res) => res.json())
            .then((data) => resData = data);
    
            if(resData.success){
                window.location.replace('/login');
            }else{
                errorToast(resData.message);
            }
        }catch(error){
            errorToast(resData.message);
        }
    };

    return (
        <div className='loginRegister'>
            <div className='loginRegister-container resetPassword-container'>
                <div className='resetPassword-header'>
                    <Link to={'/forget-password'} style={{textDecoration: 'none'}}>
                        <i className='fa-solid fa-arrow-left' />
                    </Link>
                    <h1>RESET PASSWORD</h1>
                </div>
                <div className='loginRegister-fields'>
                    <div>
                        <div className='otp'>A password reset email has been sent to your registered email address. Please check your inbox and enter the code</div>
                        <input
                            name='PasswordResetToken'
                            value={formData.PasswordResetToken}
                            onChange={changeHandler}
                            type='text'
                            placeholder='OTP'
                        />
                    </div>

                    <div className='password-wrapper'>
                        <input
                            name='NewPassword'
                            value={formData.NewPassword}
                            onChange={changeHandler}
                            type={showPassword ? 'text' : 'password'}
                            placeholder='New Password'
                        />
                        <span
                            className='toggle-password'
                            onClick={showPasswordHandler}
                        >
                            {showPassword ? (
                                <i className='fa-regular fa-eye' />
                            ) : (
                                <i className='fa-regular fa-eye-slash' />
                            )}
                        </span>
                    </div>

                    <div>
                        <div className='password-wrapper'>
                            <input
                                className={passwordError && 'error-info'}
                                name='ConfirmNewPassword'
                                value={formData.ConfirmNewPassword}
                                onChange={changeHandler}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='Confirm Password'
                                required
                            />
                            <span
                                className='toggle-password'
                                onClick={showConfirmPasswordHandler}
                            >
                                {showConfirmPassword ? (
                                    <i className='fa-regular fa-eye' />
                                ) : (
                                    <i className='fa-regular fa-eye-slash' />
                                )}
                            </span>
                        </div>
                        {passwordError && <div className='error-message'>The confirm password does not match</div>}
                    </div>
                </div>
                
                <button 
                    onClick={() => register()}
                    disabled={!isFormValid()} 
                    className={!isFormValid() ? 'disabled-button' : ''} 
                >
                    CONTINUE
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;

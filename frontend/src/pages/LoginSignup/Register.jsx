import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './loginRegister.css';
import authService from '../../services/auth.service';
import { errorToast } from '../../components/Notification/Notification';

const Register = () => {
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
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
        ConfirmPassword: '',
        FullName: '',
        PhoneNumber: ''
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        
        setFormData(prevState => ({
            ...prevState, 
            [name]: value
        }));

        if (name === 'ConfirmPassword') {
            if (formData.Password !== value) {
                setPasswordError('Mật khẩu xác nhận không khớp');
            } else {
                setPasswordError('');
            }
        }

        if (name === 'Password') {
            if (formData.ConfirmPassword && formData.ConfirmPassword !== value) {
                setPasswordError('Mật khẩu xác nhận không khớp');
            } else {
                setPasswordError('');
            }
        }
    };

    const register = async () => {
        try{
            let resData;
            await fetch('http://localhost:4000/auth/register', {
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
                console.log(resData)
                authService.setExpiredItem('auth-token', resData.token, Number(import.meta.env.VITE_EXPIRED_TOKEN));
                localStorage.setItem('name', resData.name);
                window.location.replace('/');
            }else{
                errorToast(resData.message);
            }
        }catch(error){
            errorToast(resData.message);
        }
    };

    return (
        <div className='loginRegister'>
            <div className='loginRegister-container'>
                <h1>REGISTER</h1>
                <div className='loginRegister-fields'>
                    <input 
                        name='Email' 
                        value={formData.Email} 
                        onChange={changeHandler}  
                        type='email' 
                        placeholder='Email Address' 
                    />

                    <div className='password-wrapper'>
                        <input
                            name='Password'
                            value={formData.Password}
                            onChange={changeHandler}
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password'
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
                
                    <div className='password-wrapper'>
                        <input
                            className={passwordError ? 'error-confirm-password' : ''}
                            name='ConfirmPassword'
                            value={formData.ConfirmPassword}
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
                 
                    <input 
                        name='FullName' 
                        value={formData.FullName} 
                        onChange={changeHandler}  
                        type='text' 
                        placeholder='Full Number' 
                    />
                    
                    <input 
                        name='PhoneNumber' 
                        value={formData.PhoneNumber} 
                        onChange={changeHandler}  
                        type='text' 
                        placeholder='Phone Number' 
                    />
                </div>
                
                <button onClick={() => register()}>Continue</button>
                
                <p className='loginRegister-login'>
                    Already have an account? 
                    <Link to={'/login'} style={{textDecoration: 'none'}}>
                        <span> Login here</span> 
                    </Link>
                </p> 
                
                <div className='loginRegister-agree'>
                    <input type='checkbox' name= '' id='' />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
            </div>
        </div>
    );
};

export default Register;

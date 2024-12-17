import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './loginRegister.css'
import authService from '../../services/auth.service';
import { errorToast } from '../../components/Notification/Notification';

const Login = () => {
    //Toggle password
    const [showPassword, setShowPassword] = useState(false);

    const showPasswordHandler = () => {
        setShowPassword((state) => !state);
    };

    //Login
    const [emailError, setEmailError] = useState('');
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;
        
        setFormData(prevState => ({
            ...prevState, 
            [name]: value
        }));


        //check email
        if (name === 'Email') {
            if (!isValidEmail(value)) {
                setEmailError('Invalid email address');
            } else {
                setEmailError('');
            }
        }
    };

    const isFormValid = () => {
        return (
            formData.Email.trim() !== '' && 
            isValidEmail(formData.Email) &&
            formData.Password.trim() !== ''
        );
    };

    const login = async () => {
        let resData;
        await fetch('http://localhost:4000/auth/login', {
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
            if (resData.roles.includes('user')){
                authService.setExpiredItem('auth-token', resData.token, Number(import.meta.env.VITE_EXPIRED_TOKEN));
                localStorage.setItem('name', resData.name);
                window.location.replace('/');
            } else {
                errorToast('User only');
            }
        }else{
            errorToast(resData.message);
        }
    };

    return (
        <form
            className='loginRegister'
            onSubmit={(e) => {
                e.preventDefault() //prevent default submit
                login()
            }}
        >
            <div className='loginRegister-container'>
                <h1>LOGIN</h1>
                <div className='loginRegister-fields'>
                    <div>
                        <input 
                            className={emailError && 'error-info'}
                            name='Email' 
                            value={formData.Email} 
                            onChange={changeHandler}  
                            type='email' 
                            placeholder='Email Address' 
                        />
                        {emailError && <div className='error-message'>The email address is invalid</div>}
                    </div>
                    
                    <div className='password-wrapper'>
                        <div className='password-wrapper-box'>
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

                        <Link to={'/forget-password'} style={{textDecoration: 'none'}}>
                            <div className='forget-password'>Forget Password</div>
                        </Link>
                    </div>
                </div>
                
                <button 
                    onClick={() => register()}
                    disabled={!isFormValid()} 
                    className={!isFormValid() ? 'disabled-button' : ''} 
                >
                    Continue
                </button>
                
                <p className='loginRegister-register'>
                    Create an account? 
                    <Link to={'/register'} style={{textDecoration: 'none'}}>
                        <span> Click here</span> 
                    </Link>
                </p> 
            </div>
        </form>
    );
};

export default Login;

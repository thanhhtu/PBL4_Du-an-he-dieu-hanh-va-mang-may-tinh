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
    const [emailError, setEmailError] = useState('');
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const [fullNameError, setFullNameError] = useState('');
    const isValidFullName = (fullName) => {
        const regex = /^[A-Za-zÀ-ÿ\s]+$/ ; 
        return regex.test(fullName);
    };
    
    const [passwordError, setPasswordError] = useState('');

    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
        ConfirmPassword: '',
        FullName: ''
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

        //check full name
        if (name === 'FullName') {
            if (!isValidFullName(value)) {
                setFullNameError('Invalid full name address');
            } else {
                setFullNameError('');
            }
        }

        //check password
        if (name === 'ConfirmPassword') {
            if (formData.Password !== value) {
                setPasswordError('Passwords not match');
            } else {
                setPasswordError('');
            }
        }

        if (name === 'Password') {
            if (formData.ConfirmPassword && formData.ConfirmPassword !== value) {
                setPasswordError('Passwords not match');
            } else {
                setPasswordError('');
            }
        }
    };

    const isFormValid = () => {
        return (
            formData.Email.trim() !== '' && 
            isValidEmail(formData.Email) &&
            formData.FullName.trim() !== '' && 
            isValidFullName(formData.FullName) &&
            formData.Password.trim() !== '' &&
            formData.ConfirmPassword.trim() !== '' &&
            formData.Password === formData.ConfirmPassword
        );
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
        <form 
            className='loginRegister'
            onSubmit={(e) => {
                e.preventDefault() //prevent default submit
                register()
            }}
        >
            <div className='loginRegister-container'>
                <h1>REGISTER</h1>
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

                    <div>
                        <input
                            className={fullNameError && 'error-info'}
                            name='FullName' 
                            value={formData.FullName} 
                            onChange={changeHandler}  
                            type='text' 
                            placeholder='Full Number' 
                        />
                        {fullNameError && <div className='error-message'>The full name is invalid</div>}
                    </div>

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

                    <div>
                        <div className='password-wrapper'>
                            <input
                                className={passwordError && 'error-info'}
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
                        {passwordError && <div className='error-message'>The confirm password does not match</div>}
                    </div>
                </div>
                
                <button 
                    disabled={!isFormValid()} 
                    className={!isFormValid() ? 'disabled-button' : ''} 
                >
                    CONTINUE
                </button>
                
                <p className='loginRegister-login'>
                    Already have an account? 
                    <Link to={'/login'} style={{textDecoration: 'none'}}>
                        <span> Login here</span> 
                    </Link>
                </p> 
                
                <div className='loginRegister-agree'>
                    <i className='fa-solid fa-check' />
                    <p>By continuing, you agree to terms of Service and Privacy Policy</p>
                </div>
            </div>
        </form>
    );
};

export default Register;

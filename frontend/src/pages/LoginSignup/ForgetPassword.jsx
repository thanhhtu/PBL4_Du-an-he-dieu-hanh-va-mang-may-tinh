import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './loginRegister.css';
import { errorToast } from '../../components/Notification/Notification';

const ForgetPassword = () => {
    //Forget password
    const [emailError, setEmailError] = useState('');
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const [formData, setFormData] = useState({
        Email: '',
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
            isValidEmail(formData.Email)
        );
    };

    const navigate = useNavigate();
    const login = async () => {
        try{
            let resData;
            await fetch('http://localhost:4000/auth/forget-password', {
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
                navigate('/reset-password', { 
                    state: { email: formData.Email } 
                });
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
                login()
            }}
        >
            <div className='loginRegister-container resetPassword-container'>
                <div className='resetPassword-header'>
                    <Link to={'/login'} style={{textDecoration: 'none'}}>
                        <i className='fa-solid fa-arrow-left' />
                    </Link>
                    <h1>RESET PASSWORD</h1>
                </div>
                
                <div className='loginRegister-fields resetPassword-fields'>
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

                <button 
                    onClick={() => register()}
                    disabled={!isFormValid()} 
                    className={!isFormValid() ? 'disabled-button' : ''} 
                >
                    CONTINUE
                </button>
            </div>
        </form>
    );
};

export default ForgetPassword;

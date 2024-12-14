import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './loginRegister.css'

const Register = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
        ConfirmPassword: '',
        FullName: '',
        PhoneNumber: ''
    });

    const changeHandler = (e) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        });
    };

    const register = async () => {
        console.log('sign up', formData);
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
            localStorage.setItem('auth-token', resData.token);
            window.location.replace('/');
        }else{
            alert(resData.error)
        }
    };

    return (
        <div className='loginRegister'>
            <div className="loginRegister-container">
                <h1>REGISTER</h1>
                <div className="loginRegister-fields">
                    <input name='Email' value={formData.Email} onChange={changeHandler}  type="email" placeholder='Email Address' />
                    <input name='Password' value={formData.Password} onChange={changeHandler}  type="password" placeholder='Password' />
                    <input name='ConfirmPassword' value={formData.ConfirmPassword} onChange={changeHandler}  type="password" placeholder='Confirm Password' />
                    <input name='FullName' value={formData.FullName} onChange={changeHandler}  type="text" placeholder='Full Number' />
                    <input name='PhoneNumber' value={formData.PhoneNumber} onChange={changeHandler}  type="text" placeholder='Phone Number' />
                </div>
                
                <button onClick={() => register()}>Continue</button>
                
                <p className="loginRegister-login">
                    Already have an account? 
                    <Link to={'/login'} style={{textDecoration: "none"}}>
                        <span> Login here</span> 
                    </Link>
                </p> 
                
                <div className="loginRegister-agree">
                    <input type="checkbox" name= '' id='' />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
            </div>
        </div>
    );
};

export default Register;

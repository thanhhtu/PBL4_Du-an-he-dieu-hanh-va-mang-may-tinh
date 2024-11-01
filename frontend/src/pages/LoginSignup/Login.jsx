import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginSignup.css'

const Login = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });

    const changeHandler = (e) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        });
    };

    const login = async () => {
        console.log('login', formData);
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
            localStorage.setItem('auth-token', resData.token);
            window.location.replace('/');
        }else{
            alert(resData.error)
        }
    };

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>LOGIN</h1>
                <div className="loginsignup-fields">
                    <input name='Email' value={formData.Email} onChange={changeHandler}  type="email" placeholder='Email Address' />
                    <input name='Password' value={formData.Password} onChange={changeHandler}  type="password" placeholder='Password' />
                </div>
                
                <button onClick={() => login()}>Continue</button>
                
                <p className="loginsignup-login">
                    Create an account? 
                    <Link to={'/register'} style={{textDecoration: "none"}}>
                        <span> Click here</span> 
                    </Link>
                </p> 
                
                <div className="loginsignup-agree">
                    <input type="checkbox" name= '' id='' />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
            </div>
        </div>
    );
};

export default Login;

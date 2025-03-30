import React, { useState } from 'react';
import './Login.css';
import authService from '../../services/auth.service';
import { errorToast, ReusableToastContainer } from '../../components/notification/Notification';

const Login = () => {
    //Toggle password
    const [showPassword, setShowPassword] = useState(false);

    const showPasswordHandler = () => {
        setShowPassword((state) => !state);
    };

    //Login
    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
    });

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
        .then((data) => (resData = data));

        if (resData.success) {
            if (resData.roles.includes('admin')) {
                authService.setExpiredItem('auth-token', resData.token, Number(import.meta.env.VITE_EXPIRED_TOKEN));
                localStorage.setItem('name', resData.name);
                window.location.replace('/management');
            } else {
                errorToast('Wrong email or password'); //only admin
            }
        } else {
            errorToast(resData.message);
        }
    }

    return (
        <form
            className="login"
            onSubmit={(e) => {
                e.preventDefault() //prevent default submit
                login()
            }}
        >
            <div className="login-container">
                <h1>ADMIN LOGIN</h1>
                <div className="login-fields">
                    <input
                        name="Email"
                        value={formData.Email}
                        onChange={changeHandler}
                        type="email"
                        placeholder="Email Address"
                    />
                    <div className="password-wrapper">
                        <input
                            name="Password"
                            value={formData.Password}
                            onChange={changeHandler}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                        />
                        <span
                            className="toggle-password"
                            onClick={showPasswordHandler}
                        >
                            {showPassword ? (
                                <i className="fa-regular fa-eye" />
                            ) : (
                                <i className="fa-regular fa-eye-slash" />
                            )}
                        </span>
                    </div>
                </div>

                <button type="submit">Continue</button>
            </div>
            <ReusableToastContainer />
        </form>
    );
};

export default Login;

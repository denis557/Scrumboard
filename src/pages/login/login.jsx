import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import '../main.css'
import './login.css'
import { isEmail } from '../../helpers/isEmail.js';
import axiosInstance from '../../helpers/axiosInstance.js';

function Login() {

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!isEmail(email)) {
            setError('Please enter a valid email.');
            return;
        }

        if(!password) {
            setError('Please enter the password');
            return
        }

        setError('');

        try{
            const response = await axiosInstance.post('/login', {
                email: email,
                password: password,
            });

            if(response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/scrumboard');
            }
        } catch(error) {
            if(error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occured. Please try again.')
            }
        }
    };

    return (
        <div className="main">
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleLogin} className='bodyLogin'>
                <h1 className='titleLogin'>Log in</h1>
                <input type='email' placeholder='Email' className='inputLogin' value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className='passwordLogin'>
                    <input type={isShowPassword ? 'text' : 'password'} placeholder='Password' className='inputPasswordLogin' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {isShowPassword ? 
                        <svg className='svg_70_65' width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={toggleShowPassword}> <path d="M5.93807 33.3721C5.73679 32.8103 5.73679 32.2032 5.93807 31.6415C9.98349 20.3396 21.4664 12.1875 34.9997 12.1875C48.5272 12.1875 60.0043 20.3315 64.0585 31.6279C64.2626 32.1885 64.2626 32.7952 64.0585 33.3585C60.016 44.6604 48.5331 52.8125 34.9997 52.8125C21.4722 52.8125 9.99224 44.6685 5.93807 33.3721Z" stroke="#0057FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> <path d="M43.75 32.5C43.75 34.6549 42.8281 36.7215 41.1872 38.2452C39.5462 39.769 37.3206 40.625 35 40.625C32.6794 40.625 30.4538 39.769 28.8128 38.2452C27.1719 36.7215 26.25 34.6549 26.25 32.5C26.25 30.3451 27.1719 28.2785 28.8128 26.7548C30.4538 25.231 32.6794 24.375 35 24.375C37.3206 24.375 39.5462 25.231 41.1872 26.7548C42.8281 28.2785 43.75 30.3451 43.75 32.5Z" stroke="#0057FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                    : 
                        <svg className='svg_70_65' width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={toggleShowPassword}> <path d="M11.6081 22.2706C8.87945 25.2611 6.84759 28.7441 5.64062 32.5C9.40896 44.2487 21.1281 52.8125 34.9998 52.8125C37.896 52.8125 40.696 52.4387 43.3502 51.7427M18.1648 16.8675C23.16 13.8067 29.015 12.1791 34.9998 12.1875C48.8715 12.1875 60.5877 20.7513 64.356 32.4946C62.2909 38.9115 57.8578 44.4481 51.8348 48.1325M18.1648 16.8675L8.74979 8.125M18.1648 16.8675L28.8106 26.7529M51.8348 48.1325L61.2498 56.875M51.8348 48.1325L41.189 38.2471C42.0015 37.4925 42.6461 36.5968 43.0859 35.6109C43.5256 34.6251 43.752 33.5684 43.752 32.5014C43.752 31.4343 43.5256 30.3776 43.0859 29.3918C42.6461 28.4059 42.0015 27.5102 41.189 26.7556C40.3764 26.0011 39.4117 25.4025 38.35 24.9942C37.2883 24.5858 36.1504 24.3757 35.0012 24.3757C33.8521 24.3757 32.7142 24.5858 31.6525 24.9942C30.5908 25.4025 29.6261 26.0011 28.8135 26.7556M41.186 38.2444L28.8165 26.7583" stroke="#B4B4B4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                    }
                </div>
                <button type='submit' className='submitLogin'>Log in</button>
            </form>
            <Link to='/signup' className='link'>
                Dont have an account? Sign up
            </Link>
        </div>
    )
}

export default Login
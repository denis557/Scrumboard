import React, { useState, useContext } from 'react';
import './addFriendModal.css'
import axiosInstance from '../../../helpers/axiosInstance.js';

function AddFriendModal({ handleAddFriend, getAllFriends }) {

    const [email, setEmail] = useState('');
    const [error, setError] = useState(null)

    const addFriend = async (e) => {
        e.preventDefault();

        if(!email) {
            setError('Email is required');
            return;
        }

        setError('');

        try {  
            const response = await axiosInstance.post('/add-friend', {
                email: email
            });

            if(response.data && response.data.friends) {
                getAllFriends();
                handleAddFriend();
            }
        } catch(error) {
            if(error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occured. Please try again.')
            }
        }
    }

    return(
        <div className='modal_body'>
            <div className='overlay' onClick={handleAddFriend}></div>
            <form className='modal' onSubmit={addFriend}>
                <div className='modal_header'>
                    <h3 className='modal_title'>Add friend</h3>
                    <svg onClick={handleAddFriend} className='modal_svg svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12.5 37.5L37.5 12.5M12.5 12.5L37.5 37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                </div>
                <hr className='modal_separator' />
                <p className='modal_email'>Email</p>
                <input type='email' className='modal_input' value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type='submit' className='modal_submit'>Add</button>
                {error && <p className='error_modal'>{error}</p>}
            </form>
        </div>
    )
}

export default AddFriendModal
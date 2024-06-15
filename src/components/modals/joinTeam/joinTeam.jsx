import React, { useState } from 'react';
import axiosInstance from '../../../helpers/axiosInstance.js';
// import './createTeam.css';

function JoinTeamPopup({ toggleIsJoinModal, getTeamInfo, getUserInfo }) {
    const [id, setId] = useState('')
    const [error, setError] = useState('');

    const handleJoinTeam = async (e) => {
        e.preventDefault();

        if(!id) {
            setError('Please enter an ID');
            return;
        }

        setError('');

        try{
            const response = await axiosInstance.post('/join-board', {boardId: id});

            if(response.data && response.data.error) {
                setError(response.data.message);
                return;
            }

            if(response.data && response.data.userInfo) {
                getTeamInfo();
                getUserInfo();
                toggleIsJoinModal();
            }
        } catch(error) {
            if(error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Internal Server Error');
            }
        }
    }

    return (
        <div>
            <div className='modal_body'>
            <div className='overlay' onClick={toggleIsJoinModal}></div>
                <form className='modal_create_board' onSubmit={handleJoinTeam}>
                    <div className='modal_create_header'>
                        <h3 className='modal_title'>Join team</h3>
                        <svg onClick={toggleIsJoinModal} className='modal_svg svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12.5 37.5L37.5 12.5M12.5 12.5L37.5 37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                    </div>
                    <hr className='modal_create_separator' />
                    <p className='modal_name'>ID</p>
                    <input type='text' className='modal_create_input' value={id} onChange={(e) => setId(e.target.value)} />
                    <hr className='modal_create_separator' />
                    <button type='submit' className='modal_create_submit'>Join</button>
                    {error && <p className='error_modal'>{error}</p>}
                </form>
            </div>
        </div>
    )
}

export default JoinTeamPopup
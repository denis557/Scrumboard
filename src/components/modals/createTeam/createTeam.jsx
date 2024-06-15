import React, { useState } from 'react';
import './createTeam.css';
import axiosInstance from '../../../helpers/axiosInstance.js';

function CreateTeamPopup({ toggleIsCreateModal, getTeamInfo, getUserInfo }) {
    const [name, setName] = useState('')
    const [error, setError] = useState('');

    const handleCreateTeam = async (e) => {
        e.preventDefault();

        if(!name) {
            setError('Please enter name');
            return;
        }

        setError('');

        try{
            const response = await axiosInstance.post('/create-board', {name: name});

            if(response.data && response.data.error) {
                setError(response.data.message);
                return;
            }

            if(response.data && response.data.board) {
                getTeamInfo();
                toggleIsCreateModal();
                getUserInfo();
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
            <div className='overlay' onClick={toggleIsCreateModal}></div>
                <form className='modal_create_board' onSubmit={handleCreateTeam}>
                    <div className='modal_create_header'>
                        <h3 className='modal_title'>Create team</h3>
                        <svg onClick={toggleIsCreateModal} className='modal_svg svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12.5 37.5L37.5 12.5M12.5 12.5L37.5 37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                    </div>
                    <hr className='modal_create_separator' />
                    <p className='modal_name'>Name</p>
                    <input type='text' className='modal_create_input' value={name} onChange={(e) => setName(e.target.value)} />
                    <hr className='modal_create_separator' />
                    <button type='submit' className='modal_create_submit'>Create</button>
                    {error && <p className='error_modal'>{error}</p>}
                </form>
            </div>
        </div>
    )
}

export default CreateTeamPopup
import React, { useState } from 'react';
import './addTask.css';
import axiosInstance from '../../../helpers/axiosInstance.js';

function AddTask({ toggleIsAddTask, getTeamInfo, getUserInfo, boardId, blockId }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const createTask = async (e) => {
        e.preventDefault();
        try{
            const response = await axiosInstance.post('/add-task/' + boardId + '/' + blockId, {title: name})
            if(response.data && response.data.blockInfo) {
                getTeamInfo();
                getUserInfo();
                toggleIsAddTask();
            }
        } catch(error) {
            console.log(error)
        }
    }

    return(
        <div className='modal_body'>
            <div className='overlay' onClick={toggleIsAddTask}></div>
            <form className='addBlock_modal' onSubmit={(e) => createTask(e)}>
                <div className='modal_create_header'>
                    <h3 className='modal_title'>Create task</h3>
                    <svg onClick={toggleIsAddTask} className='modal_svg svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12.5 37.5L37.5 12.5M12.5 12.5L37.5 37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                </div>
                <hr className='modal_create_separator' />
                <p className='modal_name'>Name</p>
                <input type='text' className='modal_create_input' value={name} onChange={(e) => setName(e.target.value)} />
                <hr className='modal_create_separator' />
                <button type='submit' className='modal_create_submit'>Create</button>
                {error && <p className='error_modal'>{error}</p>}
            </form>
        </div>
    )
}

export default AddTask
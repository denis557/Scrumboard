import React, { useContext, useEffect, useState } from "react";
import "./editTask.css";
import { daysSinceDate } from "../../../helpers/daysLeft.js";
import { UserContext } from "../../../contexts/userContext.jsx";
import axiosInstance from "../../../helpers/axiosInstance.js";

function EditTask({ toggleIsEditTask, getTeamInfo, boardId, blockId, task, currentBoard, isTeamBoard, getUserInfo}) {

  let daysLeft = daysSinceDate(task);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [name, setName] = useState(task.title);
  const [currentBlock, setCurrentBlock] = useState(blockId);
  const [description, setDescription] = useState(task.description);
  const [newDate, setNewDate] = useState(new Date(task.date).toISOString().slice(0, 16));
  const [completed, setCompleted] = useState(task.completed);
  const [isChanged, setIsChanged] = useState(false);

  const checkIsChanged = () => {
    if(name == task.title && currentBlock == blockId && description == task.description && newDate == new Date(task.date).toISOString().slice(0, 16) && completed == task.completed) {
      setIsChanged(false);
    } else {
      setIsChanged(true);
    }
  }

  useEffect(() => {
    checkIsChanged();
    daysLeft = daysSinceDate(task);
  }, [name, currentBlock, description, newDate, completed])

  useEffect(() => {
    daysLeft = daysSinceDate(task);
  }, [newDate])

  const editTask = async (e) => {
    e.preventDefault();
    try{
      const response = await axiosInstance.put('/edit-task/' + boardId + '/' + blockId + '/' + task._id, {
        title: name,
        description: description,
        date: newDate,
        block: currentBlock,
        completed: completed,
        isTeamBoard
      })
      if(response.data && response.data.taskInfo) {
        getTeamInfo();
        toggleIsEditTask();
        getUserInfo();
      }
    } catch(error) {
      console.log(error)
    }
  }

  const deleteTask = async () => {
    try {
      const response = await axiosInstance.delete('/delete-task/' + boardId + '/' + blockId + '/' + task._id, {
        isTeamBoard
      });
      getTeamInfo();
      toggleIsEditTask();
      getUserInfo();
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="modal_body">
      <div className="overlay" onClick={toggleIsEditTask}></div>
      <form className="edit_task" onSubmit={editTask}>
        <div className="edit_task_header">
          <input onChange={(e) => setName(e.target.value)} value={name} />
          <svg className='modal_svg svg_50' onClick={toggleIsEditTask} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12.5 37.5L37.5 12.5M12.5 12.5L37.5 37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
        </div>
        <hr />
        <div className='edit_task_option_div'>
          <svg className='svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.75 9.375V40.625M31.25 9.375V40.625M8.59375 40.625H41.4062C42.7 40.625 43.75 39.575 43.75 38.2812V11.7187C43.75 10.425 42.7 9.375 41.4062 9.375H8.59375C7.3 9.375 6.25 10.425 6.25 11.7187V38.2812C6.25 39.575 7.3 40.625 8.59375 40.625Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <select className='edit_task_select' value={currentBlock} onChange={(e) => setCurrentBlock(e.target.value)}>
            {isTeamBoard ? 
              currentBoard.blocks.map(block => <option value={block._id} className='edit_task_option' key={block._id}>{block.name}</option>)
            :
              userInfo.personalBoardSchema.blocks.map(block => <option value={block._id} className='edit_task_option' key={block._id}>{block.name}</option>)
            }
          </select>
        </div>
        <hr />
        <div className='edit_task_desc'>
          <div className='edit_task_desc_header'>
            <svg className='svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.8125 14.0625H42.1875M7.8125 25H42.1875M7.8125 35.9375H25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p>Description</p>
          </div>
            <textarea placeholder="Your description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <hr />
        <div className='edit_task_time'>
          <svg className='svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 12.5V25H34.375M43.75 25C43.75 27.4623 43.265 29.9005 42.3227 32.1753C41.3805 34.4502 39.9993 36.5172 38.2582 38.2582C36.5172 39.9993 34.4502 41.3805 32.1753 42.3227C29.9005 43.265 27.4623 43.75 25 43.75C22.5377 43.75 20.0995 43.265 17.8247 42.3227C15.5498 41.3805 13.4828 39.9993 11.7417 38.2582C10.0006 36.5172 8.61953 34.4502 7.67726 32.1753C6.73498 29.9005 6.25 27.4623 6.25 25C6.25 20.0272 8.22544 15.2581 11.7417 11.7417C15.2581 8.22544 20.0272 6.25 25 6.25C29.9728 6.25 34.7419 8.22544 38.2582 11.7417C41.7746 15.2581 43.75 20.0272 43.75 25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {daysLeft >= 2 ? 
          (<div className='edit_task_status'>Processing</div>)
          : daysLeft == 1 ?
          (<div className='edit_task_status_soon'>Due soon</div>)
          : (<div className='edit_task_status_over'>Overdue</div>)}
          <input type='datetime-local' value={newDate} onChange={(e) => setNewDate(e.target.value)} className='edit_task_date' />
          <div className='edit_task_completed'>
            <input type='checkbox' checked={completed} onChange={() => setCompleted(!completed)} />
            <p>Completed</p>
          </div>
        </div>
        <hr />
        <div className='edit_task_buttons'>
          <button className='edit_task_delete' type='button' onClick={() => deleteTask()}>Delete</button>
          <button type='submit' className='edit_task_save' disabled={!isChanged}>Save</button>
        </div>
      </form>
    </div>
  );
}

export default EditTask;
import React from "react";
import "./editTask.css";

function EditTask() {
  return (
    <div className="modal_body">
      <div className="overlay"></div>
      <form className="edit_task">
        <div className="edit_task_header">
          <p>Optimize perfomance</p>
          <svg className='modal_svg svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12.5 37.5L37.5 12.5M12.5 12.5L37.5 37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
        </div>
        <hr />
        <div className='edit_task_option_div'>
          <svg className='svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.75 9.375V40.625M31.25 9.375V40.625M8.59375 40.625H41.4062C42.7 40.625 43.75 39.575 43.75 38.2812V11.7187C43.75 10.425 42.7 9.375 41.4062 9.375H8.59375C7.3 9.375 6.25 10.425 6.25 11.7187V38.2812C6.25 39.575 7.3 40.625 8.59375 40.625Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <select className='edit_task_select'>
            <option className='edit_task_option'>TODO</option>
            <option className='edit_task_option'>IN PROGRESS</option>
            <option className='edit_task_option'>DONE</option>
          </select>
        </div>
        <hr />
        <div className='edit_task_desc'>
          <div className='edit_task_desc_header'>
            <svg className='svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.8125 14.0625H42.1875M7.8125 25H42.1875M7.8125 35.9375H25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p>Description</p>
          </div>
            <textarea placeholder="Your description" >
            {/* <p> */}
            {/* In this task, you will focus on optimizing our website's performance to
            enhance user experience and boost search engine rankings. Your
            technical skills and knowledge of web performance best practices will */}
            {/* be critical in identifying and resolving performance bottlenecks.

            Collaboration with the web development and design teams will ensure Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Odio, corrupti?Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius eum voluptates voluptatibus
             molestiae nesciunt vel, quae sequi a enim deleniti Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate delectus f
             acilis nisi. Dolores officiis ex neque laudantium exercitationem recusandae rem dolor quas quaerat praesentium aliquam velit expl
             icabo sapiente itaque, voluptate eligendi quasi? Fugit suscipit eligendi soluta, iure rerum earum mollitia cum ducimus facilis asper
             atur optio rem quibusdam laborum fuga obcaecati! */}
            {/* </p> */}
            </textarea>
        </div>
        <hr />
        <div className='edit_task_time'>
          <svg className='svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 12.5V25H34.375M43.75 25C43.75 27.4623 43.265 29.9005 42.3227 32.1753C41.3805 34.4502 39.9993 36.5172 38.2582 38.2582C36.5172 39.9993 34.4502 41.3805 32.1753 42.3227C29.9005 43.265 27.4623 43.75 25 43.75C22.5377 43.75 20.0995 43.265 17.8247 42.3227C15.5498 41.3805 13.4828 39.9993 11.7417 38.2582C10.0006 36.5172 8.61953 34.4502 7.67726 32.1753C6.73498 29.9005 6.25 27.4623 6.25 25C6.25 20.0272 8.22544 15.2581 11.7417 11.7417C15.2581 8.22544 20.0272 6.25 25 6.25C29.9728 6.25 34.7419 8.22544 38.2582 11.7417C41.7746 15.2581 43.75 20.0272 43.75 25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className='edit_task_status'>Processing</div>
          <input type='datetime-local' className='edit_task_date' />
          <div className='edit_task_completed'>
            <input type='checkbox' />
            <p>Completed</p>
          </div>
        </div>
        <hr />
        <div className='edit_task_buttons'>
          <button className='edit_task_delete'>Delete</button>
          <button type='submit' className='edit_task_save'>Save</button>
        </div>
      </form>
    </div>
  );
}

export default EditTask;
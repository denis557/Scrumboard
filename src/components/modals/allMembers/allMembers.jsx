import React from "react";
import "./allMembers.css";
import { getInitial } from "../../../helpers/getInitial.js";

function AllMembersPopup({ toggleIsAllMembers, pageId, teamMembersInfo }) {
  return (
    <div className="modal_body">
      <div className="overlay" onClick={toggleIsAllMembers}></div>
      <div className="allMembers">
        <h1 className="board_id">Board ID: {pageId}</h1>
        <div className='members_div'>
          {teamMembersInfo.map(member => 
            <>
              <div className='member'>
                <div className='member_avatar' style={{background: `linear-gradient(to bottom left, ${member?.gradient[0]}, ${member?.gradient[1]}`}}>{getInitial(member?.name)}</div>
                <p  className='member_name'>{member?.name} {member?.surname || ''}</p>
                <svg className='svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.0625 25C14.0625 25.4144 13.8979 25.8118 13.6049 26.1049C13.3118 26.3979 12.9144 26.5625 12.5 26.5625C12.0856 26.5625 11.6882 26.3979 11.3951 26.1049C11.1021 25.8118 10.9375 25.4144 10.9375 25C10.9375 24.5856 11.1021 24.1882 11.3951 23.8951C11.6882 23.6021 12.0856 23.4375 12.5 23.4375C12.9144 23.4375 13.3118 23.6021 13.6049 23.8951C13.8979 24.1882 14.0625 24.5856 14.0625 25ZM26.5625 25C26.5625 25.4144 26.3979 25.8118 26.1049 26.1049C25.8118 26.3979 25.4144 26.5625 25 26.5625C24.5856 26.5625 24.1882 26.3979 23.8951 26.1049C23.6021 25.8118 23.4375 25.4144 23.4375 25C23.4375 24.5856 23.6021 24.1882 23.8951 23.8951C24.1882 23.6021 24.5856 23.4375 25 23.4375C25.4144 23.4375 25.8118 23.6021 26.1049 23.8951C26.3979 24.1882 26.5625 24.5856 26.5625 25ZM39.0625 25C39.0625 25.4144 38.8979 25.8118 38.6049 26.1049C38.3118 26.3979 37.9144 26.5625 37.5 26.5625C37.0856 26.5625 36.6882 26.3979 36.3951 26.1049C36.1021 25.8118 35.9375 25.4144 35.9375 25C35.9375 24.5856 36.1021 24.1882 36.3951 23.8951C36.6882 23.6021 37.0856 23.4375 37.5 23.4375C37.9144 23.4375 38.3118 23.6021 38.6049 23.8951C38.8979 24.1882 39.0625 24.5856 39.0625 25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
              </div>
              <hr />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllMembersPopup;
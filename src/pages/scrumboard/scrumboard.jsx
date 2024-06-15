import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/header/header.jsx';
import Nav from '../../components/nav/nav.jsx';
import '../main.css';
import './scrumboard.css';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosInstance.js';
import { UserContext } from '../../contexts/userContext.jsx';
import { TeamContext } from '../../contexts/teamsContext.jsx';
import CreateTeamPopup from '../../components/modals/createTeam/createTeam.jsx';
import JoinTeamPopup from '../../components/modals/joinTeam/joinTeam.jsx';

function Scrumboard() {
    const params = useParams();
    const pageId = params.id;

    const { userInfo, setUserInfo } = useContext(UserContext);
    const { teamsInfo, setTeamsInfo } = useContext(TeamContext) || { teamsInfo: [], setTeamsInfo: () => {} };
    const [teamMembersInfo, setTeamMembersInfo] = useState([]);
    const [isCreateModal, setIsCreateModal] = useState(false);
    const [isJoinModal, setIsJoinModal] = useState(false);
    const navigate = useNavigate();

    const toggleIsCreateModal = () => {
        setIsCreateModal(!isCreateModal);
    }

    const toggleIsJoinModal = () => {
        setIsJoinModal(!isJoinModal);
    }

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/get-user');
            if(response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if(error.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    const getTeamInfo = async () => {
        try {
            const response = await axiosInstance.get('/get-all-boards');
            if(response.data && response.data.boards) {
                setTeamsInfo(response.data.boards);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getAllMembers = async () => {
        try {
            const response = await axiosInstance.get('/get-all-members/' + pageId);
            if(response.data && response.data.membersInfo) {
                setTeamMembersInfo(response.data.membersInfo);
            }
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(!userInfo) {
            getUserInfo();
        }
    }, []);

    useEffect(() => {
        if (teamsInfo || teamsInfo.length === 0) {
            getTeamInfo();
        }
    }, []);

    useEffect(() => {
        if(pageId) {
            getAllMembers();
            console.log(teamMembersInfo);
        }
    }, [pageId]);

    const currentBoard = params.id ? teamsInfo.find(team => team._id == params.id) : {};

    return (
        <>
            <Header />
            <div className='wrapper'>
                <Nav page="scrumboard" toggleIsCreateModal={toggleIsCreateModal} toggleIsJoinModal={toggleIsJoinModal} />
                <div className='page'>
                    <div className='board_body'>
                    {params.id && (
                        // teamsInfo.length ?
                            currentBoard && (<>
                                {currentBoard.blocks.map(block => 
                                    <div className='block' key={block._id}>
                                        <div className='block_header'>
                                            <p className='block_header_p'>{block.name}</p>
                                            <svg className='svg_50 add_task' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25 9.375V40.625M40.625 25H9.375" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                            <svg className='svg_50' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.0625 25C14.0625 25.4144 13.8979 25.8118 13.6049 26.1049C13.3118 26.3979 12.9144 26.5625 12.5 26.5625C12.0856 26.5625 11.6882 26.3979 11.3951 26.1049C11.1021 25.8118 10.9375 25.4144 10.9375 25C10.9375 24.5856 11.1021 24.1882 11.3951 23.8951C11.6882 23.6021 12.0856 23.4375 12.5 23.4375C12.9144 23.4375 13.3118 23.6021 13.6049 23.8951C13.8979 24.1882 14.0625 24.5856 14.0625 25ZM26.5625 25C26.5625 25.4144 26.3979 25.8118 26.1049 26.1049C25.8118 26.3979 25.4144 26.5625 25 26.5625C24.5856 26.5625 24.1882 26.3979 23.8951 26.1049C23.6021 25.8118 23.4375 25.4144 23.4375 25C23.4375 24.5856 23.6021 24.1882 23.8951 23.8951C24.1882 23.6021 24.5856 23.4375 25 23.4375C25.4144 23.4375 25.8118 23.6021 26.1049 23.8951C26.3979 24.1882 26.5625 24.5856 26.5625 25ZM39.0625 25C39.0625 25.4144 38.8979 25.8118 38.6049 26.1049C38.3118 26.3979 37.9144 26.5625 37.5 26.5625C37.0856 26.5625 36.6882 26.3979 36.3951 26.1049C36.1021 25.8118 35.9375 25.4144 35.9375 25C35.9375 24.5856 36.1021 24.1882 36.3951 23.8951C36.6882 23.6021 37.0856 23.4375 37.5 23.4375C37.9144 23.4375 38.3118 23.6021 38.6049 23.8951C38.8979 24.1882 39.0625 24.5856 39.0625 25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                        </div>
                                        <hr />
                                        <div className='task_wrapper'>
                                            <div className='task'>
                                                <div className='task_header'>
                                                    <p>Optimize perfomance</p>
                                                    <svg className='svg_40' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.0625 25C14.0625 25.4144 13.8979 25.8118 13.6049 26.1049C13.3118 26.3979 12.9144 26.5625 12.5 26.5625C12.0856 26.5625 11.6882 26.3979 11.3951 26.1049C11.1021 25.8118 10.9375 25.4144 10.9375 25C10.9375 24.5856 11.1021 24.1882 11.3951 23.8951C11.6882 23.6021 12.0856 23.4375 12.5 23.4375C12.9144 23.4375 13.3118 23.6021 13.6049 23.8951C13.8979 24.1882 14.0625 24.5856 14.0625 25ZM26.5625 25C26.5625 25.4144 26.3979 25.8118 26.1049 26.1049C25.8118 26.3979 25.4144 26.5625 25 26.5625C24.5856 26.5625 24.1882 26.3979 23.8951 26.1049C23.6021 25.8118 23.4375 25.4144 23.4375 25C23.4375 24.5856 23.6021 24.1882 23.8951 23.8951C24.1882 23.6021 24.5856 23.4375 25 23.4375C25.4144 23.4375 25.8118 23.6021 26.1049 23.8951C26.3979 24.1882 26.5625 24.5856 26.5625 25ZM39.0625 25C39.0625 25.4144 38.8979 25.8118 38.6049 26.1049C38.3118 26.3979 37.9144 26.5625 37.5 26.5625C37.0856 26.5625 36.6882 26.3979 36.3951 26.1049C36.1021 25.8118 35.9375 25.4144 35.9375 25C35.9375 24.5856 36.1021 24.1882 36.3951 23.8951C36.6882 23.6021 37.0856 23.4375 37.5 23.4375C37.9144 23.4375 38.3118 23.6021 38.6049 23.8951C38.8979 24.1882 39.0625 24.5856 39.0625 25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                                </div>
                                                <hr />
                                                <div className='task_time'>
                                                    <svg className='proccessing svg_28' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14 7V14H19.25M24.5 14C24.5 15.3789 24.2284 16.7443 23.7007 18.0182C23.1731 19.2921 22.3996 20.4496 21.4246 21.4246C20.4496 22.3996 19.2921 23.1731 18.0182 23.7007C16.7443 24.2284 15.3789 24.5 14 24.5C12.6211 24.5 11.2557 24.2284 9.98182 23.7007C8.70791 23.1731 7.55039 22.3996 6.57538 21.4246C5.60036 20.4496 4.82694 19.2921 4.29926 18.0182C3.77159 16.7443 3.5 15.3789 3.5 14C3.5 11.2152 4.60625 8.54451 6.57538 6.57538C8.54451 4.60625 11.2152 3.5 14 3.5C16.7848 3.5 19.4555 4.60625 21.4246 6.57538C23.3938 8.54451 24.5 11.2152 24.5 14Z" stroke="#0057FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                                    <p>27 May</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button className='add_block'>
                                    <svg className='svg_50 add_block_svg' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25 9.375V40.625M40.625 25H9.375" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                    <p>Add block</p>
                                </button>
                            </>)
                            // :
                            // <p>Board is loading...</p>
                    )}
                    </div>
                </div>
            </div>
            {isCreateModal && <CreateTeamPopup toggleIsCreateModal={toggleIsCreateModal} getTeamInfo={getTeamInfo} getUserInfo={getUserInfo} />}
            {isJoinModal && <JoinTeamPopup toggleIsJoinModal={toggleIsJoinModal} getTeamInfo={getTeamInfo} getUserInfo={getUserInfo} />}
        </>
    )
}

export default Scrumboard
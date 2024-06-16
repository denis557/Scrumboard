import React, { useContext, useEffect, useState, useRef } from 'react';
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
import AddBlock from '../../components/modals/addBlock/addBlock.jsx';
import BlockContextMenu from '../../components/contextMenus/blockContextMenu/blockContextMenu.jsx';
import AddTask from '../../components/modals/addTask/addTask.jsx';
import { getInitial } from '../../helpers/getInitial.js';

function Scrumboard() {
    const params = useParams();

    const { userInfo, setUserInfo } = useContext(UserContext);
    const { teamsInfo, setTeamsInfo } = useContext(TeamContext) || { teamsInfo: [], setTeamsInfo: () => {} };
    const [isCreateModal, setIsCreateModal] = useState(false);
    const [isJoinModal, setIsJoinModal] = useState(false);
    const [isAddBlock, setIsAddBlock] = useState(false);
    const [isAddTask, setIsAddTask] = useState(false);
    const [blockContextMenu, setBlockContextMenu] = useState({
        position: {
            x: 0,
            y: 0
        },
        toggled: false
    })
    const navigate = useNavigate();
    const blockContextMenuRef = useRef(null);
    const menuJustOpened = useRef(false);
    const [inputBlockId, setInputBlockId] = useState(null);
    const [blockTitle, setBlockTitle] = useState('');
    const [blockId, setBlockId] = useState('');

    function handleBlockContext(e, clickedBlock) {
        e.preventDefault();
        menuJustOpened.current = true;

        const blockContextMenuAttr = blockContextMenuRef.current.getBoundingClientRect();

        const isLeft = e.clientX < window?.innerWidth / 2;

        let x;
        let y = e.clientY;

        if (isLeft) {
            x = e.clientX;
        } else {
            x = e.clientX - blockContextMenuAttr.width
        }

        setBlockContextMenu({
            position: {
                x,
                y
            },
            toggled: true,
            clickedBlock: clickedBlock
        })
        setTimeout(() => {
            menuJustOpened.current = false;
        }, 100);
    }

    function resetBlockContextMenu() {
        setBlockContextMenu({
            position: {
                x: 0,
                y: 0
            },
            toggled: false
        })
        console.log('net')
    }

    useEffect(() => {
        function handler(e) {
            if (!menuJustOpened.current && blockContextMenuRef.current && !blockContextMenuRef.current.contains(e.target)) {
                resetBlockContextMenu();
            }
        }

        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    const toggleIsCreateModal = () => {
        setIsCreateModal(!isCreateModal);
    }

    const toggleIsJoinModal = () => {
        setIsJoinModal(!isJoinModal);
    }

    const toggleIsAddBlock = () => {
        setIsAddBlock(!isAddBlock);
    }

    const toggleIsAddTask = () => {
        setIsAddTask(!isAddTask);
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

    const deleteBlock = async (clickedBlock) => {
        try{
            const response = await axiosInstance.delete('/delete-block/' + params.id + '/' + clickedBlock._id);
            getUserInfo();
            getTeamInfo();
            resetBlockContextMenu();
        } catch(error) {

        }
    }

    const changeBlock = async (clickedBlock) => {
        try{
            const response = await axiosInstance.put('/edit-block/' + params.id + '/' + clickedBlock._id, {
                name: blockTitle
            });
            getTeamInfo();
            getUserInfo();
        } catch(error) {
            console.log(error)
        }
    }

    const toggleIsInput = (blockId) => {
        if (inputBlockId === blockId) {
            setInputBlockId(null);
        } else {
            setInputBlockId(blockId);
            setBlockTitle(blockContextMenu.clickedBlock.name)
        }
    }

    const handleTitleInput = (e) => {
        if(e.key == 'Enter') {
            changeBlock(blockId);
            setInputBlockId(null);
        } else if(e.key == 'Escape') {
            setInputBlockId(null);
            setBlockTitle('');
        }
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (inputBlockId && !e.target.closest('.block_title_input')) {
                setInputBlockId(null);
                setBlockTitle('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputBlockId])

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


    const currentBoard = params.id ? teamsInfo.find(team => team._id == params.id) : {};

    return (
        <>
            <Header />
            <div className='wrapper'>
                <Nav page="scrumboard" toggleIsCreateModal={toggleIsCreateModal} toggleIsJoinModal={toggleIsJoinModal} getTeamInfo={getTeamInfo} />
                <div className='page'>
                    <div className='board_body'>
                    {params.id && (
                            currentBoard && (<>
                                {currentBoard.blocks.map(block => 
                                    <div className='block' key={block._id}>
                                        <div className='block_header'>
                                            {inputBlockId == block._id ? <input value={blockTitle} className='block_title_input' onChange={e => {setBlockTitle(e.target.value); console.log(blockTitle)}} onKeyDown={handleTitleInput} /> 
                                            : 
                                            <p className='block_header_p'>{block.name}</p>}
                                            <svg className='svg_50 add_task' onClick={() => {toggleIsAddTask(); setBlockId(block._id)}} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25 9.375V40.625M40.625 25H9.375" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                            <svg className='svg_50' onClick={(e) => handleBlockContext(e, block)} onContextMenu={(e) => handleBlockContext(e, block)} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.0625 25C14.0625 25.4144 13.8979 25.8118 13.6049 26.1049C13.3118 26.3979 12.9144 26.5625 12.5 26.5625C12.0856 26.5625 11.6882 26.3979 11.3951 26.1049C11.1021 25.8118 10.9375 25.4144 10.9375 25C10.9375 24.5856 11.1021 24.1882 11.3951 23.8951C11.6882 23.6021 12.0856 23.4375 12.5 23.4375C12.9144 23.4375 13.3118 23.6021 13.6049 23.8951C13.8979 24.1882 14.0625 24.5856 14.0625 25ZM26.5625 25C26.5625 25.4144 26.3979 25.8118 26.1049 26.1049C25.8118 26.3979 25.4144 26.5625 25 26.5625C24.5856 26.5625 24.1882 26.3979 23.8951 26.1049C23.6021 25.8118 23.4375 25.4144 23.4375 25C23.4375 24.5856 23.6021 24.1882 23.8951 23.8951C24.1882 23.6021 24.5856 23.4375 25 23.4375C25.4144 23.4375 25.8118 23.6021 26.1049 23.8951C26.3979 24.1882 26.5625 24.5856 26.5625 25ZM39.0625 25C39.0625 25.4144 38.8979 25.8118 38.6049 26.1049C38.3118 26.3979 37.9144 26.5625 37.5 26.5625C37.0856 26.5625 36.6882 26.3979 36.3951 26.1049C36.1021 25.8118 35.9375 25.4144 35.9375 25C35.9375 24.5856 36.1021 24.1882 36.3951 23.8951C36.6882 23.6021 37.0856 23.4375 37.5 23.4375C37.9144 23.4375 38.3118 23.6021 38.6049 23.8951C38.8979 24.1882 39.0625 24.5856 39.0625 25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                        </div>
                                        <hr />
                                        <div className='task_wrapper'>
                                            {/* <div className='task'>
                                                <div className='task_header'>
                                                    <p>Optimize perfomance</p>
                                                    <svg className='svg_40' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.0625 25C14.0625 25.4144 13.8979 25.8118 13.6049 26.1049C13.3118 26.3979 12.9144 26.5625 12.5 26.5625C12.0856 26.5625 11.6882 26.3979 11.3951 26.1049C11.1021 25.8118 10.9375 25.4144 10.9375 25C10.9375 24.5856 11.1021 24.1882 11.3951 23.8951C11.6882 23.6021 12.0856 23.4375 12.5 23.4375C12.9144 23.4375 13.3118 23.6021 13.6049 23.8951C13.8979 24.1882 14.0625 24.5856 14.0625 25ZM26.5625 25C26.5625 25.4144 26.3979 25.8118 26.1049 26.1049C25.8118 26.3979 25.4144 26.5625 25 26.5625C24.5856 26.5625 24.1882 26.3979 23.8951 26.1049C23.6021 25.8118 23.4375 25.4144 23.4375 25C23.4375 24.5856 23.6021 24.1882 23.8951 23.8951C24.1882 23.6021 24.5856 23.4375 25 23.4375C25.4144 23.4375 25.8118 23.6021 26.1049 23.8951C26.3979 24.1882 26.5625 24.5856 26.5625 25ZM39.0625 25C39.0625 25.4144 38.8979 25.8118 38.6049 26.1049C38.3118 26.3979 37.9144 26.5625 37.5 26.5625C37.0856 26.5625 36.6882 26.3979 36.3951 26.1049C36.1021 25.8118 35.9375 25.4144 35.9375 25C35.9375 24.5856 36.1021 24.1882 36.3951 23.8951C36.6882 23.6021 37.0856 23.4375 37.5 23.4375C37.9144 23.4375 38.3118 23.6021 38.6049 23.8951C38.8979 24.1882 39.0625 24.5856 39.0625 25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                                </div>
                                                <hr />
                                                <div className='task_time'>
                                                    <svg className='proccessing svg_28' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14 7V14H19.25M24.5 14C24.5 15.3789 24.2284 16.7443 23.7007 18.0182C23.1731 19.2921 22.3996 20.4496 21.4246 21.4246C20.4496 22.3996 19.2921 23.1731 18.0182 23.7007C16.7443 24.2284 15.3789 24.5 14 24.5C12.6211 24.5 11.2557 24.2284 9.98182 23.7007C8.70791 23.1731 7.55039 22.3996 6.57538 21.4246C5.60036 20.4496 4.82694 19.2921 4.29926 18.0182C3.77159 16.7443 3.5 15.3789 3.5 14C3.5 11.2152 4.60625 8.54451 6.57538 6.57538C8.54451 4.60625 11.2152 3.5 14 3.5C16.7848 3.5 19.4555 4.60625 21.4246 6.57538C23.3938 8.54451 24.5 11.2152 24.5 14Z" stroke="#0057FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                                    <p>27 May</p>
                                                </div>
                                            </div> */}
                                            {block.tasks.map((task, index) => 
                                                <div className='task' key={index} onClick={console.log(task)}>
                                                    <div className='task_header'>
                                                        <p>{task.title}</p>
                                                        <svg className='svg_40' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.0625 25C14.0625 25.4144 13.8979 25.8118 13.6049 26.1049C13.3118 26.3979 12.9144 26.5625 12.5 26.5625C12.0856 26.5625 11.6882 26.3979 11.3951 26.1049C11.1021 25.8118 10.9375 25.4144 10.9375 25C10.9375 24.5856 11.1021 24.1882 11.3951 23.8951C11.6882 23.6021 12.0856 23.4375 12.5 23.4375C12.9144 23.4375 13.3118 23.6021 13.6049 23.8951C13.8979 24.1882 14.0625 24.5856 14.0625 25ZM26.5625 25C26.5625 25.4144 26.3979 25.8118 26.1049 26.1049C25.8118 26.3979 25.4144 26.5625 25 26.5625C24.5856 26.5625 24.1882 26.3979 23.8951 26.1049C23.6021 25.8118 23.4375 25.4144 23.4375 25C23.4375 24.5856 23.6021 24.1882 23.8951 23.8951C24.1882 23.6021 24.5856 23.4375 25 23.4375C25.4144 23.4375 25.8118 23.6021 26.1049 23.8951C26.3979 24.1882 26.5625 24.5856 26.5625 25ZM39.0625 25C39.0625 25.4144 38.8979 25.8118 38.6049 26.1049C38.3118 26.3979 37.9144 26.5625 37.5 26.5625C37.0856 26.5625 36.6882 26.3979 36.3951 26.1049C36.1021 25.8118 35.9375 25.4144 35.9375 25C35.9375 24.5856 36.1021 24.1882 36.3951 23.8951C36.6882 23.6021 37.0856 23.4375 37.5 23.4375C37.9144 23.4375 38.3118 23.6021 38.6049 23.8951C38.8979 24.1882 39.0625 24.5856 39.0625 25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                                    </div>
                                                    <hr />
                                                    <div className='task_footer'>
                                                        <div className='creator_avatar' style={{background: `linear-gradient(to bottom left, ${task.creatorGradient[0]}, ${task.creatorGradient[1]}`}}>{getInitial(task.creator[0])}</div>
                                                        <div className='task_time'>
                                                            <svg className='proccessing svg_28' width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14 7V14H19.25M24.5 14C24.5 15.3789 24.2284 16.7443 23.7007 18.0182C23.1731 19.2921 22.3996 20.4496 21.4246 21.4246C20.4496 22.3996 19.2921 23.1731 18.0182 23.7007C16.7443 24.2284 15.3789 24.5 14 24.5C12.6211 24.5 11.2557 24.2284 9.98182 23.7007C8.70791 23.1731 7.55039 22.3996 6.57538 21.4246C5.60036 20.4496 4.82694 19.2921 4.29926 18.0182C3.77159 16.7443 3.5 15.3789 3.5 14C3.5 11.2152 4.60625 8.54451 6.57538 6.57538C8.54451 4.60625 11.2152 3.5 14 3.5C16.7848 3.5 19.4555 4.60625 21.4246 6.57538C23.3938 8.54451 24.5 11.2152 24.5 14Z" stroke="#0057FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                                            <p>27 May</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <button className='add_block' onClick={toggleIsAddBlock}>
                                    <svg className='svg_50 add_block_svg' width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25 9.375V40.625M40.625 25H9.375" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                    <p>Add block</p>
                                </button>
                            </>)
                    )}
                    </div>
                </div>
            </div>
            <BlockContextMenu 
                blockContextMenuRef={blockContextMenuRef}
                isToggled={blockContextMenu.toggled}
                positionX={blockContextMenu.position.x}
                positionY={blockContextMenu.position.y}
                buttons={[
                    {
                        text: 'Change name',
                        svg: <svg className='svg_24' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.862 4.487L18.549 2.799C18.9007 2.44733 19.3777 2.24976 19.875 2.24976C20.3723 2.24976 20.8493 2.44733 21.201 2.799C21.5527 3.15068 21.7502 3.62766 21.7502 4.125C21.7502 4.62235 21.5527 5.09933 21.201 5.451L6.832 19.82C6.30332 20.3484 5.65137 20.7367 4.935 20.95L2.25 21.75L3.05 19.065C3.26328 18.3486 3.65163 17.6967 4.18 17.168L16.863 4.487H16.862ZM16.862 4.487L19.5 7.125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>,
                        color: 'black',
                        onClick: () => {setBlockId(blockContextMenu.clickedBlock); resetBlockContextMenu(); toggleIsInput(blockContextMenu.clickedBlock._id)},
                    },
                    {
                        text: 'Delete block',
                        svg: <svg className='svg_24' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.74 9.00003L14.394 18M9.606 18L9.26 9.00003M19.228 5.79003C19.57 5.84203 19.91 5.89703 20.25 5.95603M19.228 5.79003L18.16 19.673C18.1164 20.2383 17.8611 20.7662 17.445 21.1513C17.029 21.5364 16.4829 21.7502 15.916 21.75H8.084C7.5171 21.7502 6.97102 21.5364 6.55498 21.1513C6.13894 20.7662 5.88359 20.2383 5.84 19.673L4.772 5.79003M19.228 5.79003C18.0739 5.61555 16.9138 5.48313 15.75 5.39303M4.772 5.79003C4.43 5.84103 4.09 5.89603 3.75 5.95503M4.772 5.79003C5.92613 5.61555 7.08623 5.48313 8.25 5.39303M15.75 5.39303V4.47703C15.75 3.29703 14.84 2.31303 13.66 2.27603C12.5536 2.24067 11.4464 2.24067 10.34 2.27603C9.16 2.31303 8.25 3.29803 8.25 4.47703V5.39303M15.75 5.39303C13.2537 5.20011 10.7463 5.20011 8.25 5.39303" stroke="#FF2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>,
                        color: 'red',
                        onClick: () => deleteBlock(blockContextMenu.clickedBlock),
                    }
                ]}
            />
            {isCreateModal && <CreateTeamPopup toggleIsCreateModal={toggleIsCreateModal} getTeamInfo={getTeamInfo} getUserInfo={getUserInfo} />}
            {isJoinModal && <JoinTeamPopup toggleIsJoinModal={toggleIsJoinModal} getTeamInfo={getTeamInfo} getUserInfo={getUserInfo} />}
            {isAddBlock && <AddBlock toggleIsAddBlock={toggleIsAddBlock} getUserInfo={getUserInfo} getTeamInfo={getTeamInfo} boardId={params.id} />}
            {isAddTask && <AddTask toggleIsAddTask={toggleIsAddTask} getTeamInfo={getTeamInfo} getUserInfo={getUserInfo} boardId={params.id} blockId={blockId} />}
        </>
    )
}

export default Scrumboard
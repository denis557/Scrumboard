import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import { TeamContext } from '../../contexts/teamsContext.jsx';
import TeamContextMenu from '../contextMenus/teamContextMenu/teamContextMenu.jsx';
import { UserContext } from '../../contexts/userContext.jsx';
import AllMembersPopup from '../../components/modals/allMembers/allMembers.jsx';
import axiosInstance from '../../helpers/axiosInstance.js';

function Nav({ page, handleAddFriend, toggleIsCreateModal, toggleIsJoinModal, getTeamInfo }) {
    const [isTeamOpened, setIsTeamOpened] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState('myBoard');
    const { teamsInfo, setTeamsInfo } = useContext(TeamContext);
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [isAllMembers, setIsAllMembers] = useState(false);
    const [boardId, setBoardId] = useState(null);
    const [teamMembersInfo, setTeamMembersInfo] = useState([]);
    const [inputTeamId, setInputTeamId] = useState(null);
    const [teamTitle, setTeamTitle] = useState('');

    const getAllMembers = async (clickedTeamId) => {
        try {
            const response = await axiosInstance.get('/get-all-members/' + clickedTeamId);
            if(response.data && response.data.membersInfo) {
                setTeamMembersInfo(response.data.membersInfo);
                console.log(response.data.membersInfo);
            }
        } catch(error) {
            console.log(error)
        }
    }

    const leaveBoard = async (clickedTeamId) => {
        try{
            const response = await axiosInstance.delete('/leave-board/' + clickedTeamId);
            getTeamInfo();
            resetTeamContext();
        }catch(error) {
            console.log(error)
        }
    }

    const deleteBoard = async (clickedTeamId) => {
        try {
            const response = await axiosInstance.delete('/delete-board/' + clickedTeamId);
            getTeamInfo();
            resetTeamContext();
        } catch (error) {
            console.log(error);
        }
    }

    const changeTeamTitle = async (clickedTeamId) => {
        try {
            const response = await axiosInstance.put('/edit-board/' + clickedTeamId, {
                name: teamTitle
            });
            getTeamInfo();
        } catch (error) {
            console.log(error)
        }
    }

    const toggleIsAllMembers = () => {
        setIsAllMembers(!isAllMembers);
        resetTeamContext();
    };

    const teamContextRef = useRef(null);
    const [teamContextMenu, setTeamContextMenu] = useState({
        position: {
            x: 0,
            y: 0
        },
        toggled: false
    });

    function handleTeamContext(e, clickedTeam) {
        e.preventDefault();
        console.log(clickedTeam)

        const teamContextAttr = teamContextRef.current.getBoundingClientRect();
        
        const isLeft = e.clientX < window?.innerWidth / 2;

        let x;
        let y = e.clientY;

        if(isLeft) {
            x = e.clientX;
        } else {
            x = e.clientX - teamContextAttr.width;
        }

        setTeamContextMenu({
            position: {
                x,
                y
            },
            toggled: true,
            clickedTeam
        })
        // currentBoard = clickedTeam._id == 'myBoard' ? '' : userInfo.boards.find(board => board.board == clickedTeam._id);
        // console.log(currentBoard)
    }

    const generateButtons = () => {
        let currentBoard = 'myBoard';
        if (teamContextMenu.clickedTeam && teamContextMenu.clickedTeam._id !== 'myBoard') {
            currentBoard = userInfo.boards.find(board => board.board === teamContextMenu.clickedTeam._id);
        }

        const buttons = [
            currentBoard.role !== 'member' && {
                text: 'Change name',
                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.862 4.487L18.549 2.799C18.9007 2.44733 19.3777 2.24976 19.875 2.24976C20.3723 2.24976 20.8493 2.44733 21.201 2.799C21.5527 3.15068 21.7502 3.62766 21.7502 4.125C21.7502 4.62235 21.5527 5.09933 21.201 5.451L6.832 19.82C6.30332 20.3484 5.65137 20.7367 4.935 20.95L2.25 21.75L3.05 19.065C3.26328 18.3486 3.65163 17.6967 4.18 17.168L16.863 4.487H16.862ZM16.862 4.487L19.5 7.125" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>,
                onClick: () => {toggleIsInput(teamContextMenu.clickedTeam._id); resetTeamContext(); setBoardId(teamContextMenu.clickedTeam._id)},
                color: 'black'
            },
            {
                text: 'Members',
                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M15.75 6C15.75 6.99456 15.3549 7.94839 14.6516 8.65165C13.9484 9.35491 12.9945 9.75 12 9.75C11.0054 9.75 10.0516 9.35491 9.34833 8.65165C8.64506 7.94839 8.24998 6.99456 8.24998 6C8.24998 5.00544 8.64506 4.05161 9.34833 3.34835C10.0516 2.64509 11.0054 2.25 12 2.25C12.9945 2.25 13.9484 2.64509 14.6516 3.34835C15.3549 4.05161 15.75 5.00544 15.75 6ZM4.50098 20.118C4.53311 18.1504 5.33731 16.2742 6.74015 14.894C8.14299 13.5139 10.0321 12.7405 12 12.7405C13.9679 12.7405 15.857 13.5139 17.2598 14.894C18.6626 16.2742 19.4668 18.1504 19.499 20.118C17.1464 21.1968 14.5881 21.7535 12 21.75C9.32398 21.75 6.78398 21.166 4.50098 20.118Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>,
                onClick: () => {getAllMembers(teamContextMenu.clickedTeam._id); toggleIsAllMembers(); setBoardId(teamContextMenu.clickedTeam._id)},
                color: 'black'
            },
            currentBoard.role == 'member' && {
                text: 'Leave board',
                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.25 9V5.25C8.25 4.65326 8.48705 4.08097 8.90901 3.65901C9.33097 3.23705 9.90326 3 10.5 3H16.5C17.0967 3 17.669 3.23705 18.091 3.65901C18.5129 4.08097 18.75 4.65326 18.75 5.25V18.75C18.75 19.3467 18.5129 19.919 18.091 20.341C17.669 20.7629 17.0967 21 16.5 21H10.5C9.90326 21 9.33097 20.7629 8.90901 20.341C8.48705 19.919 8.25 19.3467 8.25 18.75V15M5.25 15L2.25 12M2.25 12L5.25 9M2.25 12H15" stroke="#FF2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>,
                onClick: () => leaveBoard(teamContextMenu.clickedTeam._id),
                color: 'red'
            },
            currentBoard.role == 'creator' && {
                text: 'Delete board',
                svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.74 9.00003L14.394 18M9.606 18L9.26 9.00003M19.228 5.79003C19.57 5.84203 19.91 5.89703 20.25 5.95603M19.228 5.79003L18.16 19.673C18.1164 20.2383 17.8611 20.7662 17.445 21.1513C17.029 21.5364 16.4829 21.7502 15.916 21.75H8.084C7.5171 21.7502 6.97102 21.5364 6.55498 21.1513C6.13894 20.7662 5.88359 20.2383 5.84 19.673L4.772 5.79003M19.228 5.79003C18.0739 5.61555 16.9138 5.48313 15.75 5.39303M4.772 5.79003C4.43 5.84103 4.09 5.89603 3.75 5.95503M4.772 5.79003C5.92613 5.61555 7.08623 5.48313 8.25 5.39303M15.75 5.39303V4.47703C15.75 3.29703 14.84 2.31303 13.66 2.27603C12.5536 2.24067 11.4464 2.24067 10.34 2.27603C9.16 2.31303 8.25 3.29803 8.25 4.47703V5.39303M15.75 5.39303C13.2537 5.20011 10.7463 5.20011 8.25 5.39303" stroke="#FF2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>,
                onClick: () => deleteBoard(teamContextMenu.clickedTeam._id),
                color: 'red'
            }
        ];

        return buttons.filter(button => button);
    };

    function resetTeamContext() {
        setTeamContextMenu({
            position: {
                x: 0,
                y: 0
            },
            toggled: false
        })
    }

    useEffect(() => {
        function handler(e) {
            if(teamContextRef.current) {
                if(!teamContextRef.current.contains(e.target)) {
                    resetTeamContext();
                }
            }
        }
        document.addEventListener('click', handler);

        return () => {
            document.removeEventListener('click', handler)
        }
    })

    const toggleTeamClass = () => {
        setIsTeamOpened(!isTeamOpened)
    }

    const toggleSelectedTeam = (teamId) => {
        setSelectedTeamId(teamId);
    }

    const toggleIsInput = (teamId) => {
        if (inputTeamId === teamId) {
            setInputTeamId(null);
        } else {
            setInputTeamId(teamId);
            setTeamTitle(teamContextMenu.clickedTeam.name)
        }
    }

    const handleTitleInput = (e) => {
        if(e.key === 'Enter') {
            changeTeamTitle(boardId);
            setInputTeamId(null);
        } else if (e.key === 'Escape') {
            setInputTeamId(null);
            setTeamTitle('')
        }
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (inputTeamId && !e.target.closest('.team_title_input')) {
                setInputTeamId(null);
                setTeamTitle('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputTeamId]);

    return (
        <div className="nav">
            <Link to='/scrumboard' className={`nav_button ${page == 'scrumboard' && 'selected'}`}>
                <svg className={`nav_svg ${page == 'scrumboard' && 'selected'} svg_44`} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="0.4" y="0.4" width="43.2" height="43.2" rx="2.6" stroke="black" strokeWidth="0.8"/> <line x1="12.4" y1="7" x2="12.4" y2="37" stroke="black" strokeWidth="0.8"/> <line x1="32.4" y1="7" x2="32.4" y2="27" stroke="black" strokeWidth="0.8"/> <line x1="22.4" y1="7" x2="22.4" y2="32" stroke="black" strokeWidth="0.8"/> </svg>
                <p className={`nav_button_title ${page == 'scrumboard' && 'selected'}`}>Scrumboard</p>
            </Link>
            <Link to='/friends' className={`nav_button ${page == 'friends' && 'selected'}`}>
                <svg className={`nav_svg ${page == 'friends' && 'selected'} svg_44`} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.9294 8.00573C16.4347 7.93886 18.0869 8.45945 19.2188 9.47111C20.5437 10.6554 21.3168 12.1381 21.4195 13.9254C21.511 15.5175 20.939 17.1439 19.8767 18.3329C18.7176 19.6304 17.1711 20.3537 15.4395 20.452C13.9372 20.5256 12.3605 19.9741 11.2184 18.999C9.98754 17.9483 9.12659 16.4503 9.0071 14.8161C8.88233 13.1099 9.36886 11.4518 10.5037 10.1519C11.6567 8.83134 13.1913 8.12522 14.9294 8.00573ZM14.6437 8.42792C14.241 8.48603 13.8425 8.54678 13.4528 8.66828C12.2884 9.0312 11.2524 9.7891 10.5242 10.7632C9.60669 11.9905 9.22046 13.5838 9.44089 15.0976C9.64919 16.5276 10.4793 17.9718 11.6454 18.8339C12.8706 19.7398 14.2655 20.1569 15.7849 20.0188C16.2163 19.9622 16.6315 19.889 17.0463 19.7539C18.1532 19.3935 19.1418 18.6549 19.8482 17.7369C20.7362 16.5833 21.1785 15.0206 20.992 13.5721C20.792 12.0172 20.0266 10.5834 18.7718 9.62436C17.8588 8.92668 16.7961 8.50491 15.6466 8.42043C15.3137 8.39596 14.9766 8.41252 14.6437 8.42792Z" stroke="black" strokeWidth="0.7"/> <path d="M30.8906 12.5081C31.3009 12.4833 31.7516 12.5159 32.1535 12.5993C33.4949 12.8778 34.7506 13.68 35.5031 14.8358C36.2533 15.9881 36.5894 17.4447 36.2915 18.8034C36.0799 19.768 35.657 20.6294 34.9807 21.3549C34.0516 22.3517 32.7457 22.9825 31.3788 23.0274C30.9059 23.0693 30.3583 23.0238 29.8985 22.9003C29.1127 22.6894 28.3641 22.3376 27.7429 21.805C26.6914 20.9035 25.9787 19.6405 25.8783 18.2444C25.7752 16.8106 26.1935 15.3941 27.1511 14.3063C28.1301 13.1943 29.4204 12.6023 30.8906 12.5081ZM30.6374 12.9288C29.3244 13.059 28.1573 13.7043 27.3241 14.7256C26.5016 15.7335 26.1543 17.0444 26.2882 18.33C26.4181 19.5775 27.0853 20.7693 28.0621 21.5539C29.0716 22.365 30.2871 22.7081 31.5726 22.6156C32.9852 22.4406 34.1386 21.8205 35.0157 20.6915C35.7422 19.7563 36.1155 18.4465 35.9705 17.2693C35.8068 15.9414 35.168 14.7355 34.1007 13.9123C33.4069 13.3772 32.5468 13.0171 31.6716 12.9284C31.3356 12.8942 30.9744 12.9093 30.6374 12.9288Z" stroke="black" strokeWidth="0.7"/> <path d="M15.1248 21.0546C18.2551 20.9201 21.2486 22.1464 23.3844 24.4379C23.682 24.7572 23.9556 25.0951 24.2119 25.4482L24.4268 25.7586C24.4671 25.8229 24.5129 25.9258 24.5795 25.9656C24.6221 25.9911 24.6287 25.9787 24.6743 25.9684C24.8135 25.7787 25.0135 25.6228 25.1927 25.4716C25.8852 24.8871 26.6457 24.3982 27.481 24.042C29.6714 23.1077 32.1348 23.0725 34.3466 23.9571C36.6458 24.8767 38.3693 26.6745 39.328 28.9365C39.5984 29.5747 39.7763 30.2918 39.8768 30.9759C39.9998 31.8136 39.9665 32.6807 39.9666 33.5251C39.9666 33.9829 39.9984 34.4715 39.9415 34.9253C39.9175 35.1178 39.8626 35.2873 39.7882 35.4655C39.5861 35.9495 39.1589 36.3994 38.6684 36.5956C38.4099 36.699 38.188 36.7544 37.9071 36.7673L32.4153 36.7738L24.8013 36.7814C24.5929 36.7853 24.4026 36.8597 24.2019 36.9081C24.0361 36.9481 23.8439 36.9603 23.6735 36.9651L20.64 36.9686L14.7234 36.9697L9.98797 36.9696L7.50144 36.9627C7.23081 36.9508 6.98855 36.9187 6.73363 36.8266L6.59768 36.776L6.56224 36.7614L6.47713 36.7252C5.87179 36.4374 5.40233 35.9335 5.16575 35.3076C5.08321 35.0893 5.03741 34.8601 5.02236 34.6271C4.98067 33.9815 5.00995 33.3165 5.01053 32.6691C5.01111 32.0245 4.99233 31.3697 5.05007 30.7273C5.26016 28.3902 6.21145 26.2674 7.76775 24.5173C9.65227 22.3982 12.3171 21.2243 15.1248 21.0546ZM14.935 21.4753C14.4183 21.5201 13.9127 21.5765 13.4045 21.6846C11.248 22.1433 9.21109 23.3936 7.80024 25.0859C6.44644 26.7098 5.62316 28.6959 5.44198 30.8044C5.38745 31.439 5.40621 32.0843 5.4058 32.7209C5.40538 33.3679 5.35766 34.0582 5.42173 34.701C5.45282 35.0128 5.59648 35.3542 5.77072 35.6108L5.79958 35.6541C6.11136 36.1181 6.61498 36.4208 7.15877 36.5246C7.52612 36.5948 7.92511 36.5655 8.29826 36.5658L9.9904 36.5662L16.3313 36.5646L20.9929 36.5657L22.7006 36.5648C23.266 36.5643 23.8275 36.6086 24.375 36.445C24.8666 36.2982 25.33 35.8684 25.5668 35.4208C25.6913 35.1854 25.7636 34.9349 25.7977 34.6712C25.8565 34.2176 25.8144 33.7096 25.8143 33.251C25.814 32.4066 25.858 31.5377 25.7733 30.6984C25.7079 30.0505 25.594 29.3742 25.3964 28.7533C25.2824 28.3948 25.1691 28.033 25.019 27.6875C24.0541 25.4682 22.3898 23.6461 20.23 22.5413C18.6201 21.7175 16.7395 21.3351 14.935 21.4753ZM30.4378 23.743C29.8473 23.7919 29.2591 23.8761 28.687 24.0343C27.2243 24.4389 25.8814 25.265 24.8304 26.3548C24.8125 26.4449 25.0741 26.8558 25.125 26.9657C25.3699 27.494 25.595 28.0132 25.7614 28.5732C25.9666 29.2639 26.099 29.971 26.172 30.6875C26.2391 31.3456 26.2103 32.0298 26.2111 32.6914L26.2108 33.9614C26.21 34.3838 26.2154 34.7838 26.0932 35.193C25.9431 35.6956 25.638 36.0048 25.3122 36.3911L33.1799 36.3825L36.4249 36.383L37.4178 36.382C37.6772 36.3815 37.938 36.3901 38.193 36.3327C38.5193 36.2589 38.8089 36.0888 39.0461 35.8543C39.2901 35.613 39.4473 35.3269 39.5215 34.9912C39.6293 34.5041 39.5752 33.933 39.5752 33.4328C39.5752 32.8978 39.5938 32.3529 39.5605 31.8191C39.4718 30.3969 39.0531 28.9778 38.2882 27.77C37.0116 25.7543 35.0833 24.4054 32.7509 23.8907C32.0318 23.732 31.1708 23.6697 30.4378 23.743Z" stroke="black" strokeWidth="0.7"/> </svg>
                <p className={`nav_button_title ${page == 'friends' && 'selected'}`}>Friends</p>
            </Link>
            <Link to='/settings' className={`nav_button ${page == 'settings' && 'selected'}`}>
                <svg className={`nav_svg ${page == 'settings' && 'selected'} svg_46`} width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clipPath="url(#clip0_385_16)"> <path d="M18.9956 3.52167C19.2131 2.21183 20.3489 1.25 21.6781 1.25H24.3195C25.6486 1.25 26.7845 2.21183 27.002 3.52167L27.3621 5.68217C27.5312 6.70683 28.2901 7.5285 29.2471 7.92967C30.2089 8.326 31.3133 8.27283 32.1591 7.66867L33.9402 6.39508C34.4641 6.02063 35.1038 5.84426 35.7455 5.89736C36.3872 5.95047 36.9892 6.22961 37.4444 6.68508L39.3125 8.55558C40.255 9.49567 40.3758 10.9771 39.6025 12.0598L38.3289 13.8408C37.7247 14.6867 37.6716 15.7887 38.0703 16.7505C38.4691 17.7099 39.2907 18.4663 40.3178 18.6355L42.4759 18.998C43.7881 19.2155 44.7476 20.3489 44.7476 21.6781V24.3219C44.7476 25.6511 43.7881 26.7869 42.4759 27.0044L40.3154 27.3645C39.2907 27.5337 38.4691 28.2901 38.0703 29.2495C37.6716 30.2113 37.7247 31.3133 38.3289 32.1592L39.6025 33.9427C40.3758 35.0229 40.2526 36.5043 39.3125 37.4468L37.442 39.3149C36.987 39.7698 36.3854 40.0485 35.7442 40.1016C35.1031 40.1547 34.4639 39.9787 33.9402 39.6049L32.1567 38.3313C31.3109 37.7272 30.2089 37.674 29.2495 38.0728C28.2876 38.4715 27.5336 39.2932 27.3621 40.3178L27.002 42.4783C26.7845 43.7882 25.6486 44.75 24.3195 44.75H21.6756C20.3465 44.75 19.2131 43.7882 18.9931 42.4783L18.6355 40.3178C18.4639 39.2932 17.7075 38.4715 16.7481 38.0703C15.7862 37.674 14.6842 37.7272 13.8384 38.3313L12.0549 39.6049C10.9746 40.3783 9.49323 40.255 8.55073 39.3149L6.68264 37.4444C6.22717 36.9893 5.94803 36.3872 5.89492 35.7455C5.84181 35.1038 6.01819 34.4641 6.39264 33.9403L7.66623 32.1592C8.27039 31.3133 8.32356 30.2113 7.92723 29.2495C7.52848 28.2901 6.70439 27.5337 5.67973 27.3645L3.51922 27.002C2.20939 26.7845 1.24756 25.6487 1.24756 24.3219V21.6781C1.24756 20.3489 2.20939 19.2131 3.51922 18.9956L5.67973 18.6355C6.70439 18.4663 7.52848 17.7099 7.92723 16.7505C8.32598 15.7887 8.27281 14.6867 7.66623 13.8408L6.39506 12.0573C6.02061 11.5335 5.84423 10.8938 5.89734 10.2521C5.95044 9.61035 6.22959 9.00831 6.68506 8.55317L8.55314 6.68508C9.00829 6.22961 9.61032 5.95047 10.252 5.89736C10.8937 5.84426 11.5335 6.02063 12.0573 6.39508L13.8384 7.66867C14.6842 8.27283 15.7886 8.326 16.7481 7.92725C17.7075 7.5285 18.4639 6.70683 18.6331 5.68217L18.9956 3.52167Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/> <path d="M30.25 23C30.25 24.9228 29.4862 26.7669 28.1265 28.1265C26.7669 29.4862 24.9228 30.25 23 30.25C21.0772 30.25 19.2331 29.4862 17.8735 28.1265C16.5138 26.7669 15.75 24.9228 15.75 23C15.75 21.0772 16.5138 19.2331 17.8735 17.8735C19.2331 16.5138 21.0772 15.75 23 15.75C24.9228 15.75 26.7669 16.5138 28.1265 17.8735C29.4862 19.2331 30.25 21.0772 30.25 23Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/> </g> <defs> <clipPath id="clip0_385_16"> <rect width="46" height="46" fill="white"/> </clipPath> </defs> </svg>
                <p className={`nav_button_title ${page == 'settings' && 'selected'}`}>Settings</p>
            </Link>
            <hr className="nav_separator" />
            {page == 'scrumboard' && <>
                {/* <div className="nav_button">
                    <svg className='nav_svg svg_44' width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="0.4" y="0.4" width="43.2" height="43.2" rx="2.6" stroke="black" strokeWidth="0.8"/> <line x1="12.4" y1="7" x2="12.4" y2="37" stroke="black" strokeWidth="0.8"/> <line x1="32.4" y1="7" x2="32.4" y2="27" stroke="black" strokeWidth="0.8"/> <line x1="22.4" y1="7" x2="22.4" y2="32" stroke="black" strokeWidth="0.8"/> </svg>
                    <p className="nav_button_title">Switch to list</p>
                </div> */}
                <div className='nav_button' onClick={toggleTeamClass}>
                    <svg className='nav_svg svg_44' width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.9294 8.00573C16.4347 7.93886 18.0869 8.45945 19.2188 9.47111C20.5437 10.6554 21.3168 12.1381 21.4195 13.9254C21.511 15.5175 20.939 17.1439 19.8767 18.3329C18.7176 19.6304 17.1711 20.3537 15.4395 20.452C13.9372 20.5256 12.3605 19.9741 11.2184 18.999C9.98754 17.9483 9.12659 16.4503 9.0071 14.8161C8.88233 13.1099 9.36886 11.4518 10.5037 10.1519C11.6567 8.83134 13.1913 8.12522 14.9294 8.00573ZM14.6437 8.42792C14.241 8.48603 13.8425 8.54678 13.4528 8.66828C12.2884 9.0312 11.2524 9.7891 10.5242 10.7632C9.60669 11.9905 9.22046 13.5838 9.44089 15.0976C9.64919 16.5276 10.4793 17.9718 11.6454 18.8339C12.8706 19.7398 14.2655 20.1569 15.7849 20.0188C16.2163 19.9622 16.6315 19.889 17.0463 19.7539C18.1532 19.3935 19.1418 18.6549 19.8482 17.7369C20.7362 16.5833 21.1785 15.0206 20.992 13.5721C20.792 12.0172 20.0266 10.5834 18.7718 9.62436C17.8588 8.92668 16.7961 8.50491 15.6466 8.42043C15.3137 8.39596 14.9766 8.41252 14.6437 8.42792Z" stroke="black" strokeWidth="0.7"/> <path d="M30.8906 12.5081C31.3009 12.4833 31.7516 12.5159 32.1535 12.5993C33.4949 12.8778 34.7506 13.68 35.5031 14.8358C36.2533 15.9881 36.5894 17.4447 36.2915 18.8034C36.0799 19.768 35.657 20.6294 34.9807 21.3549C34.0516 22.3517 32.7457 22.9825 31.3788 23.0274C30.9059 23.0693 30.3583 23.0238 29.8985 22.9003C29.1127 22.6894 28.3641 22.3376 27.7429 21.805C26.6914 20.9035 25.9787 19.6405 25.8783 18.2444C25.7752 16.8106 26.1935 15.3941 27.1511 14.3063C28.1301 13.1943 29.4204 12.6023 30.8906 12.5081ZM30.6374 12.9288C29.3244 13.059 28.1573 13.7043 27.3241 14.7256C26.5016 15.7335 26.1543 17.0444 26.2882 18.33C26.4181 19.5775 27.0853 20.7693 28.0621 21.5539C29.0716 22.365 30.2871 22.7081 31.5726 22.6156C32.9852 22.4406 34.1386 21.8205 35.0157 20.6915C35.7422 19.7563 36.1155 18.4465 35.9705 17.2693C35.8068 15.9414 35.168 14.7355 34.1007 13.9123C33.4069 13.3772 32.5468 13.0171 31.6716 12.9284C31.3356 12.8942 30.9744 12.9093 30.6374 12.9288Z" stroke="black" strokeWidth="0.7"/> <path d="M15.1248 21.0546C18.2551 20.9201 21.2486 22.1464 23.3844 24.4379C23.682 24.7572 23.9556 25.0951 24.2119 25.4482L24.4268 25.7586C24.4671 25.8229 24.5129 25.9258 24.5795 25.9656C24.6221 25.9911 24.6287 25.9787 24.6743 25.9684C24.8135 25.7787 25.0135 25.6228 25.1927 25.4716C25.8852 24.8871 26.6457 24.3982 27.481 24.042C29.6714 23.1077 32.1348 23.0725 34.3466 23.9571C36.6458 24.8767 38.3693 26.6745 39.328 28.9365C39.5984 29.5747 39.7763 30.2918 39.8768 30.9759C39.9998 31.8136 39.9665 32.6807 39.9666 33.5251C39.9666 33.9829 39.9984 34.4715 39.9415 34.9253C39.9175 35.1178 39.8626 35.2873 39.7882 35.4655C39.5861 35.9495 39.1589 36.3994 38.6684 36.5956C38.4099 36.699 38.188 36.7544 37.9071 36.7673L32.4153 36.7738L24.8013 36.7814C24.5929 36.7853 24.4026 36.8597 24.2019 36.9081C24.0361 36.9481 23.8439 36.9603 23.6735 36.9651L20.64 36.9686L14.7234 36.9697L9.98797 36.9696L7.50144 36.9627C7.23081 36.9508 6.98855 36.9187 6.73363 36.8266L6.59768 36.776L6.56224 36.7614L6.47713 36.7252C5.87179 36.4374 5.40233 35.9335 5.16575 35.3076C5.08321 35.0893 5.03741 34.8601 5.02236 34.6271C4.98067 33.9815 5.00995 33.3165 5.01053 32.6691C5.01111 32.0245 4.99233 31.3697 5.05007 30.7273C5.26016 28.3902 6.21145 26.2674 7.76775 24.5173C9.65227 22.3982 12.3171 21.2243 15.1248 21.0546ZM14.935 21.4753C14.4183 21.5201 13.9127 21.5765 13.4045 21.6846C11.248 22.1433 9.21109 23.3936 7.80024 25.0859C6.44644 26.7098 5.62316 28.6959 5.44198 30.8044C5.38745 31.439 5.40621 32.0843 5.4058 32.7209C5.40538 33.3679 5.35766 34.0582 5.42173 34.701C5.45282 35.0128 5.59648 35.3542 5.77072 35.6108L5.79958 35.6541C6.11136 36.1181 6.61498 36.4208 7.15877 36.5246C7.52612 36.5948 7.92511 36.5655 8.29826 36.5658L9.9904 36.5662L16.3313 36.5646L20.9929 36.5657L22.7006 36.5648C23.266 36.5643 23.8275 36.6086 24.375 36.445C24.8666 36.2982 25.33 35.8684 25.5668 35.4208C25.6913 35.1854 25.7636 34.9349 25.7977 34.6712C25.8565 34.2176 25.8144 33.7096 25.8143 33.251C25.814 32.4066 25.858 31.5377 25.7733 30.6984C25.7079 30.0505 25.594 29.3742 25.3964 28.7533C25.2824 28.3948 25.1691 28.033 25.019 27.6875C24.0541 25.4682 22.3898 23.6461 20.23 22.5413C18.6201 21.7175 16.7395 21.3351 14.935 21.4753ZM30.4378 23.743C29.8473 23.7919 29.2591 23.8761 28.687 24.0343C27.2243 24.4389 25.8814 25.265 24.8304 26.3548C24.8125 26.4449 25.0741 26.8558 25.125 26.9657C25.3699 27.494 25.595 28.0132 25.7614 28.5732C25.9666 29.2639 26.099 29.971 26.172 30.6875C26.2391 31.3456 26.2103 32.0298 26.2111 32.6914L26.2108 33.9614C26.21 34.3838 26.2154 34.7838 26.0932 35.193C25.9431 35.6956 25.638 36.0048 25.3122 36.3911L33.1799 36.3825L36.4249 36.383L37.4178 36.382C37.6772 36.3815 37.938 36.3901 38.193 36.3327C38.5193 36.2589 38.8089 36.0888 39.0461 35.8543C39.2901 35.613 39.4473 35.3269 39.5215 34.9912C39.6293 34.5041 39.5752 33.933 39.5752 33.4328C39.5752 32.8978 39.5938 32.3529 39.5605 31.8191C39.4718 30.3969 39.0531 28.9778 38.2882 27.77C37.0116 25.7543 35.0833 24.4054 32.7509 23.8907C32.0318 23.732 31.1708 23.6697 30.4378 23.743Z" stroke="black" strokeWidth="0.7"/> </svg>
                    <p className='nav_button_title'>Teams</p>
                    <svg className='nav_button_right svg_24' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M19.5 8.25L12 15.75L4.5 8.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                </div>
                {isTeamOpened &&
                    <>
                        <Link className={`nav_button ${selectedTeamId == 'board' ? 'selected' : ''}`} to={'/scrumboard'} onClick={() => toggleSelectedTeam('board')}>
                            <p className='team_title'>My board</p>
                        </Link>
                        {teamsInfo ?
                            (teamsInfo.map(team => 
                            <Link className={`nav_button ${selectedTeamId == team._id ? 'selected' : ''}`} key={team._id} to={`/scrumboard/${team._id}`} onContextMenu={(e) => handleTeamContext(e, team)} onClick={() => toggleSelectedTeam(team._id)}>
                                {/* {isInput ? <input value={team.name} className='team_title_input' onChange={e => setTeamTitle(e.target.value)} onKeyDown={handleTitleInput} /> : <p className='team_title'>{team.name}</p>} */}
                                {inputTeamId === team._id ? <input value={teamTitle} className='team_title_input' onChange={e => setTeamTitle(e.target.value)} onKeyDown={handleTitleInput} /> : <p className='team_title'>{team.name}</p>}
                            </Link>
                            ))
                        :
                            (<p>Loading teams....</p>)}
                    </>
                }
                <div className='nav_button add_join_team_buttons'>
                    <button className='team_button' onClick={toggleIsCreateModal}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M20 7.5V32.5M32.5 20H7.5" stroke="#0057FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                        <p className='create_team_btn_p'>Create</p>
                    </button>
                    <button className='team_button' onClick={toggleIsJoinModal}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M30 12.5V17.5M30 17.5V22.5M30 17.5H35M30 17.5H25M21.25 10.625C21.25 12.1168 20.6574 13.5476 19.6025 14.6025C18.5476 15.6574 17.1168 16.25 15.625 16.25C14.1332 16.25 12.7024 15.6574 11.6475 14.6025C10.5926 13.5476 10 12.1168 10 10.625C10 9.13316 10.5926 7.70242 11.6475 6.64752C12.7024 5.59263 14.1332 5 15.625 5C17.1168 5 18.5476 5.59263 19.6025 6.64752C20.6574 7.70242 21.25 9.13316 21.25 10.625ZM5 32.0583V31.875C5 29.0571 6.11942 26.3546 8.11199 24.362C10.1046 22.3694 12.8071 21.25 15.625 21.25C18.4429 21.25 21.1454 22.3694 23.138 24.362C25.1306 26.3546 26.25 29.0571 26.25 31.875V32.0567C23.0425 33.9885 19.3677 35.0063 15.6233 35C11.7383 35 8.10333 33.925 5 32.0567V32.0583Z" stroke="#0057FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                        <p className='join_team_btn_p'>Join</p>
                    </button>
                </div>
            </>
            }
            {page == 'friends' && 
                <div className='nav_button' onClick={handleAddFriend}>
                    <svg className='nav_svg svg_44' width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22 8.25V35.75M35.75 22H8.25" stroke="black" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                    <p className='nav_button_title'>Add friend</p>
                </div>
            }
            <TeamContextMenu 
                teamContextRef={teamContextRef}
                isToggled={teamContextMenu.toggled}
                positionX={teamContextMenu.position.x}
                positionY={teamContextMenu.position.y}
                clickedTeam={teamContextMenu.clickedTeam}
                buttons={generateButtons()}
            />
            {isAllMembers && <AllMembersPopup toggleIsAllMembers={toggleIsAllMembers} pageId={boardId} teamMembersInfo={teamMembersInfo} />}
        </div>
    )
}

export default Nav
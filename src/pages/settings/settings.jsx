import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/header/header.jsx';
import Nav from '../../components/nav/nav.jsx';
import '../main.css';
import './settings.css'
import { getInitial } from '../../helpers/getInitial.js';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/userContext.jsx';
import { FriendsContext } from '../../contexts/friendsContext.jsx';
import { TeamContext } from '../../contexts/teamsContext.jsx';
import axiosInstance from '../../helpers/axiosInstance.js';

function Settings() {

    const { userInfo, setUserInfo } = useContext(UserContext);
    const { friendsInfo, setFriendsInfo } = useContext(FriendsContext);
    const { teamsInfo, setTeamsInfo } = useContext(TeamContext);
    const [name, setName] = useState(userInfo?.name);
    const [surname, setSurname] = useState(userInfo?.surname);
    const [isChanged, setIsChanged] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        navigate('/login')
        localStorage.clear();
        setUserInfo(null);
        setFriendsInfo(null);
        setTeamsInfo({});
    }

    const checkIsChanged = () => {
        if(name === userInfo?.name && surname === userInfo?.surname) {
            setIsChanged(false);
        } else {
            setIsChanged(true);
        }
    }

    useEffect(() => {
        checkIsChanged();
    }, [name, surname]);

    const deleteAccount = async () => {
        try{
            const response = await axiosInstance.delete('/delete-user');
            logout();
        } catch(error) {
            console.error(error);
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/get-user');
            if(response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if(error.response.status === 401) {
                console.log('error')
            }
        }
    };

    const updateUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.put('/edit-user', {
                name: name,
                surname: surname
            });

            userInfo.name = name;
            userInfo.surname = surname;
            getUserInfo();
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <>
            {/* <Header />
            <div className='wrapper'> */}
                <Nav page='settings' />
                <div className='page'>
                    <div className='settings'>
                        <h1 className='settings-title'>Profile settings</h1>
                        <form className='settings-main' onSubmit={updateUser}>
                            <div className='settings-userInfo'>
                                {/* <div className='settings-avatar'>{getInitial(userInfo?.name)}</div> */}
                                <div className='settings-avatar' style={{background: `linear-gradient(to bottom left, ${userInfo?.gradient[0]}, ${userInfo?.gradient[1]}`}}>{getInitial(userInfo?.name)}</div>
                                <div className='settings-input-div'>
                                    <label>Name</label>
                                    <input type='text' className='settings-input' value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='settings-input-div'>
                                    <label>Surname</label>
                                    <input type='text' className='settings-input' value={surname} onChange={e => setSurname(e.target.value)} />
                                </div>
                            </div>
                            <div className='settings-img-input-wrapper'>
                                <input type='file' className='settings-img-input' disabled />
                                <button type='submit' className='settings-submit' disabled={!isChanged}>Apply changes</button>
                            </div>
                        </form>
                        <div className='settings-acc-button'>
                            <button className='settings-logout' onClick={logout}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.75 15V8.75C13.75 7.75544 14.1451 6.80161 14.8483 6.09835C15.5516 5.39509 16.5054 5 17.5 5H27.5C28.4946 5 29.4484 5.39509 30.1516 6.09835C30.8549 6.80161 31.25 7.75544 31.25 8.75V31.25C31.25 32.2446 30.8549 33.1984 30.1516 33.9016C29.4484 34.6049 28.4946 35 27.5 35H17.5C16.5054 35 15.5516 34.6049 14.8483 33.9016C14.1451 33.1984 13.75 32.2446 13.75 31.25V25M8.75 25L3.75 20M3.75 20L8.75 15M3.75 20H25" stroke="#FF2E2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                <p>Log out</p>
                            </button>
                            <button className='settings-delete-accout' onClick={deleteAccount}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.5667 15L23.99 30M16.01 30L15.4333 15M32.0467 9.65001C32.6167 9.73668 33.1833 9.82835 33.75 9.92668M32.0467 9.65001L30.2667 32.7883C30.194 33.7304 29.7684 34.6103 29.075 35.2521C28.3816 35.8939 27.4715 36.2503 26.5267 36.25H13.4733C12.5285 36.2503 11.6184 35.8939 10.925 35.2521C10.2316 34.6103 9.80598 33.7304 9.73333 32.7883L7.95333 9.65001M32.0467 9.65001C30.1231 9.35921 28.1896 9.13851 26.25 8.98835M7.95333 9.65001C7.38333 9.73501 6.81667 9.82668 6.25 9.92501M7.95333 9.65001C9.87689 9.35921 11.8104 9.13851 13.75 8.98835M26.25 8.98835V7.46168C26.25 5.49501 24.7333 3.85501 22.7667 3.79335C20.9227 3.73441 19.0773 3.73441 17.2333 3.79335C15.2667 3.85501 13.75 5.49668 13.75 7.46168V8.98835M26.25 8.98835C22.0895 8.66681 17.9105 8.66681 13.75 8.98835" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                                <p>Delete account</p>
                            </button>
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </>
    )
}

export default Settings
import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../components/header/header.jsx';
import Nav from '../../components/nav/nav.jsx';
import './friends.css'
import '../main.css'
import { getInitial } from '../../helpers/getInitial.js';
import { FriendsContext } from '../../contexts/friendsContext.jsx';
import axiosInstance from '../../helpers/axiosInstance.js';
import AddFriendModal from '../../components/modals/addFriend/addFriend.jsx';
import FriendsContextMenu from '../../components/contextMenus/friendsContextMenu/friendsContextMenu.jsx';
import Profile from '../../components/modals/profile/profile.jsx';

function Friends() {

    const [selectedFriend, setSelectedFriend] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const friendsContextMenuRef = useRef(null);
    const menuJustOpened = useRef(false);

    const [contextMenu, setContextMenu] = useState({
        position: {
            x: 0,
            y: 0
        },
        opened: false
    })

    function handleContextMenu(e, clickedFriend) {
        e.preventDefault();
        menuJustOpened.current = true;

        const friendsContextMenuAttr = friendsContextMenuRef.current.getBoundingClientRect();

        const isLeft = e.clientX < window?.innerWidth / 2;

        let x;
        let y = e.clientY;

        if(isLeft) {
            x = e.clientX;
        } else {
            x = e.clientX - friendsContextMenuAttr.width
        }

        setContextMenu({
            position: {
                x,
                y
            },
            opened: true,
            clickedFriend
        });
        setTimeout(() => {
            menuJustOpened.current = false;
        }, 100);
    };

    function resetFriendsContextMenu() {
        setContextMenu({
            position: {
                x: 0,
                y: 0
            },
            opened: false
        })
    }

    useEffect(() => {
        function handler(e) {
            if(friendsContextMenuRef.current) {
                if(!menuJustOpened.current && !friendsContextMenuRef.current.contains(e.target)) {
                    resetFriendsContextMenu();
                }
            }
        }

        document.addEventListener('click', handler);

        return () => {
            document.removeEventListener('click', handler);
        }
    })

    const { friendsInfo, setFriendsInfo } = useContext(FriendsContext);

    const [ isAddFriendOpened, setIsAddFriendOpened ] = useState(false);

    const [ isProfile, setIsProfile ] = useState(false)

    const handleOpenAddFriend = () => {
        setIsAddFriendOpened(!isAddFriendOpened);
    }

    const handleProfile = (friend) => {
        console.log(contextMenu.clickedFriend);
        setSelectedFriend(friend);
        setIsProfile(!isProfile);
        if(contextMenu.opened) {
            setContextMenu({
                position: {
                    x: 0,
                    y: 0
                },
                opened: false
            })
        }
    }

    const getAllFriends = async () => {
        try {
            const response = await axiosInstance.get('/get-all-friends');
            if(response.data && response.data.friends) {
                setFriendsInfo(response.data.friends);
            }
        } catch(error) {
            if(error.response.status === 401) {
                console.log("da")
            }
        }
    }

    const deleteFriend = async (friendEmail) => {
        try {
            const response = await axiosInstance.delete('/delete-friend/' + friendEmail);
            if(response.status === 200) {
                getAllFriends();
            }
        } catch(error) {
            console.error('Error: ' + error)
        }
    }

    useEffect(() => {
        if(!friendsInfo) {
            getAllFriends();
        }
    }, [friendsInfo]);

    return (
        <>
                <Nav page='friends' handleAddFriend={handleOpenAddFriend} />
                <div className='page'>
                    <input className='friend_search' value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                    <div className='friends'>
                        {!searchInput ? 
                        friendsInfo?.map((friend, index) => (
                        <React.Fragment key={friend?._id}>
                            <div className='friend' onContextMenu={(e) => handleContextMenu(e, friend)} onClick={() => handleProfile(friend)}>
                                <div className='friend_avatar' style={{background: `linear-gradient(to bottom left, ${friend?.gradient[0]}, ${friend?.gradient[1]}`}}>{getInitial(friend?.name)}</div>
                                <div className='friend_body'>
                                    <p className='friend_name_body'>{friend?.name} {friend?.surname || ''}</p>
                                    <p className='friend_status_body'>Offline</p>
                                </div>
                            </div>
                        </React.Fragment>))
                        :
                        friendsInfo?.map((friend, index) => {
                            if(friend?.name.toLowerCase().includes(searchInput.toLowerCase())) {
                                return <React.Fragment key={friend?._id}>
                                    <div className='friend' onContextMenu={(e) => handleContextMenu(e, friend)} onClick={() => handleProfile(friend)}>
                                        <div className='friend_avatar' style={{background: `linear-gradient(to bottom left, ${friend?.gradient[0]}, ${friend?.gradient[1]}`}}>{getInitial(friend?.name)}</div>
                                        <div className='friend_body'>
                                            <p className='friend_name_body'>{friend?.name} {friend?.surname || ''}</p>
                                            <p className='friend_status_body'>Offline</p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            }
                        })}
                        <FriendsContextMenu 
                            friendsContextMenuRef={friendsContextMenuRef}
                            isOpened={contextMenu.opened}
                            positionX={contextMenu.position.x}
                            positionY={contextMenu.position.y}
                            clickedFriend={contextMenu.clickedFriend}
                            buttons={[
                                {
                                    text: 'View profile',
                                    svg: <svg className='svg_50' width="50" height="48" viewBox="0 0 50 48" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M4.24162 24.644C4.09785 24.2292 4.09785 23.7808 4.24162 23.366C7.1312 15.02 15.3333 9 25 9C34.6625 9 42.8604 15.014 45.7562 23.356C45.902 23.77 45.902 24.218 45.7562 24.634C42.8687 32.98 34.6666 39 25 39C15.3375 39 7.13745 32.986 4.24162 24.644Z" stroke="black" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/> <path d="M31.25 24C31.25 25.5913 30.5915 27.1174 29.4194 28.2426C28.2473 29.3679 26.6576 30 25 30C23.3424 30 21.7527 29.3679 20.5806 28.2426C19.4085 27.1174 18.75 25.5913 18.75 24C18.75 22.4087 19.4085 20.8826 20.5806 19.7574C21.7527 18.6321 23.3424 18 25 18C26.6576 18 28.2473 18.6321 29.4194 19.7574C30.5915 20.8826 31.25 22.4087 31.25 24Z" stroke="black" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/> </svg>,
                                    onClick: () => handleProfile(contextMenu.clickedFriend)
                                },
                                {
                                    text: 'Delete friend',
                                    svg: <svg className='svg_50' width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11 33L33 11M11 11L33 33" stroke="#FF2E2E" strokeLinecap="round" strokeLinejoin="round"/> </svg>,
                                    onClick: (e, clickedFriend) => {deleteFriend(clickedFriend.email); resetFriendsContextMenu(); console.log(clickedFriend.email)}
                                }
                            ]}
                        />
                    </div>
                </div>
            {isAddFriendOpened && <AddFriendModal handleAddFriend={handleOpenAddFriend} getAllFriends={getAllFriends} />}
            {isProfile && <Profile handleProfile={handleProfile} friend={selectedFriend} getAllFriends={getAllFriends} deleteFriend={deleteFriend} setIsOpened={setIsProfile} />}
        </>
    )
}

export default Friends
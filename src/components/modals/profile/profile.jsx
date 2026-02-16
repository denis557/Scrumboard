import React, { useContext } from 'react';
import './profile.css'
import { getInitial } from '../../../helpers/getInitial.js';

function Profile({ handleProfile, friend, deleteFriend, setIsOpened }) {

    return (
        <div className='profile-body'>
            <div className='overlay' onClick={handleProfile}></div>
            <div className='profile'>
                <div className='profile-main'>
                    <div className='profile-user-info'>
                        <div className='profile-avatar' style={{background: `linear-gradient(to bottom left, ${friend?.gradient[0]}, ${friend?.gradient[1]}`}}>{getInitial(friend?.name)}</div>
                        <div className='profile-info-body'>
                            <h3>{friend?.name} {friend?.surname || ''}</h3>
                            <p>Offline</p>
                        </div>
                        <svg className='svg_50 close-profile' onClick={handleProfile} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 37.5L37.5 12.5M12.5 12.5L37.5 37.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p className='profile-email'>{friend?.email}</p>
                    <button className='profile-delete-friend' onClick={() => {deleteFriend(friend?.email); setIsOpened(false)}}>
                        <svg className='svg_60' width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M55 26.25H40M34.375 15.9375C34.375 17.0455 34.1568 18.1427 33.7327 19.1664C33.3087 20.1901 32.6872 21.1202 31.9037 21.9037C31.1202 22.6872 30.1901 23.3087 29.1664 23.7327C28.1427 24.1568 27.0455 24.375 25.9375 24.375C24.8295 24.375 23.7323 24.1568 22.7086 23.7327C21.6849 23.3087 20.7548 22.6872 19.9713 21.9037C19.1878 21.1202 18.5663 20.1901 18.1423 19.1664C17.7182 18.1427 17.5 17.0455 17.5 15.9375C17.5 13.6997 18.3889 11.5536 19.9713 9.97129C21.5536 8.38895 23.6997 7.5 25.9375 7.5C28.1753 7.5 30.3214 8.38895 31.9037 9.97129C33.4861 11.5536 34.375 13.6997 34.375 15.9375ZM10 48.0875V47.8125C10 43.5856 11.6791 39.5318 14.668 36.543C17.6568 33.5541 21.7106 31.875 25.9375 31.875C30.1644 31.875 34.2182 33.5541 37.207 36.543C40.1959 39.5318 41.875 43.5856 41.875 47.8125V48.085C37.0637 50.9827 31.5515 52.5095 25.935 52.5C20.1075 52.5 14.655 50.8875 10 48.085V48.0875Z" stroke="#FF2E2E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/> </svg>
                        <p>Delete friend</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile
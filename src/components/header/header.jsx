import React, { useContext } from 'react';
import './header.css'
import { getInitial } from '../../helpers/getInitial';
import { UserContext } from '../../contexts/userContext.jsx';
import { Link } from 'react-router-dom';

function Header() {

    const { userInfo, setUserInfo } = useContext(UserContext);

    return(
        <div className='header'>
            {/* <input className='search' /> */}
            <Link to='/settings' className='header_settings_link' style={{background: `linear-gradient(to bottom left, ${userInfo?.gradient[0]}, ${userInfo?.gradient[1]}`}}>
                <p className='header_avatar_p'>{getInitial(userInfo?.name)}</p>
            </Link>
        </div>
    )
}

export default Header;
import React from 'react';
import Search from '../../assets/header/account.svg'
import './header.css'

function Header() {
    return(
        <div className='header'>
            <input className='search'></input>
            <img src={Search} className="avatar"></img>
        </div>
    )
}

export default Header;
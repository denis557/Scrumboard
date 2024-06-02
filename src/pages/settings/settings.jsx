import React from 'react';
import Header from '../../components/header/header.jsx';
import Nav from '../../components/nav/nav.jsx';
import '../main.css'

function Settings() {
    return (
        <>
            <Header />
            <div className='wrapper'>
                <Nav page='settings' />
                <div className='page'>
                    <h1>Settings</h1>
                </div>
            </div>
        </>
    )
}

export default Settings
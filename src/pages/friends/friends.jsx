import React from 'react';
import Header from '../../components/header/header.jsx';
import Nav from '../../components/nav/nav.jsx';
import '../main.css'

function Friends() {
    return (
        <>
            <Header page='friends' />
            <div className='wrapper'>
                <Nav page='friends' />
                <div className='page'>
                    <h1>Friends</h1>
                </div>
            </div>
        </>
    )
}

export default Friends
import React from 'react';
import Header from '../../components/header/header.jsx';
import Nav from '../../components/nav/nav.jsx';
import '../main.css'

function Scrumboard() {
    return (
        <>
            <Header page='scrumboard' />
            <div className='wrapper'>
                <Nav page="scrumboard" />
                <div className='page'>
                    <h1>Scrumboard</h1>
                </div>
            </div>
        </>
    )
}

export default Scrumboard
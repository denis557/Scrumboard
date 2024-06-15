import React from 'react';
import './teamContextMenu.css'

function TeamContextMenu({
    clickedTeam,
    positionX,
    positionY,
    isToggled,
    buttons,
    teamContextRef
}) {
    return (
        <menu
            style={{
                top: positionY + 2 + 'px',
                left: positionX + 2 + 'px'
            }}
            className={`team-context-menu ${isToggled ? 'active' : ''}`}
            ref={teamContextRef}
        >
            {buttons.map((button, index) => {
                function handleClick(e) {
                    e.stopPropagation();
                    button.onClick(e, clickedTeam)
                }

                return (<button onClick={handleClick} key={index} className='team-context-menu-btn'>{button.svg}<span className={button.color}>{button.text}</span></button>)
            })}
        </menu>
    )
}

export default TeamContextMenu
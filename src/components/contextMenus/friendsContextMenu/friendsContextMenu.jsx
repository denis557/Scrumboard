import React from 'react';
import './friendsContextMenu.css';

const FriendsContextMenu = ({
    clickedFriend,
    positionY,
    positionX,
    isOpened,
    buttons,
    friendsContextMenuRef
}) => {
    return (
        <menu
        style={{
            top: positionY + 2 + 'px',
            left: positionX + 2 + 'px'
        }}
        className={`context-menu ${isOpened ? 'active' : ''}`}
        ref={friendsContextMenuRef}
        >
            {buttons.map((button, index) => {

                function handleClick(e) {
                    e.stopPropagation();
                    button.onClick(e, clickedFriend)
                }

                return (<button onClick={handleClick} key={index} className='context-menu-btn'>{button.svg}<span>{button.text}</span></button>)
            })}
        </menu>
    )
}

export default FriendsContextMenu
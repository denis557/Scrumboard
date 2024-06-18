import React from 'react';
import './memberContextMenu.css';

function MemberContextMenu({ clickedMember, positionX, positionY, isToggled, buttons, memberContextMenuRef }) {
    return(
        <menu
            style={{
                top: positionY + 2 + 'px',
                left: positionX + 2 + 'px'
            }}
            className={`team-context-menu ${isToggled ? 'active' : ''}`}
            ref={memberContextMenuRef}
        >
            {buttons.map((button, index) => {

                function handleClick(e) {
                    e.stopPropagation();
                    button.onClick(e, clickedMember);
                }

                return (
                    <button onClick={handleClick} key={index} className='team-context-menu-btn'><span className={button.color}>{button.text}</span></button>
                )
            })}
        </menu>
    )
}

export default MemberContextMenu
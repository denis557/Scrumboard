import React from 'react';
import './blockContextMenu.css';

const BlockContextMenu = ({
    clickedBlock,
    positionY,
    positionX,
    isToggled,
    buttons,
    blockContextMenuRef
}) => {
    return (
        <menu 
            style={{
                top: positionY + 2 + 'px',
                left: positionX + 2 + 'px'
            }}
            className={`block-context-menu ${isToggled ? 'active' : ''}`}
            ref={blockContextMenuRef}
        >
            {buttons.map((button, index) => {

                function handleClick(e) {
                    e.stopPropagation();
                    button.onClick(e, clickedBlock);
                }

                return(
                    <button onClick={handleClick} key={index} className={'block-context-menu-button'}>{button.svg}<span className={button.color}>{button.text}</span></button>
                )
            })}
        </menu>
    )
}

export default BlockContextMenu
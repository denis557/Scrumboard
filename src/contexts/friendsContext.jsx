import React, { useState, createContext } from 'react';

export const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {

    const [friendsInfo, setFriendsInfo] = useState(null);

    return (
        <FriendsContext.Provider value={{ friendsInfo, setFriendsInfo }}>
            {children}
        </FriendsContext.Provider>
    );
};
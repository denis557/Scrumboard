import React, { useState, createContext } from 'react';

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {

    const [teamsInfo, setTeamsInfo] = useState([]);

    return (
        <TeamContext.Provider value={{ teamsInfo, setTeamsInfo }}>
            {children}
        </TeamContext.Provider>
    );
};
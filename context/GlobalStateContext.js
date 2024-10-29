import { createContext, useContext, useState } from 'react';


/**
 * @description - Global state context for user, room, and channel
 */


const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [room, setRoom] = useState('Public Room');
    const [channel, setChannel] = useState('public-room');

    return (
        <GlobalStateContext.Provider value={{ user, setUser, room, setRoom, channel, setChannel }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);
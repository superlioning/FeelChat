import { createContext, useContext, useState } from 'react';


/**
 * @description - Global state context for user, room, and channel
 */


const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {

    // Define initial state values
    const initialUser = null;
    const initialRoom = 'Public Room';
    const initialChannel = 'public-room';

    // State management
    const [user, setUser] = useState(initialUser);
    const [room, setRoom] = useState(initialRoom);
    const [channel, setChannel] = useState(initialChannel);

    // Method to reinitialize states
    const reinitialize = () => {
        setUser(initialUser);
        setRoom(initialRoom);
        setChannel(initialChannel);
    };

    return (
        <GlobalStateContext.Provider value={{ user, setUser, room, setRoom, channel, setChannel, reinitialize }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);
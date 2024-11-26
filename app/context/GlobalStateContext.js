'use client';

import { createContext, useContext, useState } from 'react';

// Create a new context for the global state
const GlobalStateContext = createContext();

// Define a provider component to encapsulate the global state
export const GlobalStateProvider = ({ children }) => {
  // Define initial state values
  const initialUser = null;
  const initialRoom = null;
  const initialChannel = null;

  // State management using React's useState hook
  const [user, setUser] = useState(initialUser);
  const [room, setRoom] = useState(initialRoom);
  const [channel, setChannel] = useState(initialChannel);

  // Method to reinitialize room and channel states when exiting chat
  const exitChat = () => {
    setRoom(initialRoom);
    setChannel(initialChannel);
  };

  // Method to reinitialize user, room, and channel states upon logout
  const logout = () => {
    setUser(initialUser);
    setRoom(initialRoom);
    setChannel(initialChannel);
  };

  // Provide the state values and methods to the context consumers
  return (
    <GlobalStateContext.Provider value={{ user, setUser, room, setRoom, channel, setChannel, exitChat, logout }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
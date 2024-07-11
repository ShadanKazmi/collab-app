// import React, { createContext, useState } from 'react';

// export const MessageContext = createContext();

// export const MessageProvider = ({ children }) => {
//   const [selectedUser, setSelectedUser] = useState(null); // To store the selected user for messaging
//   const [chats, setChats] = useState([]); // Array to store chats

//   const addChat = (chat) => {
//     setChats([...chats, chat]);
//   };


//   return (
//     <MessageContext.Provider value={{ selectedUser, setSelectedUser,chats, addChat  }}>
//       {children}
//     </MessageContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);

  // Function to add a chat to the state and cookies
  const addChat = (chat) => {
    const updatedChats = [...chats, chat];
    setChats(updatedChats);
    Cookies.set('chats', JSON.stringify(updatedChats), { expires: 7 }); // Set cookie with 7 days expiration
  };

  useEffect(() => {
    // Retrieve chats from cookies on component mount
    const storedChats = Cookies.get('chats');
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <MessageContext.Provider value={{ selectedUser, setSelectedUser, chats, addChat }}>
      {children}
    </MessageContext.Provider>
  );
};

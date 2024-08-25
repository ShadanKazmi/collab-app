import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);

  const addChat = (chat) => {
    const updatedChats = [...chats, chat];
    setChats(updatedChats);
    Cookies.set('chats', JSON.stringify(updatedChats), { expires: 7 });
  };

  const updateChatSubtitle = (userId, newSubtitle) => {
    setChats(prevChats => prevChats.map(chat =>
      chat.userId === userId ? { ...chat, messages: [...chat.messages, { textContent: newSubtitle }] } : chat
    ));
  };


  useEffect(() => {
    const storedChats = Cookies.get('chats');
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  return (
    <MessageContext.Provider value={{ selectedUser, setSelectedUser, chats, addChat }}>
      {children}
    </MessageContext.Provider>
  );
};

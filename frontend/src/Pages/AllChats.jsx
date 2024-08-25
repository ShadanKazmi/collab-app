import React, { useContext, useEffect } from 'react';
import { MessageContext } from '../api/ChatContext'; 
import { useNavigate } from 'react-router-dom';
import SearchBar from '../Components/SearchBar';
import { Header } from 'semantic-ui-react';
import { ChatList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import socketIOClient from "socket.io-client"; 

const ENDPOINT = "https://collab-app-backend.onrender.com"; 

const AllChats = () => {
  const navigate = useNavigate();
  const { chats, addChat, updateChatSubtitle } = useContext(MessageContext);
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    socket.on('newMessageNotification', (message) => {
      const { userId, textContent } = message;
      updateChatSubtitle(userId, textContent);
    });

    return () => socket.disconnect();
  }, [socket, updateChatSubtitle]);

  const handleChatClick = (chat) => {
    navigate(`/chat/${chat.userId}`);
  };

  const handleUserSelect = (selectedUser) => {
    const userId = selectedUser._id;
    navigate(`/chat/${userId}`);
    const newChat = {
      userId: selectedUser._id,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      messages: []
    };
    addChat(newChat);
  };

  const chatItems = chats.map(chat => ({
    avatar: chat.avatar || 'https://react.semantic-ui.com/images/avatar/large/elliot.jpg', 
    alt: `${chat.firstName} ${chat.lastName}`,
    title: `${chat.firstName} ${chat.lastName}`,
    subtitle: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].textContent : 'No messages yet',
    date: chat.messages.length > 0 ? new Date(chat.messages[chat.messages.length - 1].createdAt) : null,
    unread: 0,
    userId: chat.userId,
  }));

  return (
    <div style={{ padding: '50px' }}>
      <div className="px-4">
        <Header as="h2">Chats</Header>
        <SearchBar onUserSelect={handleUserSelect} />
      </div>
      <div className="mt-10">
        <ChatList
          className="chat-list"
          dataSource={chatItems}
          onClick={(item) => handleChatClick(item)}
        />
      </div>
    </div>
  );
};

export default AllChats;

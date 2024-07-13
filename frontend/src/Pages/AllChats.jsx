// import React, { useContext } from 'react';
// import { MessageContext } from '../api/ChatContext'; // Ensure this path is correct
// import { useNavigate } from 'react-router-dom';
// import SearchBar from '../Components/SearchBar';
// import { Header, List } from 'semantic-ui-react';

// const AllChats = () => {
//   const navigate = useNavigate();
//   const { chats, addChat } = useContext(MessageContext);

//   const handleChatClick = (user) => {
//     navigate(`/chat/${user.userId}`);
//   };

//   const handleUserSelect = (selectedUser) => {
//     const userId = selectedUser._id;
//     navigate(`/chat/${userId}`);
//     const newChat = {
//       userId: selectedUser._id,
//       firstName: selectedUser.firstName,
//       lastName: selectedUser.lastName,
//       messages: []
//     };
//     addChat(newChat);
//   };

//   return (
//     <div style={{padding:"50px"}}>
//       <div className="px-4">
//         <Header as="h2">Chats</Header>
//         <SearchBar onUserSelect={handleUserSelect} />
//       </div>

//       <div className="mt-10 grid gap-10 grid-rows-1 sm:grid-rows-2 lg:grid-rows-3">
//         {chats.map(chat => (
//           <div key={chat.id} className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer">
//             <List relaxed divided className="p-4" onClick={() => handleChatClick(chat)}>
//               <List.Content>
//                 <List.Header as="h3" className="text-lg font-semibold">{chat.firstName} {chat.lastName}</List.Header>
//                 <List.Description className="text-sm text-gray-600 mt-1"></List.Description>
//               </List.Content>
//             </List>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllChats;


import React, { useContext, useEffect } from 'react';
import { MessageContext } from '../api/ChatContext'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import SearchBar from '../Components/SearchBar';
import { Header } from 'semantic-ui-react';
import { ChatList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'; // Import the styles
import socketIOClient from "socket.io-client"; // Ensure you have this installed

const ENDPOINT = "https://collab-app-backend.onrender.com"; // Update this to your server endpoint

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
    avatar: chat.avatar || 'https://react.semantic-ui.com/images/avatar/large/elliot.jpg', // Default avatar if not provided
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

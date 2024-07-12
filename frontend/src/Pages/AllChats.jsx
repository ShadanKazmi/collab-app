// import React, { useContext } from 'react';
// import { MessageContext } from '../api/ChatContext'; // Ensure this path is correct
// import { useNavigate } from 'react-router-dom';
// import SearchBar from '../Components/SearchBar';
// import { Header } from 'semantic-ui-react';

// const AllChats = () => {
//   const navigate = useNavigate();
//   const { chats, addChat } = useContext(MessageContext);

//   const handleChatClick = (user) => {
//     navigate(`/chat/${user.userId}`);
//   };

//   const handleUserSelect = (selectedUser) => {
        
//         const userId = selectedUser._id;
//         navigate(`/chat/${userId}`)
//         const newChat = {
//             userId: selectedUser._id,
//             firstName: selectedUser.firstName,
//             lastName: selectedUser.lastName,
//             messages: [] 
//           };
//           addChat(newChat);
//       };

//   return (
    
// <div className="container mx-auto px-4 py-8"><div className="px-4 py-3 border-t border-gray-200 sm:px-6">
//     <Header>
//         Chats
//     </Header>
//       <SearchBar onUserSelect={handleUserSelect}/>
//     </div>
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <ul>
//           {chats.map(chat => (
//             <li key={chat.id} className="border-t border-gray-200">
//               <a style={{cursor:"pointer"}} onClick={() => {handleChatClick(chat)}} className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
//                 <div className="px-4 py-4 sm:px-6 w-full">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm leading-5 font-medium text-indigo-600 truncate">{chat.firstName} {chat.lastName}</div>
//                     <div className="ml-2 flex-shrink-0 flex">
//                     </div>
//                   </div>
//                   <div className="mt-2 sm:flex sm:justify-between">
//                   </div>
//                 </div>
//               </a>
//             </li>
//           ))}
//         </ul>

//       </div>
//     </div>
//   );
// };

// export default AllChats;


import React, { useContext } from 'react';
import { MessageContext } from '../api/ChatContext'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import SearchBar from '../Components/SearchBar';
import { Header, List } from 'semantic-ui-react';

const AllChats = () => {
  const navigate = useNavigate();
  const { chats, addChat } = useContext(MessageContext);

  const handleChatClick = (user) => {
    navigate(`/chat/${user.userId}`);
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

  return (
    <div style={{padding:"50px"}}>
      <div className="px-4">
        <Header as="h2">Chats</Header>
        <SearchBar onUserSelect={handleUserSelect} />
      </div>

      <div className="mt-10 grid gap-10 grid-rows-1 sm:grid-rows-2 lg:grid-rows-3">
        {chats.map(chat => (
          <div key={chat.id} className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer">
            <List relaxed divided className="p-4" onClick={() => handleChatClick(chat)}>
              <List.Content>
                <List.Header as="h3" className="text-lg font-semibold">{chat.firstName} {chat.lastName}</List.Header>
                <List.Description className="text-sm text-gray-600 mt-1"></List.Description>
              </List.Content>
            </List>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllChats;

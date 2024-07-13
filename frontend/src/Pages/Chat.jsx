// import React, { useState, useEffect } from 'react';
// import { Form, Button, Icon, Divider, Segment } from 'semantic-ui-react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import io from 'socket.io-client';
// import Cookies from 'js-cookie';
// import { MessageBox, MessageList, Input, Button as ChatButton } from 'react-chat-elements';
// import 'react-chat-elements/dist/main.css';

// const socket = io('https://collab-app-backend.onrender.com');

// const Chat = () => {
//   const { userId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [newFile, setNewFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(`https://collab-app-backend.onrender.com/chat/${Cookies.get('userId')}/${userId}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     socket.on('newChatMessage', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off('newChatMessage');
//     };
//   }, [userId]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setNewFile(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFilePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setFilePreview(null);
//     }
//   };

//   const handleSendMessage = async () => {
//     const fromUser = Cookies.get('userId');
//     if (!fromUser) {
//       console.error('User not found.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('textContent', newMessage);
//     formData.append('fromUser', fromUser);
//     if (newFile) {
//       formData.append('uploadContent', newFile);
//     }

//     try {
//       const response = await axios.post(`https://collab-app-backend.onrender.com/chat/${userId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       socket.emit('newChatMessage', response.data);

//       setNewMessage('');
//       setNewFile(null);
//       setFilePreview(null);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <Segment style={{ maxWidth: '100%', minHeight: '90vh', margin: '30px', marginTop: '2rem', position: 'relative', borderBottom: "20px solid transparent", backgroundColor: '#f4f4f4' }}>
//       <Divider horizontal>Chat</Divider>
//       <div style={{ marginBottom: '80px', overflowY: 'auto', maxHeight: 'calc(85vh - 200px)' }}>
//         <MessageList
//           className='message-list'
//           lockable={true}
//           toBottomHeight={'100%'}
//           dataSource={messages.map((message) => ({
//             position: message.fromUser._id === Cookies.get('userId') ? 'right' : 'left',
//             type: 'text',
//             text: message.textContent,
//             date: new Date(message.createdAt),
//             title: `${message.fromUser.firstName} ${message.fromUser.lastName}`,
//             ...(message.uploadContent ? { data: { uri: message.uploadContent, status: { click: 'https://collab-app-backend.onrender.com/chat${message.uploadContent}' } } } : {}),
//             className: message.fromUser._id === Cookies.get('userId') ? 'message-right' : 'message-left',
//           }))}
//         />
//       </div>

//       <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '10px', backgroundColor: '#fff' }}>
//         <Input
//           placeholder="Type your message..."
//           multiline={true}
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           rightButtons={
//             <div>
//               <ChatButton color='white' backgroundColor='#007bff' text='Send' onClick={handleSendMessage} />
//               <Button
//                 as='label'
//                 icon
//                 style={{ marginLeft: '10px', backgroundColor: '#007bff', color: '#fff' }}
//               >
//                 <Icon name='upload' />
//                 <input type='file' hidden onChange={handleFileChange} />
//               </Button>
//               {filePreview && (
//                 <div style={{ marginTop: '10px', maxWidth: '200px' }}>
//                   <img src={filePreview} alt='File Preview' style={{ maxWidth: '100%', maxHeight: '200px' }} />
//                 </div>
//               )}
//             </div>
//           }
//         />
//       </div>
//     </Segment>
//   );
// };

// export default Chat;

import React, { useState, useEffect } from 'react';
import { Form, Button, Icon, Divider, Segment } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { MessageBox, MessageList, Input, Button as ChatButton } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const socket = io('https://collab-app-backend.onrender.com');

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://collab-app-backend.onrender.com/chat/${Cookies.get('userId')}/${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('newChatMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('newChatMessage');
    };
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleSendMessage = async () => {
    const fromUser = Cookies.get('userId');
    if (!fromUser) {
      console.error('User not found.');
      return;
    }

    const formData = new FormData();
    formData.append('textContent', newMessage);
    formData.append('fromUser', fromUser);
    if (newFile) {
      formData.append('uploadContent', newFile);
    }

    try {
      const response = await axios.post(`https://collab-app-backend.onrender.com/chat/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      socket.emit('newChatMessage', response.data);

      setNewMessage('');
      setNewFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Segment className="bg-gray-100 p-6 rounded-lg shadow-lg" style={{ maxWidth: '100%', minHeight: '90vh', margin: '30px', marginTop: '2rem', position: 'relative' }}>
      <Divider horizontal>Chat</Divider>
      <div className="overflow-y-auto max-h-96 mb-8">
        <MessageList
          className="message-list"
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={messages.map((message) => ({
            position: message.fromUser._id === Cookies.get('userId') ? 'right' : 'left',
            type: 'text',
            text: message.textContent,
            date: new Date(message.createdAt),
            title: `${message.fromUser.firstName} ${message.fromUser.lastName}`,
            ...(message.uploadContent ? { data: { uri: message.uploadContent, status: { click: `https://collab-app-backend.onrender.com/chat${message.uploadContent}` } } } : {}),
            className: message.fromUser._id === Cookies.get('userId') ? 'message-right' : 'message-left',
          }))}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-white">
        <Input
          placeholder="Type your message..."
          multiline={true}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rightButtons={
            <div className="flex items-center">
              <ChatButton color='white' backgroundColor='#007bff' text='Send' onClick={handleSendMessage} />
              <Button
                as='label'
                icon
                className="ml-2 bg-blue-500 text-white"
              >
                <Icon name='upload' />
                <input type='file' hidden onChange={handleFileChange} />
              </Button>
              {filePreview && (
                <div className="mt-2 max-w-xs">
                  <img src={filePreview} alt='File Preview' className="max-w-full max-h-52" />
                </div>
              )}
            </div>
          }
        />
      </div>
    </Segment>
  );
};

export default Chat;

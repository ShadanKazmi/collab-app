// import React, { useState, useEffect } from 'react';
// import { Button, Form, Comment, Icon, Divider, CommentAvatar } from 'semantic-ui-react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import io from 'socket.io-client';
// import Cookies from 'js-cookie';

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
//     <div style={{ paddingLeft: '100px', marginTop: '7rem', position: 'relative', overflow: 'hidden' }}>
//       <Divider horizontal>Chat</Divider>
//       <div style={{ paddingBottom: '4rem', marginBottom: '4rem' }}>
//         <Comment.Group threaded size='large'>
//           {messages.map((message) => (
//             <Comment key={message._id}>
//               <Comment.Content>
//                 <CommentAvatar
//                   src={`https://collab-app-backend.onrender.com/chat${message.fromUser.profileImageURL}`}
//                 />
//                 <Comment.Author>{message.fromUser.firstName} {message.fromUser.lastName}</Comment.Author>
//                 <Comment.Metadata>
//                   <span>{new Date(message.createdAt).toLocaleString()}</span>
//                 </Comment.Metadata>
//                 <Comment.Text>{message.textContent}</Comment.Text>
//                 {message.uploadContent && (
//                   <Comment.Text>
//                     <Button icon labelPosition='left'>
//                       <Icon name='file alternate' />
//                       {message.uploadContent.split('/').pop()}
//                     </Button>
//                   </Comment.Text>
//                 )}
//               </Comment.Content>
//             </Comment>
//           ))}
//         </Comment.Group>
//       </div>
//       <div style={{ position: 'relative', bottom: '0', width: '50%', background: 'white', padding: '1rem' }}>
//         <Form reply>
//           <Form.TextArea
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder='Send a message'
//           />
//           {filePreview && (
//             <div>
//               <img src={filePreview} alt="Preview" style={{ maxHeight: '200px', marginBottom: '10px' }} />
//             </div>
//           )}
//           <Button content='Send' labelPosition='left' icon='send' onClick={handleSendMessage} />
//           <Button as="label" icon labelPosition='left'>
//             <Icon name='upload' />
//             Upload File
//             <input type="file" hidden onChange={handleFileChange} />
//           </Button>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Chat;



import React, { useState, useEffect } from 'react';
import { Button, Form, Comment, Icon, Divider, Segment } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

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
    <Segment style={{ maxWidth: '100%', minHeight: '90vh', margin: '30px', marginTop: '2rem', position: 'relative', borderBottom:"20px solid transparent"}}>
      <Divider horizontal>Chat</Divider>
      <Comment.Group threaded style={{ marginBottom: '80px', overflowY: 'auto', maxHeight: 'calc(85vh - 200px)' }}>
        {messages.map((message) => (
          <Comment key={message._id}>
            <Comment.Avatar src={`https://collab-app-backend.onrender.com/chat${message.fromUser.profileImageURL}`} />
            <Comment.Content>
              <Comment.Author>{message.fromUser.firstName} {message.fromUser.lastName}</Comment.Author>
              <Comment.Metadata>{new Date(message.createdAt).toLocaleString()}</Comment.Metadata>
              <Comment.Text>{message.textContent}</Comment.Text>
              {message.uploadContent && (
                <Comment.Action>
                  <Button icon labelPosition='left' as='a' href={message.uploadContent} target='_blank' rel='noopener noreferrer'>
                    <Icon name='file alternate' />
                    {message.uploadContent.split('/').pop()}
                  </Button>
                </Comment.Action>
              )}
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>

      <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%' }}>
        <Form reply>
          <Form.TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type your message...'
          />
          <Button
            content='Send'
            labelPosition='left'
            icon='send'
            primary
            onClick={handleSendMessage}
            style={{ marginTop: '10px' }}
          />
          <Button
            as='label'
            content='Upload File'
            labelPosition='left'
            style={{ marginTop: '10px', marginLeft: '10px' }}
          >
            <Icon name='upload'/>
            <input type='file' hidden onChange={handleFileChange} />
          </Button>
          {filePreview && (
            <div style={{ marginTop: '10px', maxWidth: '200px' }}>
              <img src={filePreview} alt='File Preview' style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}
        </Form>
      </div>
    </Segment>
  );
};

export default Chat;

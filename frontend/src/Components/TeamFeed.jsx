// import React, { useState, useEffect } from 'react';
// import {
//     CommentText,
//     CommentMetadata,
//     CommentGroup,
//     CommentContent,
//     CommentAvatar,
//     CommentActions,
//     CommentAuthor,
//     Comment,
//     Form,
//     FormTextArea,
//     Button,
//     Icon,
//     Divider,
// } from 'semantic-ui-react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import useDownloader from 'react-use-downloader';

// const TeamFeed = () => {
//     const { teamId } = useParams();
//     const navigate = useNavigate();
//     const [comments, setComments] = useState([]);
//     const [newComment, setNewComment] = useState('');
//     const [newFile, setNewFile] = useState(null);
//     const [filePreview, setFilePreview] = useState(null);
//     const [replyText, setReplyText] = useState('');
//     const [replyingIndex, setReplyingIndex] = useState(null);
//     const { download } = useDownloader();

//     useEffect(() => {
//         fetchMessages(); // Initial fetch

//         const interval = setInterval(() => {
//             fetchMessages(); // Fetch messages every 10 seconds (adjust as needed)
//         }, 10000);

//         return () => {
//             clearInterval(interval); // Clean up interval on component unmount
//         };
//     }, [teamId]);

//     const fetchMessages = async () => {
//         try {
//             const response = await axios.get(`https://collab-app-backend.onrender.com/feed/${teamId}`);
//             setComments(response.data);
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//         }
//     };

//     const getCurrentUser = async () => {
//         try {
//             const userId = Cookies.get('userId');
//             if (!userId) {
//                 console.error('User ID not found in cookies.');
//                 return null;
//             }
//             const response = await axios.get(`https://collab-app-backend.onrender.com/userAuth/${userId}`);
//             return response.data;
//         } catch (error) {
//             console.error('Error fetching user:', error);
//             return null;
//         }
//     };

//     const handleAddComment = async () => {
//         if (newComment.trim() !== '' || newFile) {
//             // const currentDate = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
//             const userId = Cookies.get('userId');

//             const currentUser = await getCurrentUser();
//             if (!currentUser) {
//                 console.error('User not found.');
//                 return;
//             }

//             const formData = new FormData();
//             formData.append('textContent', newComment);
//             formData.append('teamId', teamId);
//             formData.append('userId', userId);
//             if (newFile) {
//                 formData.append('uploadContent', newFile);
//             }

//             try {
//                 const response = await axios.post('https://collab-app-backend.onrender.com/feed/', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });

//                 const savedMessage = response.data;
//                 const commentData = {
//                     _id: savedMessage._id,
//                     textContent: newComment,
//                     uploadContent: savedMessage.uploadContent,
//                     createdBy: {
//                         _id: userId,
//                         firstName: currentUser.firstName,
//                         lastName: currentUser.lastName,
//                     },
//                     createdAt: new Date(savedMessage.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
//                     replies: [],
//                 };
//                 setComments([...comments, commentData]);
//                 setNewComment('');
//                 setNewFile(null);
//                 setFilePreview(null);
//             } catch (error) {
//                 console.error('Error adding message:', error);
//             }
//         }
//     };

//     const handleAddReply = async (commentId) => {
//         if (replyText.trim() !== '') {
//             const currentDate = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
//             const userId = Cookies.get('userId');
//             const currentUser = await getCurrentUser();
//             const replyData = {
//                 textContent: replyText,
//                 createdBy: {
//                     _id: userId,
//                     firstName: currentUser.firstName,
//                     lastName: currentUser.lastName,
//                 },
//                 createdAt: currentDate,
//             };

//             try {
//                 const response = await axios.post(`https://collab-app-backend.onrender.com/feed/${commentId}/reply`, {
//                     textContent: replyText,
//                     userId: userId,
//                 });

//                 const updatedComments = comments.map(comment =>
//                     comment._id === commentId
//                         ? {
//                             ...comment,
//                             replies: [...comment.replies, { ...replyData, _id: response.data._id }],
//                         }
//                         : comment
//                 );

//                 setComments(updatedComments);
//                 setReplyText('');
//                 setReplyingIndex(null);
//             } catch (error) {
//                 console.error('Error adding reply:', error);
//             }
//         }
//     };

//     const startReply = (index) => {
//         setReplyingIndex(index);
//     };

//     const handleUserClick = (user) => {
//         navigate('/profile', { state: { user } });
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setNewFile(file);
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setFilePreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         } else {
//             setFilePreview(null);
//         }
//     };

//     const handleFileDownload = (fileUrl) => {
//         const filename = fileUrl.split('/').pop();
//         download(fileUrl, filename);
//     };

//     return (
//         <div style={{ paddingLeft: '100px', marginTop: '7rem', position: 'relative', overflow: 'hidden' }}>
//             <Divider horizontal >Feed</Divider>
//             <div style={{ paddingBottom: '4rem', marginBottom: '4rem' }}>
//                 <CommentGroup threaded size='large'>
//                     {comments.map((comment, index) => (
//                         <Comment key={comment._id}>
//                             <CommentAvatar as='a' src={`https://collab-app-backend.onrender.com/feed${comment.createdBy.profileImageURL}`} />
//                             <CommentContent>
//                                 <CommentAuthor as='a' onClick={() => handleUserClick(comment.createdBy)}>
//                                     {comment.createdBy.firstName} {comment.createdBy.lastName}
//                                 </CommentAuthor>
//                                 <CommentMetadata>
//                                     <span>{comment.createdAt}</span>
//                                 </CommentMetadata>
//                                 <CommentText>{comment.textContent}</CommentText>
//                                 {comment.uploadContent && (
//                                     <CommentText>
//                                         <Button
//                                             icon
//                                             labelPosition='left'
//                                             onClick={() =>
//                                                 handleFileDownload(`https://collab-app-backend.onrender.com/feed${comment.uploadContent}`)
//                                             }
//                                         >
//                                             <Icon name='file alternate' />
//                                             {`https://collab-app-backend.onrender.com/feed${comment.uploadContent}`.split('/').pop()}
//                                         </Button>
//                                     </CommentText>
//                                 )}
//                                 <CommentActions>
//                                     <a onClick={() => startReply(index)}>Reply</a>
//                                 </CommentActions>
//                                 {comment.replies && comment.replies.length > 0 && (
//                                     <CommentGroup style={{ marginTop: '0.1px' }}>
//                                         {comment.replies.map((reply) => (
//                                             <Comment key={reply._id}>
//                                                 <CommentAvatar
//                                                     as='a'
//                                                     src={`https://collab-app-backend.onrender.com/feed${reply.createdBy.profileImageURL}`}
//                                                 />
//                                                 <CommentContent>
//                                                     <CommentAuthor as='a' onClick={() => handleUserClick(reply.createdBy)}>
//                                                         {reply.createdBy.firstName} {reply.createdBy.lastName}
//                                                     </CommentAuthor>
//                                                     <CommentMetadata>
//                                                         <span>{reply.createdAt}</span>
//                                                     </CommentMetadata>
//                                                     <CommentText>{reply.textContent}</CommentText>
//                                                 </CommentContent>
//                                             </Comment>
//                                         ))}
//                                     </CommentGroup>
//                                 )}
//                                 {replyingIndex === index && (
//                                     <Form reply>
//                                         <FormTextArea
//                                             value={replyText}
//                                             onChange={(e) => setReplyText(e.target.value)}
//                                             placeholder='Write a reply...'
//                                         />
//                                         <Button
//                                             content='Add Reply'
//                                             labelPosition='left'
//                                             icon='edit'
//                                             primary
//                                             onClick={() => handleAddReply(comment._id)}
//                                         />
//                                     </Form>
//                                 )}
//                             </CommentContent>
//                         </Comment>
//                     ))}
//                 </CommentGroup>
//             </div>
//             <div style={{ position: 'relative', bottom: '0', width: '50%', background: 'white', padding: '1rem' }}>
//                 <Form reply>
//                     <FormTextArea
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         placeholder='Send a message'
//                     />
//                     {filePreview && (
//                         <div>
//                             <img src={filePreview} alt="Preview" style={{ maxHeight: '200px', marginBottom: '10px' }} />
//                         </div>
//                     )}
//                     <Button content='Send' labelPosition='left' icon='send' onClick={handleAddComment} />
//                     <Button as="label" icon labelPosition='left'>
//                         <Icon name='upload' />
//                         Upload File
//                         <input type="file" hidden onChange={handleFileChange} />
//                     </Button>
//                 </Form>
//             </div>
//         </div>
//     );
// };

// export default TeamFeed;

import React, { useState, useEffect } from 'react';
import {
    CommentText,
    CommentMetadata,
    CommentGroup,
    CommentContent,
    CommentAvatar,
    CommentActions,
    CommentAuthor,
    Comment,
    Form,
    FormTextArea,
    Button,
    Icon,
    Divider,
} from 'semantic-ui-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useDownloader from 'react-use-downloader';

const TeamFeed = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newFile, setNewFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyingIndex, setReplyingIndex] = useState(null);
    const { download } = useDownloader();

    useEffect(() => {
        fetchMessages(); // Initial fetch

        const interval = setInterval(() => {
            fetchMessages(); // Fetch messages every 10 seconds (adjust as needed)
        }, 10000);

        return () => {
            clearInterval(interval); // Clean up interval on component unmount
        };
    }, [teamId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`https://collab-app-backend.onrender.com/feed/${teamId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const getCurrentUser = async () => {
        try {
            const userId = Cookies.get('userId');
            if (!userId) {
                console.error('User ID not found in cookies.');
                return null;
            }
            const response = await axios.get(`https://collab-app-backend.onrender.com/userAuth/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() !== '' || newFile) {
            const userId = Cookies.get('userId');

            const currentUser = await getCurrentUser();
            if (!currentUser) {
                console.error('User not found.');
                return;
            }

            const formData = new FormData();
            formData.append('textContent', newComment);
            formData.append('teamId', teamId);
            formData.append('userId', userId);
            if (newFile) {
                formData.append('uploadContent', newFile);
            }

            try {
                const response = await axios.post('https://collab-app-backend.onrender.com/feed/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const savedMessage = response.data;
                const commentData = {
                    _id: savedMessage._id,
                    textContent: newComment,
                    uploadContent: savedMessage.uploadContent,
                    createdBy: {
                        _id: userId,
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                    },
                    createdAt: new Date(savedMessage.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                    replies: [],
                };
                setComments([...comments, commentData]);
                setNewComment('');
                setNewFile(null);
                setFilePreview(null);
            } catch (error) {
                console.error('Error adding message:', error);
            }
        }
    };

    const handleAddReply = async (commentId) => {
        if (replyText.trim() !== '') {
            const currentDate = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const userId = Cookies.get('userId');
            const currentUser = await getCurrentUser();
            const replyData = {
                textContent: replyText,
                createdBy: {
                    _id: userId,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                },
                createdAt: currentDate,
            };

            try {
                const response = await axios.post(`https://collab-app-backend.onrender.com/feed/${commentId}/reply`, {
                    textContent: replyText,
                    userId: userId,
                });

                const updatedComments = comments.map(comment =>
                    comment._id === commentId
                        ? {
                            ...comment,
                            replies: [...comment.replies, { ...replyData, _id: response.data._id }],
                        }
                        : comment
                );

                setComments(updatedComments);
                setReplyText('');
                setReplyingIndex(null);
            } catch (error) {
                console.error('Error adding reply:', error);
            }
        }
    };

    const startReply = (index) => {
        setReplyingIndex(index);
    };

    const handleUserClick = (user) => {
        navigate('/profile', { state: { user } });
    };

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

    const handleFileDownload = (fileUrl) => {
        const filename = fileUrl.split('/').pop();
        download(fileUrl, filename);
    };

    return (
        <div style={{ paddingLeft: '40px', marginTop: '5rem' }}>
            <Divider horizontal style={{ marginBottom: '2rem' }}>Feed</Divider>
            <Comment.Group threaded size='large'>
                {comments.map((comment, index) => (
                    <Comment key={comment._id}>
                        <Comment.Avatar src={`https://collab-app-backend.onrender.com${comment.createdBy.profileImageURL}`} />
                        <Comment.Content>
                            <Comment.Author as='a' onClick={() => handleUserClick(comment.createdBy)}>
                                {comment.createdBy.firstName} {comment.createdBy.lastName}
                            </Comment.Author>
                            <Comment.Metadata>
                                <div>{comment.createdAt}</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.textContent}</Comment.Text>
                            {comment.uploadContent && (
                                <Comment.Text>
                                    <Button
                                        icon
                                        labelPosition='left'
                                        onClick={() =>
                                            handleFileDownload(`https://collab-app-backend.onrender.com${comment.uploadContent}`)
                                        }
                                    >
                                        <Icon name='file alternate' />
                                        {comment.uploadContent.split('/').pop()}
                                    </Button>
                                </Comment.Text>
                            )}
                            <Comment.Actions>
                                <a onClick={() => startReply(index)}>Reply</a>
                            </Comment.Actions>
                            {comment.replies && comment.replies.length > 0 && (
                                <Comment.Group>
                                    {comment.replies.map((reply) => (
                                        <Comment key={reply._id}>
                                            <Comment.Avatar
                                                src={`https://collab-app-backend.onrender.com${reply.createdBy.profileImageURL}`}
                                            />
                                            <Comment.Content>
                                                <Comment.Author as='a' onClick={() => handleUserClick(reply.createdBy)}>
                                                    {reply.createdBy.firstName} {reply.createdBy.lastName}
                                                </Comment.Author>
                                                <Comment.Metadata>
                                                    <div>{reply.createdAt}</div>
                                                </Comment.Metadata>
                                                <Comment.Text>{reply.textContent}</Comment.Text>
                                            </Comment.Content>
                                        </Comment>
                                    ))}
                                </Comment.Group>
                            )}
                            {replyingIndex === index && (
                                <Form reply>
                                    <Form.TextArea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder='Write a reply...'
                                    />
                                    <Button
                                        content='Add Reply'
                                        labelPosition='left'
                                        icon='edit'
                                        primary
                                        onClick={() => handleAddReply(comment._id)}
                                    />
                                </Form>
                            )}
                        </Comment.Content>
                    </Comment>
                ))}
            </Comment.Group>
            <Form reply style={{ marginTop: '2rem' }}>
                <Form.TextArea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder='Add a new comment...'
                />
                {filePreview && (
                    <div style={{ margin: '1rem 0' }}>
                        <img src={filePreview} alt="Preview" style={{ maxWidth: '100%', marginBottom: '1rem', borderRadius: '4px' }} />
                    </div>
                )}
                <Button
                    content='Add Comment'
                    labelPosition='left'
                    icon='send'
                    primary
                    onClick={handleAddComment}
                    style={{ marginBottom: '1rem' }}
                />
                <Button as="label" icon labelPosition='left' style={{ marginBottom: '1rem' }}>
                    <Icon name='upload' />
                    Upload File
                    <input type="file" hidden onChange={handleFileChange} />
                </Button>
            </Form>
        </div>
    );
};

export default TeamFeed;
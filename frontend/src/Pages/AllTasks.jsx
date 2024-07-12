// import React, { useState, useEffect } from 'react';
// import { List, Segment, Header } from 'semantic-ui-react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const AllTasks = () => {
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     const userId = Cookies.get('userId');
//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get(`https://collab-app-backend.onrender.com/files/tasks/${userId}`);
//         setTasks(response.data.tasks);
//       } catch (error) {
//         console.error('Error fetching tasks:', error);
//       }
//     };

//     fetchTasks();
//   }, []);

//   const formatDateTime = (dateTimeString) => {
//     const dateTime = new Date(dateTimeString);
//     return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
//   };

//   return (
//     <Segment>
//       <Header as='h2'>All Tasks</Header>
//       {tasks.length > 0 ? (
//         <List divided relaxed>
//           {tasks.map(task => (
//             <List.Item key={task._id}>
//               <List.Icon name='tasks' />
//               <List.Content>
//                 <List.Description>Team: {task.teamId.teamName}</List.Description>
//                 <List.Header>{task.taskTitle}</List.Header>
//                 <List.Description>{task.taskDetail}</List.Description>
//                 <List.Description>Created by: {task.createdBy.firstName} {task.createdBy.lastName}</List.Description>
//                 <List.Description>At: {formatDateTime(task.createdAt)}</List.Description>
//                 {task.taskContent && (
//                   <List.Description>
//                     <a href={task.taskContent} target="_blank" rel="noopener noreferrer">View Attached File</a>
//                   </List.Description>
//                 )}
//               </List.Content>
//             </List.Item>
//           ))}
//         </List>
//       ) : (
//         <p>No tasks available.</p>
//       )}
//     </Segment>
//   );
// };

// export default AllTasks;


import React, { useState, useEffect } from 'react';
import { List, Segment, Header, Icon, Divider, Modal, Button } from 'semantic-ui-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsModalOpen, setTaskDetailsModalOpen] = useState(false);

  useEffect(() => {
    const userId = Cookies.get('userId');
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`https://collab-app-backend.onrender.com/files/tasks/${userId}`);
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
  };

  const openTaskDetailsModal = (task) => {
    setSelectedTask(task);
    setTaskDetailsModalOpen(true);
  };

  const closeTaskDetailsModal = () => {
    setSelectedTask(null);
    setTaskDetailsModalOpen(false);
  };

  const handleFileDownload = (fileUrl) => {
    // Implement your file download logic here
    console.log('Downloading file:', fileUrl);
  };

  return (
    <div style={{ padding: "40px" }}>
      <Segment color='black'>
        <Icon name='tasks' size='large' />
        <Header as='h1' textAlign='center' icon>
          All Tasks
          <Header.Subheader>
            Manage all your tasks efficiently
          </Header.Subheader>
        </Header>
        <Divider></Divider>
        {tasks.length > 0 ? (
          <List divided relaxed>
            {tasks.map(task => (
              <List.Item key={task._id}>
                <List.Content>
                  <List.Header as='h3'><Icon name='bullseye' /> {task.taskTitle}</List.Header>
                  <Divider horizontal>Team: {task.teamId.teamName}</Divider>
                  <List.Description>
                  </List.Description>
                  <Button primary onClick={() => openTaskDetailsModal(task)}>View Details</Button>
                </List.Content>
              </List.Item>
            ))}
          </List>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1rem' }}>No tasks available.</p>
        )}
      </Segment>

      {/* Modal for displaying task details */}
      <Modal onClose={closeTaskDetailsModal} open={taskDetailsModalOpen}>
        <Modal.Header>Task Details</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>{selectedTask?.taskTitle}</Header>
            <p>Details: {selectedTask?.taskDetail}</p>
            {selectedTask?.taskContent && (
              <p>
                Task Content:{' '}
                <a
                  href={`https://collab-app-backend.onrender.com/files${selectedTask.taskContent}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() =>
                    handleFileDownload(
                      `https://collab-app-backend.onrender.com/files${selectedTask.taskContent}`
                    )
                  }
                  style={{ cursor: 'pointer' }}
                >
                  Download File
                </a>
              </p>
            )}
            <p>
              Created by: {selectedTask?.createdBy.firstName} {selectedTask?.createdBy.lastName}
            </p>
            <p>Created at: {new Date(selectedTask?.createdAt).toLocaleString()}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeTaskDetailsModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default AllTasks;

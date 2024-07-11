import React, { useState, useEffect } from 'react';
import { Button, Divider, Form, Header, List, Modal, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import useDownloader from 'react-use-downloader';

const TeamTasks = () => {
  const location = useLocation();
  const teamId = location.state.teamId;
  const [taskDetail, setTaskDetail] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // State to store selected task
  const [taskDetailsModalOpen, setTaskDetailsModalOpen] = useState(false); // State for task details modal
  const { download } = useDownloader();

  useEffect(() => {
    fetchTasks();
  }, [teamId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/files/teamtasks/${teamId}`);
      setTasks(response.data.uploadedContents);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskSubmit = async () => {
    const userId = Cookies.get('userId');
    try {
      const formData = new FormData();
      formData.append('taskDetail', taskDetail);
      formData.append('taskTitle', taskTitle);
      formData.append('userId', userId);
      if (file) {
        formData.append('taskContent', file);
      }
      const response = await axios.post(`http://localhost:8000/files/${teamId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTasks([...tasks, response.data]);

      setTaskDetail('');
      setTaskTitle('');
      setFile(null);
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
    const filename = fileUrl.split('/').pop();
    download(fileUrl, filename);
};

  return (
    <Segment>
      <Header as='h2'>Team Tasks</Header>
      
      {tasks.length > 0 ? (
        <List divided relaxed>
          {tasks.map(task => (
            <List.Item key={task._id}>
              <List.Icon name='tasks' />
              <List.Content>
                <List.Header>{task.taskDetail}</List.Header>
                <List.Description>Created by: {task.createdBy.firstName} {task.createdBy.lastName}</List.Description>
                <List.Description>At: {new Date(task.createdAt).toLocaleString()}</List.Description>
                {/* Button to open task details modal */}
                <Button size='mini' primary onClick={() => openTaskDetailsModal(task)}>View Details</Button>
              </List.Content>
            </List.Item>
          ))}
        </List>
      ) : (
        <p>No tasks available.</p>
      )}

      {/* Modal for creating a new task */}

      <Divider></Divider>
      <Modal
        onClose={() => setModalOpen(false)}
        onOpen={() => setModalOpen(true)}
        open={modalOpen}
        trigger={<Button primary>Create Task</Button>}
      >
        <Modal.Header>Create New Task</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label='Task Title'
              placeholder='Enter task title...'
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Form.TextArea
              label='Task Detail'
              placeholder='Enter task details...'
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
            />
            <Form.Input
              type='file'
              label='Task Content (Optional)'
              onChange={handleFileChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button primary onClick={handleTaskSubmit}>Create Task</Button>
        </Modal.Actions>
      </Modal>

      {/* Modal for displaying task details */}
      <Modal
        onClose={closeTaskDetailsModal}
        open={taskDetailsModalOpen}
      >
        <Modal.Header>Task Details</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>{selectedTask?.taskTitle}</Header>
            <p>Details: {selectedTask?.taskDetail}</p>
            {selectedTask?.taskContent && (
              <p>
                Task Content: <a onClick={() => {handleFileDownload(`http://localhost:8000/files${selectedTask.taskContent}`)}}>Download File</a>
              </p>
            )}
            <p>Created by: {selectedTask?.createdBy.firstName} {selectedTask?.createdBy.lastName}</p>
            <p>Created at: {new Date(selectedTask?.createdAt).toLocaleString()}</p>
          </Modal.Description>  
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeTaskDetailsModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
};

export default TeamTasks;

import React, { useState, useEffect } from 'react';
import { List, Segment, Header } from 'semantic-ui-react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const userId = Cookies.get('userId');
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/files/tasks/${userId}`);
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

  return (
    <Segment>
      <Header as='h2'>All Tasks</Header>
      {tasks.length > 0 ? (
        <List divided relaxed>
          {tasks.map(task => (
            <List.Item key={task._id}>
              <List.Icon name='tasks' />
              <List.Content>
                <List.Description>Team: {task.teamId.teamName}</List.Description>
                <List.Header>{task.taskTitle}</List.Header>
                <List.Description>{task.taskDetail}</List.Description>
                <List.Description>Created by: {task.createdBy.firstName} {task.createdBy.lastName}</List.Description>
                <List.Description>At: {formatDateTime(task.createdAt)}</List.Description>
                {task.taskContent && (
                  <List.Description>
                    <a href={task.taskContent} target="_blank" rel="noopener noreferrer">View Attached File</a>
                  </List.Description>
                )}
              </List.Content>
            </List.Item>
          ))}
        </List>
      ) : (
        <p>No tasks available.</p>
      )}
    </Segment>
  );
};

export default AllTasks;

import React, { useContext, useEffect, useState } from 'react';
import { Button, Header, Image, List, Accordion, Icon, Menu, Segment, Modal, Form } from 'semantic-ui-react';
import { teamContext } from '../api/TeamsContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SearchBar from './SearchBar'; // Adjust path as needed
import { MessageContext } from '../api/ChatContext';

const TeamDetails = () => {
  const { teams, setTeams } = useContext(teamContext);
  const [userTeam, setTeam] = useState(null);
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMembers, setNewMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // State for delete confirmation modal
  const { setSelectedUser, addChat } = useContext(MessageContext);
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/team/userTeam/${teamId}`);
        setTeam(response.data);
      } catch (error) {
        console.error('Error fetching team:', error);
      }
    };

    fetchTeam();
  }, [teamId]);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);

    // Navigate to team files route when clicking on "Files"
    if (index === 1 && newIndex === 1) { 
      navigate(`/teamDetails/${teamId}/files`, { state: { teamId } });
    }

    // Navigate to team tasks route when clicking on "Tasks"
    if (index === 2 && newIndex === 2) { 
      navigate(`/teamDetails/${teamId}/tasks`, { state: { teamId } });
    }
  };

  const handleUserClick = (user) => {
    navigate('/profile', { state: { user } });
  };

  const handleDeleteTeam = async () => {
    const userId = Cookies.get('userId');
    try {
      await axios.delete(`http://localhost:8000/team/${teamId}`, {
        data: { userId }
      });
      navigate('/teams');
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleEditTeam = async () => {
    const userId = Cookies.get('userId');
    try {
      const response = await axios.put(`http://localhost:8000/team/${teamId}`, {
        userId,
        teamName: newTeamName,
        addMembers: selectedMembers.map(member => member._id),
        removeMembers: [] // Assuming no removal functionality in edit
      });
      setTeam(response.data);
      setEditModalOpen(false);
      window.location.reload(); // Reload the page after editing the team
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    const userId = Cookies.get('userId');
    try {
      const response = await axios.put(`http://localhost:8000/team/${teamId}`, {
        userId,
        addMembers: [],
        removeMembers: [memberId]
      });
      setTeam(response.data);
      window.location.reload(); // Reload the page after removing a member
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleUserSelect = (user) => {
    setNewMembers([...newMembers, user]);
    setSelectedMembers([...selectedMembers, user]);
  };

  const handleConfirmDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
  };

  const handleConfirmDeleteTeam = async () => {
    setConfirmDeleteOpen(false);
    await handleDeleteTeam();
  };

  const isAdmin = userTeam && userTeam.admin === Cookies.get('userId');

  const handleChatClick = (user) => {
    setSelectedUser(user);
    navigate(`/chat/${user._id}`);
    const newChat = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      messages: [] 
    };
    addChat(newChat);
  };

  return (
    <div className="sticky top-16 bg-white shadow-md z-10" style={{marginLeft:"100px"}}>
      <Header as='h1' attached dividing textAlign='center' style={{ backgroundColor: "lightgrey" }}>
        {userTeam && userTeam.teamName}
      </Header>
      <Menu vertical fluid>
        <Accordion styled fluid>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            Team Members
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <List divided verticalAlign='middle'>
              {userTeam && userTeam.members && userTeam.members.map(member => (
                <List.Item key={member._id}>
                  <List.Content floated='right'>
                    {isAdmin && (
                      <Button onClick={() => handleRemoveMember(member._id)} color='red'>Remove</Button>
                    )}
                  </List.Content>
                  <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' />
                  <List.Content >
                    {member.firstName} {member.lastName}
                    {userTeam.admin === member._id && <span style={{ color: 'red', marginLeft: '10px' }}>Admin</span>}
                  </List.Content>
                  <List.Content floated='right'>
                    <Button onClick={()=> handleChatClick(member)}>Message</Button>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            Files
          </Accordion.Title>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={handleClick}
          >
            <Icon name='dropdown' />
            Tasks
          </Accordion.Title>
        </Accordion>
      </Menu>

      {isAdmin && (
        <>
          <Button color='red' onClick={handleConfirmDelete}>Delete Team</Button>
          <Button color='blue' onClick={() => setEditModalOpen(true)}>Edit Team</Button>

          <Modal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
          >
            <Modal.Header>Edit Team</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Input
                  label='Team Name'
                  placeholder='Enter new team name'
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
                <Form.Field>
                  <label>Add Members</label>
                  <SearchBar onUserSelect={handleUserSelect} />
                </Form.Field>
                {newMembers.map((member, index) => (
                  <Segment key={index}>
                    <p>{member.firstName} {member.lastName}</p>
                  </Segment>
                ))}
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button color='blue' onClick={handleEditTeam}>Save</Button>
            </Modal.Actions>
          </Modal>

          <Modal
            open={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
            size='mini'
          >
            <Modal.Header>Confirm Deletion</Modal.Header>
            <Modal.Content>
              <p>Are you sure you want to delete this team?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={handleCancelDelete}>Cancel</Button>
              <Button positive onClick={handleConfirmDeleteTeam}>Confirm</Button>
            </Modal.Actions>
          </Modal>
        </>
      )}
    </div>
  );
};

export default TeamDetails;

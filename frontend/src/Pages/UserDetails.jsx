import React, { useEffect, useState, useContext } from 'react';
import { Image, Icon, Segment, Header, Divider, Grid, Container, Form, Modal, Button, Confirm } from 'semantic-ui-react';
import axios from 'axios';
import { authContext } from '../api/AuthContext';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const { user, logout } = useContext(authContext);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    profileImage: null
  });

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      fetchUserDetails(userId);
    }
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`https://collab-app-backend.onrender.com/userAuth/${userId}`);
      setUserDetails(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        gender: response.data.gender,
        profileImage: null
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const userId = Cookies.get('userId');
    const form = new FormData();
    form.append('firstName', formData.firstName);
    form.append('lastName', formData.lastName);
    form.append('email', formData.email);
    form.append('gender', formData.gender);
    if (formData.profileImage) {
      form.append('profileImage', formData.profileImage);
    }

    try {
      const response = await axios.put(`https://collab-app-backend.onrender.com/userAuth/update/${userId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUserDetails(response.data);
      setOpen(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleDelete = async () => {
    setDeleteConfirmOpen(true); // Open the delete confirmation modal
  };

  const confirmDelete = async () => {
    const userId = Cookies.get('userId');
    try {
      await axios.delete(`https://collab-app-backend.onrender.com/userAuth/delete/${userId}`);
      logout();
      navigate('/auth');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false); // Close the delete confirmation modal
  };

  if (!userDetails) {
    return <Segment loading style={{ minHeight: '100vh' }} />;
  }

  return (
    <Container style={{ marginTop: '2rem', background: '#f7f7f7', padding: '2rem', borderRadius: '10px' }}>
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column width={6}>
            <Image
              src={`https://collab-app-backend.onrender.com/userAuth${userDetails.profileImageURL}` || 'https://react.semantic-ui.com/images/avatar/large/elliot.jpg'}
              size='medium'
              circular
              centered
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as='h2'>{userDetails.firstName} {userDetails.lastName}</Header>
            <Divider />
            <p><Icon name='mail' /> {userDetails.email}</p>
            <p><Icon name='user' /> Gender: {userDetails.gender}</p>
            <p><Icon name='calendar' /> Joined in {new Date(userDetails.createdAt).getFullYear()}</p>
            <Button onClick={() => setOpen(true)}>Edit Profile</Button>
            <Button color='red' onClick={handleDelete}>Delete Account</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label='First Name'
              name='firstName'
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <Form.Input
              label='Last Name'
              name='lastName'
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <Form.Input
              label='Email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
            />
            <Form.Input
              label='Gender'
              name='gender'
              value={formData.gender}
              onChange={handleInputChange}
            />
            <Form.Input
              label='Profile Image'
              type='file'
              name='profileImage'
              accept='image/*'
              onChange={handleImageChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button positive onClick={handleSubmit}>Save</Button>
        </Modal.Actions>
      </Modal>

      <Confirm
        open={deleteConfirmOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        header='Delete Account'
        content='Are you sure you want to delete your account? This action cannot be undone.'
      />
    </Container>
  );
};

export default UserDetails;

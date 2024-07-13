import React, { useState, useContext } from 'react';
import { Card, Form, Button, Container, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authContext } from '../api/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, setUserState, userState } = useContext(authContext);

  const [isSignup, setIsSignup] = useState(true);
  const [signUpForm, setSignUpForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    profileImage: null
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSignUpChange = (e, { name, value }) => {
    setSignUpForm({ ...signUpForm, [name]: value });
  };

  const handleLoginChange = (e, { name, value }) => {
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleImageChange = (e) => {
    setSignUpForm({ ...signUpForm, profileImage: e.target.files[0] });
  };

  const handleSignUpSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', signUpForm.firstName);
      formData.append('lastName', signUpForm.lastName);
      formData.append('gender', signUpForm.gender);
      formData.append('email', signUpForm.email);
      formData.append('password', signUpForm.password);
      if (signUpForm.profileImage) {
        formData.append('profileImage', signUpForm.profileImage);
      }

      const response = await axios.post('https://collab-app-backend.onrender.com/userAuth/signup', formData);
      console.log('Sign Up Response:', response.data);
      
      const userData = {
        userId: response.data.userId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        gender: response.data.gender,
        profileImageURL: response.data.profileImageURL,
      };
      
      // login(response.data.token, userData);
      setUserState("Logged-In")
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
    }
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post('https://collab-app-backend.onrender.com/userAuth/login', loginForm);
      const loggedinToken = response.data.token;
      const userData = {
        userId: response.data.userId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        gender: response.data.gender,
        profileImageURL: response.data.profileImageURL,
      };
      
      login(loggedinToken, userData);
    } catch (error) {
      console.log('Error logging in:', error);
      setError('Error logging in. Please check your credentials.');
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setSignUpForm({
      firstName: '',
      lastName: '',
      gender: '',
      email: '',
      password: '',
      profileImage: null
    });
    setLoginForm({
      email: '',
      password: ''
    });
    setError('');
  };

  if (userState === 'Logged-In') {
    navigate('/');
  }

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-black text-white text-center py-4">
            <h2 className="text-xl font-bold">{isSignup ? 'Sign Up' : 'Login'}</h2>
          </div>
          <div className="p-6">
            <Form onSubmit={isSignup ? handleSignUpSubmit : handleLoginSubmit}>
              {isSignup && (
                <>
                  <Form.Input
                    label='First Name'
                    name='firstName'
                    value={signUpForm.firstName}
                    onChange={handleSignUpChange}
                    required
                    className="mb-4"
                  />
                  <Form.Input
                    label='Last Name'
                    name='lastName'
                    value={signUpForm.lastName}
                    onChange={handleSignUpChange}
                    required
                    className="mb-4"
                  />
                  <Form.Select
                    label='Gender'
                    name='gender'
                    options={[
                      { key: 'm', text: 'Male', value: 'male' },
                      { key: 'f', text: 'Female', value: 'female' },
                      { key: 'o', text: 'Other', value: 'other' },
                    ]}
                    value={signUpForm.gender}
                    onChange={handleSignUpChange}
                    required
                    className="mb-4"
                  />
                  <Form.Input
                    label='Profile Image'
                    type='file'
                    name='profileImage'
                    accept='image/*'
                    onChange={handleImageChange}
                    className="mb-4"
                  />
                </>
              )}
              <Form.Input
                label='Email'
                type='email'
                name='email'
                value={isSignup ? signUpForm.email : loginForm.email}
                onChange={isSignup ? handleSignUpChange : handleLoginChange}
                required
                className="mb-4"
              />
              <Form.Input
                label='Password'
                type='password'
                name='password'
                value={isSignup ? signUpForm.password : loginForm.password}
                onChange={isSignup ? handleSignUpChange : handleLoginChange}
                required
                className="mb-4"
              />
              {error && <Message negative>{error}</Message>}
              <Button primary type='submit' className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                {isSignup ? 'Sign Up' : 'Login'}
              </Button>
            </Form>
          </div>
          <div className="bg-gray-100 p-4 text-center">
            <Button onClick={toggleForm} className="text-blue-600 hover:text-blue-700">
              {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

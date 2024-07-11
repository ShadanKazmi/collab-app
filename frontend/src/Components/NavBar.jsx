
import React, { useState, useEffect, useContext } from 'react';
import { Icon, Menu, Dropdown } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { authContext } from '../api/AuthContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const NavBar = () => {
    const navigate = useNavigate();
    const { logout, user } = useContext(authContext);
    const [currentUser, setCurrentUser] = useState('');
    const [isDarkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const userId = Cookies.get('userId');
                if (!userId) {
                    console.error('User ID not found in cookies.');
                    return null;
                }
                const response = await axios.get(`https://collab-app-backend.onrender.com/userAuth/${userId}`);
                setCurrentUser(response.data); 
            } catch (error) {
                console.error('Error fetching user:', error);
                return null;
            }
        };
        getCurrentUser();
    }, []);

    const handleUserSelect = (user) => {
        navigate('/profile', { state: { user } });
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        document.body.classList.toggle('dark-mode', checked); // Apply dark mode class to the body
    };

    return (
        <div className="flex flex-col">
            {/* TOPBAR */}
            <div className="flex items-center justify-between p-4 bg-white text-white h-16 fixed w-full z-10">
                <div className="flex items-center justify-start w-1/3">
                    <img src="https://react.semantic-ui.com/logo.png" alt="App Logo" className="h-10 w-10" />
                </div>
                <div className="flex items-center justify-center w-1/3">
                    <SearchBar onUserSelect={handleUserSelect} />
                </div>
                <div className="flex items-center justify-end w-1/3">
                    <DarkModeSwitch
                        style={{ marginRight: '2rem' }}
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        size={30}
                    />
                    <Dropdown icon={<Icon name="user circle" size="big" color="black" />} pointing="top right">
                        <Dropdown.Menu>
                            <Dropdown.Header>Hi {currentUser.firstName} {currentUser.lastName}</Dropdown.Header>  
                            <Dropdown.Divider />      
                            <Dropdown.Item icon="user" text="Profile" onClick={() => navigate('/userProfile')} />   
                            <Dropdown.Item icon="sign-out" text="Logout" onClick={handleLogout} />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {/* CONTENT */}
            <div className="flex mt-20">
                {/* SIDEBAR */}
                <Menu vertical fixed="left" className="h-full w-56 bg-white" style={{ marginTop: '7.6rem' }}>
                    <Menu.Item onClick={() => navigate('/')}>
                        <Icon name="sitemap" />
                        Teams
                    </Menu.Item>
                    <Menu.Item onClick={() => navigate('/tasks')}>
                        <Icon name="tasks" />
                        Tasks
                    </Menu.Item>
                    <Menu.Item onClick={() => navigate('/chat')}>
                        <Icon name="chat" />
                        Chat
                    </Menu.Item>
                </Menu>
            </div>
        </div>
    );
};

export default NavBar;

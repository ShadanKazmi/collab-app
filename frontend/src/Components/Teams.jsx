import React, { useState, useContext, useEffect } from 'react';
import { Grid, Image, Card, CardContent, CardHeader, CardMeta, Segment, Icon, Button, Modal, Form, Loader } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { teamContext } from '../api/TeamsContext';
import Cookies from 'js-cookie';
import bg from '../Assets/bg.svg';
import icon from '../Assets/teamicon.jpg';

const Teams = () => {
    const { teams, setTeams } = useContext(teamContext);
    const [open, setOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`https://collab-app-backend.onrender.com/userTeams/${userId}`);
                setTeams(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching teams:', error);
                setLoading(false);
            }
        };
        fetchTeams();
    }, [setTeams, userId]);

    const navigateToTeamDetails = (teamId) => {
        navigate(`/teamDetails/${teamId}`);
    };

    const navigateToCreateTeam = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setNewTeamName('');
        setMembers([]);
    };

    const handleCreateTeam = async () => {
        try {
            const response = await axios.post('https://collab-app-backend.onrender.com/team', {
                teamName: newTeamName,
                members: members.map(member => member._id),
                userId: userId
            });
            console.log('Team created:', response.data);
            setTeams([...teams, response.data]); 
        } catch (error) {
            console.error('Error creating team:', error);
        }
        handleCloseModal();
    };

    const handleUserSelect = (user) => {
        setMembers([...members, user]);
    };
    
    return (
        <div style={{ backgroundColor: '#f0f4f7', minHeight: '100vh', padding: '2rem', paddingLeft:"4rem", background:"linear-gradient(to bottom, #f0f2f0, #000c40)" }}>
            <Segment color='black' textAlign='center' style={{marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Teams</h1>
                <Button color='black' onClick={navigateToCreateTeam}>Create Team</Button>
            </Segment>
            <Grid columns={5} stackable>
                {loading ? (
                    <Loader active inline='centered'>Loading...</Loader>
                ) : (
                    teams.map(team => (
                        <Grid.Column key={team._id}>
                            <Card fluid onClick={() => navigateToTeamDetails(team._id)} style={{ cursor: 'pointer', marginBottom: '1.5rem', background:"linear-gradient(to right, #e0eafc, #cfdef3)"}}>
                                <Image src={icon} size='medium' />
                                <CardContent>
                                    <CardHeader>{team.teamName}</CardHeader>
                                </CardContent>
                                <CardContent extra>
                                    <a>
                                        <Icon name='users' />
                                        {team.memberCount} Members
                                    </a>
                                </CardContent>
                            </Card>
                        </Grid.Column>
                    ))
                )}
            </Grid>

            <Modal open={open} onClose={handleCloseModal} size='tiny'>
                <Modal.Header>Create a New Team</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>Team Name</label>
                            <input
                                placeholder='Enter team name'
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Add Members</label>
                            <SearchBar onUserSelect={handleUserSelect} />
                        </Form.Field>
                        {members.map((member, index) => (
                            <Segment key={index}>
                                <p>{member.title} - {member.description}</p>
                            </Segment>
                        ))}
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={handleCloseModal}>Cancel</Button>
                    <Button
                        content='Create Team'
                        labelPosition='right'
                        icon='checkmark'
                        onClick={handleCreateTeam}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default Teams;

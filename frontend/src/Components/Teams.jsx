import React, { useState, useContext, useEffect } from 'react';
import { Grid, Image, Card, CardContent, CardHeader, CardMeta, Segment, Icon, Button, Modal, Form, Loader } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { teamContext } from '../api/TeamsContext';
import Cookies from 'js-cookie';

const Teams = () => {
    const { teams, setTeams } = useContext(teamContext);
    const [open, setOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchTeams = async () => {
            const userId = Cookies.get('userId')
            try {
                const response = await axios.get(`http://localhost:8000/userTeams/${userId}`);
                setTeams(response.data);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching teams:', error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };
        fetchTeams();
    }, [setTeams]);

    const navigateToTeamDetails = (teamId) => {
        navigate(`/teamDetails/${teamId.toString()}`);
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
            const response = await axios.post('http://localhost:8000/team', {
                teamName: newTeamName,
                members: members.map(member => member._id),
                userId: userId
            });
            console.log('Team created:', response.data);
            setTeams([...teams, response.data]); // Update the teams state with the new team
        } catch (error) {
            console.error('Error creating team:', error);
        }
        handleCloseModal();
    };

    const handleUserSelect = (user) => {
        setMembers([...members, user]);
    };

    return (
        <div>
            <Segment color='white' textAlign='center' style={{ padding: '1rem', marginBottom: '1rem' }}>
                <h1>Teams</h1>
                <Button primary onClick={navigateToCreateTeam}>Create Team</Button>
            </Segment>
            <div style={{ paddingLeft: "5rem", backgroundColor: "lightgrey", minHeight:"100vh", overflow:"hidden" }}>
                {loading ? (
                    <Loader active inline='centered' size='large'>Loading...</Loader>
                ) : (
                    <Grid columns={5} container doubling stackable>
                        {teams.map(team => (
                            <Grid.Column key={team._id} style={{ marginBottom: '2rem', marginTop: "2rem" }}>
                                <div className="group overflow-hidden rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-5 hover:shadow-xl cursor-pointer">
                                    <Card onClick={() => navigateToTeamDetails(team._id)}>
                                        <Image src={team.members[0].avatar || 'https://react.semantic-ui.com/images/avatar/large/ade.jpg'} wrapped ui={false} />
                                        <CardContent>
                                            <CardHeader>{team.teamName}</CardHeader>
                                            <CardMeta>Joined in {new Date(team.createdAt).getFullYear()}</CardMeta>
                                        </CardContent>
                                        <CardContent extra>
                                            <a>
                                                <Icon name='users' />
                                                {team.memberCount} Members
                                            </a>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Grid.Column>
                        ))}
                    </Grid>
                )}
            </div>

            <Modal
                onClose={handleCloseModal}
                open={open}
            >
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

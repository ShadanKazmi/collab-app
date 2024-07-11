const { Router } = require('express');
const Team = require('../model/team'); 
const User = require('../model/user');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const teams = await Team.find().populate('members', 'firstName lastName email gender');
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).send('Server error');
    }
});


router.get('/userTeams/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const teams = await Team.find({ members: userId }).populate('members', 'firstName lastName email gender');
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching user\'s teams:', error);
        res.status(500).send('Server error');
    }
});

router.get('/userTeam/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId).populate('members', 'firstName lastName email gender');
        res.status(200).json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).send('Server error');
    }
});



router.post('/', async (req, res) => {
    const { teamName, members, userId } = req.body;

    // Check if members array is provided and non-empty
    if (!members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: 'Members field is required and should be a non-empty array.' });
    }

    try {
        // Verify if all member IDs are valid users
        const users = await User.find({ _id: { $in: members } });
        if (users.length !== members.length) {
            return res.status(400).json({ error: 'One or more member IDs are invalid.' });
        }
        const admin = userId;
        // Set admin and createdBy fields to the user creating the tea
        const newTeam = new Team({
            teamName,
            members,
            memberCount: members.length,
            admin,
            createdBy: admin,
        });

        // Save the new team
        const savedTeam = await newTeam.save();
        res.status(201).json(savedTeam);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).send('Server error');
    }
});

router.put('/:teamId', async (req, res) => {
    const { teamId } = req.params;
    const { userId, teamName, addMembers, removeMembers } = req.body;

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ error: 'Team not found.' });
        }

        if (team.admin !== userId) {
            return res.status(403).json({ error: 'Only the admin can update the team.' });
        }

        if (teamName) team.teamName = teamName;

        if (addMembers) {
            const usersToAdd = await User.find({ _id: { $in: addMembers } });
            if (usersToAdd.length !== addMembers.length) {
                return res.status(400).json({ error: 'One or more member IDs to add are invalid.' });
            }
            team.members = [...new Set([...team.members, ...addMembers])]; // Ensure no duplicates
        }

        if (removeMembers) {
            team.members = team.members.filter(member => !removeMembers.includes(member.toString()));
        }

        team.memberCount = team.members.length;

        const updatedTeam = await team.save();
        res.status(200).json(updatedTeam);
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).send('Server error');
    }
});

router.delete('/:teamId', async (req, res) => {
    const { teamId } = req.params;
    const { userId } = req.body;

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ error: 'Team not found.' });
        }

        if (team.admin !== userId) {
            return res.status(403).json({ error: 'Only the admin can delete the team.' });
        }

        await team.deleteOne();
        res.status(200).json({ message: 'Team deleted successfully.' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
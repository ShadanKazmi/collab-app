const express = require("express")
const { Router } = require('express');
const UploadedContent = require('../model/files');
const Team = require('../model/team')
const router = Router();
const path = require('path');
const upload = require('../services/files')

router.use('/images', express.static(path.join(__dirname, '../../frontend/src/images')));

router.get('/:teamId', async (req, res) => {
    const { teamId } = req.params;
    try {
        const uploadedContents = await UploadedContent.find({ teamId }).populate('createdBy', 'firstName lastName') 
        res.status(200).json({ uploadedContents });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching message contents.' });
    }
});

router.get('/teamtasks/:teamId', async (req, res) => {
    const { teamId } = req.params;
    try {
        const uploadedContents = await UploadedContent.find({ 
            teamId,
            msgContent: { $in: [null, undefined] } // Filter out tasks with msgContent
        })
        .select('-msgContent') // Exclude msgContent
        .populate('createdBy', 'firstName lastName');

        res.status(200).json({ uploadedContents });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching message contents.' });
    }
});

router.get('/tasks/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
      const teams = await Team.find({ members: userId }).select('_id teamName');
      const teamIds = teams.map(team => team._id);

      const tasks = await UploadedContent.find({ 
          teamId: { $in: teamIds },
          msgContent: { $in: [null, undefined] }  // Ensure taskTitle exists and is not empty
      })
      .select('-msgContent') // Exclude msgContent
      .populate('createdBy', 'firstName lastName')
      .populate('teamId', 'teamName'); // Ensure teamName is populated

      res.status(200).json({ tasks });
  } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks for user teams.' });
  }
});


router.post('/:teamId',upload.single('taskContent'), async (req, res) => {
    const { teamId } = req.params;
    const { userId, taskDetail,taskTitle } = req.body;
    let taskContent = null;
    if (!teamId || !userId) {
        return res.status(400).json({ error: 'teamId and userId are required.' });
    }

    try {

        if (req.file) {
            taskContent = `/images/${req.file.filename}`;
          }

        const task = new UploadedContent({
            taskContent,
            teamId,
            taskDetail,
            taskTitle,
            createdBy: userId,
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Error saving task:', error);
        res.status(500).json({ error: 'Server error' });
    }
})


module.exports = router;

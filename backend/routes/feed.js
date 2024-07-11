const { Router } = require("express");
const express = require("express")
const Feed = require('../model/feed');
const router = Router();
const path = require('path');
const upload = require('../services/files')

router.use('/images', express.static(path.join(__dirname, '../../frontend/src/images')));


router.get('/:teamId', async (req, res) => {
    const { teamId } = req.params;
    try {
        const messages = await Feed.find({ teamId }).populate('createdBy', 'firstName lastName email profileImageURL gender').populate('replies.createdBy', 'firstName lastName email profileImageURL');
        
        const formattedMessages = messages.map(comment => {
            const formattedReplies = comment.replies.map(reply => ({
                ...reply.toObject(),
                createdAt: new Date(reply.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
            }));

            return {
                ...comment.toObject(),
                createdAt: new Date(comment.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
                replies: formattedReplies
            };
        });
        res.status(200).json(formattedMessages);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/',upload.single('uploadContent'), async (req, res) => {
    const { textContent, teamId, userId } = req.body;
    let uploadContent = null;
    if (!teamId || !userId) {
        return res.status(400).json({ error: 'teamId and userId are required.' });
    }

    try {

        if (req.file) {
            uploadContent = `/images/${req.file.filename}`;
          }

        const message = new Feed({
            textContent,
            uploadContent,
            teamId,
            createdBy: userId,
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/:commentId/reply', async (req, res) => {
    const { textContent, userId } = req.body;
    const { commentId } = req.params;

    if (!commentId || !userId || !textContent) {
        return res.status(400).json({ error: 'commentId, userId, and textContent are required.' });
    }

    try {
        const comment = await Feed.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        const reply = {
            textContent,
            createdBy: userId,
        };

        comment.replies.push(reply);
        await comment.save();

        // Retrieve the comment with populated replies
        const updatedComment = await Feed.findById(commentId).populate('replies.createdBy', 'firstName lastName');

        // Find the added reply
        const addedReply = updatedComment.replies.find(r => r.textContent === textContent && r.createdBy._id.toString() === userId);

        res.status(201).json(addedReply);
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
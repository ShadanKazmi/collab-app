const express = require('express');
const Chat = require('../model/chat');
const upload = require('../services/files');
const router = express.Router();
const path = require('path');

router.use('/images', express.static(path.join(__dirname, '../../frontend/src/images')));

router.get('/:fromUser/:toUser', async (req, res) => {
    const { fromUser, toUser } = req.params;

    if (!fromUser || !toUser) {
        return res.status(400).json({ error: 'Both fromUser and toUser are required.' });
    }

    try {
        const chatMessages = await Chat.find({
            $or: [
                { fromUser, toUser },
                { fromUser: toUser, toUser: fromUser },
            ],
        }).populate('fromUser', 'firstName lastName profileImageURL') 
        .populate('toUser', 'firstName lastName profileImageURL') 
        .sort({ createdAt: 1 });

        res.status(200).json(chatMessages);
    } catch (error) {
        console.error('Error retrieving chat messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/:userId', upload.single('uploadContent'), async (req, res) => {
    const { textContent, fromUser } = req.body;
    const toUser = req.params.userId;
    let uploadContent = null;

    if (!fromUser || !toUser) {
        return res.status(400).json({ error: 'fromUser and toUser are required.' });
    }

    try {
        if (req.file) {
            uploadContent = `/images/${req.file.filename}`;
        }

        const chatMessage = new Chat({
            textContent,
            uploadContent,
            fromUser,
            toUser,
        });

        await chatMessage.save();

        // Emit event to clients
        const chatIo = req.app.get('chatIo');
        chatIo.to(toUser).emit('newChatMessage', chatMessage);

        res.status(201).json(chatMessage);
    } catch (error) {
        console.error('Error saving chat message:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
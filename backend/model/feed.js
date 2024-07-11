const { Schema, model } = require('mongoose')
const express = require('express')

const feedSchema = new Schema(
    {
        textContent: {
            type: String,
        },
        uploadContent : {
            type: String,
        },
        teamId:{
            type: String,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        replies: [
            {
                textContent: String,
                createdAt: { type: Date, default: Date.now },
                uploadContent : {
                    type: String,
                },
                createdBy: {
                    type: Schema.Types.ObjectId,
                    ref: 'user',
                    required: true,
                },
            }
        ]
    },
        { timestamps: true }
)

feedSchema.post('save', async function (doc, next) {
    if (doc.uploadContent) {
        const UploadedContent = require('./files'); // Adjust path if necessary
        const uploadedContent = new UploadedContent({
            teamId: doc.teamId,
            createdBy: doc.createdBy,
            msgContent: doc.uploadContent, // Reference to the message
        });

        try {
            await uploadedContent.save();
        } catch (error) {
            console.error('Error saving uploaded content:', error);
        }
    }
    next();
});


const Feed = model('message', feedSchema);

module.exports = Feed;
const { Schema, model } = require('mongoose')
const express = require('express')

const chatSchema = new Schema(
    {
        textContent: {
            type: String,
        },
        uploadContent : {
            type: String,
        },
        fromUser:{
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        toUser: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
        { timestamps: true }
)

const Chat = model('chat', chatSchema);

module.exports = Chat;
const { Schema, model } = require('mongoose')
const express = require('express')

const fileSchema = new Schema(
    {
        teamId:{
            type: Schema.Types.ObjectId, 
            ref: 'team' 
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        msgContent:{
            type: String,
        },
        taskTitle:{
            type: String,
        },
        taskContent:{
            type: String,
        },
        taskDetail:{
            type:String,
        }
    },
        { timestamps: true }
)

const UploadedContent = model('uploaded-content', fileSchema);

module.exports = UploadedContent;
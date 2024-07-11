const { Schema, model } = require('mongoose')

const teamSchema = new Schema(
    {
        teamName:{
            type: String,
            required: true,
        },
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        }],
        memberCount : {
            type: Number,
        },
        admin:{
            type: String,
            required: true
        }
    },
        { timestamps: true }
)

const Team = model('team', teamSchema);

module.exports = Team;
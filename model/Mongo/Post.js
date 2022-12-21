import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    like_counter: {
        type: Number,
        default: 0
    },
    liked_user : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    view_counter: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})
export const Post = mongoose.model('Post', PostSchema)
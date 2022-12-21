import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    child_comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
})
CommentSchema.plugin(mongooseAutoPopulate)
export const Comment = mongoose.model('Comment', CommentSchema)
import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const ChatMessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    child_comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatMessage',
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
})
ChatMessageSchema.plugin(mongooseAutoPopulate)
export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema)
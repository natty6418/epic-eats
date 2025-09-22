import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import joi from 'joi';

const messageSchema = new Schema({
    sender: { type: String, required: true, enum: ['user', 'assistant'] },
    text: { type: String, required: true },
}, { _id: false });

const chatSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: [messageSchema], default: [] },
    title: { type: String, default: 'unknown chat' },
    createdAt: { type: Date, required: true },
});

chatSchema.index({ createdAt: -1 });

function validateChat(chat){
    const schema = joi.object({
        data: joi.array().items(
            joi.object({
                sender: joi.string().valid('user', 'assistant').required(),
                text: joi.string().required(),
            })
        ).min(1).required(),
    });
    return schema.validate(chat);
}

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export { Chat, validateChat };

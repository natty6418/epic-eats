import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import joi from 'joi';

const chatSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref:'User'},
    
    data: [
        {type: new Schema({
            sender: {type: String, required: true},
            text: {type: String, required: true},
        })}
    ],
    createdAt: {type: Date, required: true}
});

function validateComment(comment){
    const schema = joi.object({
        text: joi.string().required(),
        recipeId: joi.string().required()
    });
    return schema.validate(comment);
}
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export { Comment, validateComment };

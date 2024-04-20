import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import joi from 'joi';

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref:'User'},
    recipeId: {
        type: Schema.Types.ObjectId, 
        ref:'Recipe'},
    text: {type: String, required: true},
    createdAt: {type: Date, required: true}
});

function validateComment(comment){
    const schema = joi.object({
        text: joi.string().required(),
        recipeId: joi.string().required()
    });
    return schema.validate(comment);
}
const Comment = mongoose.model('Comment', commentSchema);

export { Comment, validateComment };

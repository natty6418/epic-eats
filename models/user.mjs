import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import joi from 'joi';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    // email provided by user
    email: { type: String, required: true },
    // password hash provided by authentication plugin
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    },

    recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }], // Reference to Recipe model
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }], // Corrected spelling
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Reference to User model
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Reference to User model
    profilePic: { type: String } // URL to profile picture
});

function validateUser(user){
    const schema = joi.object({
        username: joi.string().required().min(3).max(255),
        email: joi.string().required().email(),
        password: joi.string().required().min(8).max(255)
    });
    return schema.validate(user);
}

const User = mongoose.model('User', userSchema);
export { User, validateUser };
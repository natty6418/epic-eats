import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import joi from 'joi';

const recipeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User'},
      title: {type: String, required: true},
      ingredients: [{ingredient: String, quantity: String}],
      description: {type: String, required: true},
      instructions: {type: String, required: true},
      comments: [{
        type: new Schema({
            userId: {
                type: Schema.Types.ObjectId, 
                ref:'User'},
            recipeId: {
                type: Schema.Types.ObjectId, 
                ref:'Recipe'},
            text: {type: String, required: true},
            createdAt: {type: Date, required: true}
        })
      }],
      createdAt: {type: Date, required: true},
      image: {type: String}
});

function validateRecipe(recipe){
    const schema = joi.object({
        title: joi.string().required(),
        ingredients: joi.array().required(),
        instructions: joi.string().required(),
        description: joi.string().required().max(255),
        image: joi.string()
    });
    return schema.validate(recipe);
}
const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);

export { Recipe, validateRecipe };
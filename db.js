// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
const User = new mongoose.Schema({
  // unique username provided by user
  username: {type: String, required: true, unique: true},
  // email provided by user
  email: {type: String, required: true},
  // password hash provided by authentication plugin
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255},
  
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }], // Reference to Recipe model
  savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }], // Corrected spelling
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Reference to User model
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Reference to User model
  profilePic: {type: String} // URL to profile picture
});

// Recipe
// * a recipe has a title and a list of ingredients
// * a recipe can have 0 or more comments
const Recipe = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref:'User'},
  title: {type: String, required: true},
  ingredients: [{ingredient: String, quantity: String}],
  instructions: {type: String, required: true},
  comments: [Comment],
  category: {type: String, "enum": ["breakfast", "lunch", "dinner", "dessert"]},
  createdAt: {type: Date, required: true},
  image: {type: String}
});

// a comment
// * a comment has a body and a user
const Comment = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref:'User'},
  recipeId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref:'Recipe'},
  text: {type: String, required: true},
  createdAt: {type: Date, required: true}
});

// TODO: add remainder of setup for slugs, connection, registering models, etc. below

// export the User model
module.exports = mongoose.model('User', User);
module.exports = mongoose.model('Recipe', Recipe);
module.exports = mongoose.model('Comment', Comment);



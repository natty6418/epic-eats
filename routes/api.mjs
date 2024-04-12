import { Router } from 'express'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import {Recipe, validateRecipe} from '../models/recipe.mjs';
import {User, validateUser} from '../models/user.mjs';
import auth from '../middleware/auth.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = new Router();
router.use(express.json());


router.get('/', (req, res) => {
  if(!req.session.user_id) return res.redirect('/api/login');
  res.redirect('/api/feed');
});

router.get('/feed',auth, async (req, res) => {
 const recipes = await Recipe.find().populate('userId').sort({createdAt: -1});
  res.send(recipes);
});

router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.session.user_id).populate('recipes');
  res.send({user: user.username, email: user.email, recipes: user.recipes});
});
router.post('/register', async (req, res) => {
  const {username, email, password} = req.body;
  const {error} = validateUser({username, email, password});
  if(error) return res.status(400).send({error: error.details[0].message});
  let user = await User.findOne({email});
  if(user) return res.status(400).send({error: 'User already registered. Please login instead.'});
  user = new User({username, email, password});
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  req.session.user_id = user._id;
  res.send({user: user.username, email: user.email});
});
router.post('/login', async (req, res) => {
  // res.setHeader('Content-Type', 'application/json');
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) return res.status(400).send({error: 'Invalid email or password'});
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send({error: 'Invalid email or password'});
  req.session.user_id = user._id;
  res.send({user: user.username, email: user.email});
});

router.post('/recipe', auth, async (req, res) => {
  const user_id = req.session.user_id;
  const {error} = validateRecipe({...req.body});
  if(error) return res.status(400).send({error: error.details[0].message});
  console.log(req.body);
  const recipe = new Recipe({...req.body, userId: user_id, createdAt: new Date()});
  await recipe.save();
  res.send(recipe);
});

router.post('/logout', auth, (req, res) => {
  req.session.destroy();
  res.send({message: 'Logged out successfully'});
});
router.get('/my-recipes', auth, async (req, res) => {
  const recipes = await Recipe.find({userId: req.session.user_id});
  res.send([...recipes]);
});

export default router;
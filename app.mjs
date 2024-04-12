import express from 'express'
import './config.mjs'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.mjs'
import session from 'express-session'

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
};

await mongoose.connect(process.env.DSN);
const app = express();
app.use(session(sessionOptions));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
app.use('/api', apiRoutes);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/feed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'feed.html'));
});
app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create_recipe.html'));
});
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});
app.listen(process.env.PORT ?? 3000);
console.log('Server started on port 3000');

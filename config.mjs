import { config } from 'dotenv';
config();
console.log(process.env.NODE_ENV);
console.log(process.env.DSN);
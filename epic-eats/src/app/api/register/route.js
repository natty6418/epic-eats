import connectDB from '@/db.mjs';
import bcrypt from 'bcryptjs';
import {User, validateUser } from '../../../../Model/User.mjs';

export const dynamic = 'force-dynamic';
export async function POST(req) {
    if (req.method === 'POST') {
      await connectDB();
      const data = await req.json();
      const { username, email, password } = data;
      const { error } = validateUser({ username, email, password });
      if (error) {
        return new Response(JSON.stringify({ error: error.details[0].message }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      let user = await User.findOne({ email });
      if (user) {
        return new Response(JSON.stringify({ error: 'User already registered. Please login instead.' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      user = new User({ username, email, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      return new Response(JSON.stringify({ user: user.username, email: user.email }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { email, password } = await request.json();

  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  // Create a JWT token
  const token = jwt.sign(
    { _id: user._id, name: user.name, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Set the token as an HTTP-only cookie
  const response = NextResponse.json({ message: 'Login successful', role: user.role });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    maxAge: 60 * 60, // 1 hour in seconds
    path: '/',
  });

  return response;
}
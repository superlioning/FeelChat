// app/api/profile/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    const { email, name, oldPassword, newPassword } = await request.json();

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
        return NextResponse.json({ status: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return NextResponse.json({ status: 'Incorrect old password' }, { status: 400 });
    }

    user.name = name;

    if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Create a new JWT token with the updated name
    const token = jwt.sign(
        { name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Set the updated JWT token in the session cookie
    const response = NextResponse.json({ status: 'Profile updated successfully' });
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        maxAge: 60 * 60, // 1 hour
        path: '/',
    });

    return response;
}
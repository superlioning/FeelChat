// app/api/auth/check/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  // Retrieve the token's value directly from the cookie
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ authenticated: true, name: decoded.name, email: decoded.email });
  } catch (error) {
    console.error('JWT verification error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
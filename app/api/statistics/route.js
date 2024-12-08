// app/api/statistics/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export async function GET() {
    await dbConnect();

    try {
        const userCount = await User.countDocuments({ role: 'User' });
        return NextResponse.json({ count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        return NextResponse.json({ status: 'Error fetching user count' }, { status: 500 });
    }
}
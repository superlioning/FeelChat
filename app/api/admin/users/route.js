// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export async function GET() {
    await dbConnect();

    try {
        const users = await User.find({ role: { $ne: 'Admin' } });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ status: 'Error fetching users' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { userId } = await request.json();

    await dbConnect();

    try {
        await User.findByIdAndDelete(userId);
        return NextResponse.json({ status: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ status: 'Error deleting user' }, { status: 500 });
    }
}
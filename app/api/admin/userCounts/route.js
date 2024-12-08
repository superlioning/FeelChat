// app/api/admin/userCounts/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export async function GET() {
    await dbConnect();

    try {
        const users = await User.find({});
        const userCount = users.filter(user => user.role === 'User').length;
        const analystCount = users.filter(user => user.role === 'Analyst').length;
        const customerSupportCount = users.filter(user => user.role === 'Customer Support').length;
        const adminCount = users.filter(user => user.role === 'Admin').length;

        return NextResponse.json({
            user: userCount,
            analyst: analystCount,
            customerSupport: customerSupportCount,
            admin: adminCount,
        });
    } catch (error) {
        console.error('Error fetching user counts:', error);
        return NextResponse.json({ status: 'Error fetching user counts' }, { status: 500 });
    }
}
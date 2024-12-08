// app/api/feedback/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import Case from '../../models/Case';

export async function POST(request) {
    const { clientName, clientEmail, message } = await request.json();

    await dbConnect();

    try {
        const newCase = new Case({
            clientName,
            clientEmail,
            message,
        });

        await newCase.save();

        return NextResponse.json({ status: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error creating feedback:', error);
        return NextResponse.json({ status: 'Error creating feedback' }, { status: 500 });
    }
}
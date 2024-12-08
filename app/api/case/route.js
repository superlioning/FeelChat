// app/api/case/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import Case from '../../models/Case';

export async function GET() {
  await dbConnect();

  try {
    const cases = await Case.find({});
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json({ status: 'Error fetching cases' }, { status: 500 });
  }
}
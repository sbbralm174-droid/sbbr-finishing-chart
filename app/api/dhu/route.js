import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Dhu from "@/models/Dhu";

export async function GET(req) {
  await connectDB();
  
  // URL থেকে 'floor' query parameter নেওয়া হচ্ছে
  const floor = req.nextUrl.searchParams.get('floor');
  
  // ডেটা ফিল্টার করার জন্য একটি অবজেক্ট তৈরি করা হচ্ছে
  const filter = floor && floor !== 'all' ? { floor: floor } : {};
  
  const dhus = await Dhu.find(filter).sort({ date: 1 });
  
  return NextResponse.json(dhus);
}
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { date, totalPieces, totalDefects, floor } = body; // 'floor' যোগ করা হয়েছে

    if (!date || !floor || typeof totalPieces === 'undefined' || typeof totalDefects === 'undefined') {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const dhu = Number(totalPieces) === 0 ? 0 : (Number(totalDefects) / Number(totalPieces)) * 100;

    const newDhu = new Dhu({
      date,
      floor, // 'floor' ফিল্ড যোগ করা হয়েছে
      totalPieces: Number(totalPieces),
      totalDefects: Number(totalDefects),
      dhu
    });

    await newDhu.save();
    return NextResponse.json(newDhu, { status: 201 });

  } catch (error) {
    console.error("Error creating DHU entry:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
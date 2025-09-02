import { connectDB } from "@/lib/db";
import Alter from "@/models/Alter";
import { NextResponse } from "next/server";

// GET request handler to fetch filtered data
export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const floor = url.searchParams.get("floor");
    const date = url.searchParams.get("date");

    const filter = {};
    if (floor) filter.floor = Number(floor);
    if (date) filter.date = date;

    const data = await Alter.find(filter);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
}

// POST request handler to add new data
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const newData = new Alter(body);
    await newData.save();
    return NextResponse.json({ message: "Data added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { error: "Failed to save data", details: error.message },
      { status: 500 }
    );
  }
}

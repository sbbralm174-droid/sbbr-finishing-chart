import { connectDB } from "@/lib/db";
import Spot from "@/models/Spot";
import { NextResponse } from "next/server";

// GET request handler to fetch filtered data
export async function GET(request) {
    try {
        console.log("Attempting to connect to DB...");
        await connectDB();
        console.log("DB connection successful.");

        const url = new URL(request.url);
        const floor = url.searchParams.get("floor");
        const date = url.searchParams.get("date");
        console.log("Received floor:", floor, "and date:", date);

        const filter = {};
        if (floor) filter.floor = Number(floor);
        if (date) filter.date = date;

        console.log("Filter used:", filter);
        const data = await Spot.find(filter);
        console.log("Data fetched successfully.");
        return NextResponse.json(data);
    } catch (error) {
        console.error("Server-side error:", error.message);
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

        // Check for invalid input values like NaN
        if (body.production === 0 || isNaN(body.production) || isNaN(body.spot)) {
            return NextResponse.json({ error: "Invalid production or spot value." }, { status: 400 });
        }

        const newData = new Spot(body);
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
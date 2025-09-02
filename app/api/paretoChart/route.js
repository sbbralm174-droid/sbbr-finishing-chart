import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Issue } from "@/models/ParetoChart";

// ডাটা show
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    let query = {};
    if (date) query.date = date; // এখানে date = "YYYY-MM-DD"

    const issues = await Issue.find(query).sort({ count: -1 });
    return NextResponse.json(issues);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

// ইনপুট এলে count যোগ করবে
export async function POST(req) {
  try {
    await connectDB();
    const { name, count, date } = await req.json();

    if (!name || !count || !date) {
      return NextResponse.json(
        { error: "Name, count and date are required" },
        { status: 400 }
      );
    }

    // UI থেকে আসা date আমরা 그대로 ব্যবহার করব
    const normalizedDate = date; // "YYYY-MM-DD"

    // একই issue + date খুঁজে বের করা
    const existing = await Issue.findOne({ name, date: normalizedDate });

    if (existing) {
      existing.count += count; // আগের মান যোগ হবে
      await existing.save();
      return NextResponse.json(existing);
    } else {
      const newIssue = await Issue.create({ name, count, date: normalizedDate });
      return NextResponse.json(newIssue);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add/update issue" },
      { status: 500 }
    );
  }
}

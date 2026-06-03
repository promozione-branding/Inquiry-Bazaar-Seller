import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { upsertBank, getBank } from "@/controllers/Profile/bankController";

const getUserId = (req) => {
  return req.headers.get("x-user-id"); // replace with auth later
};

/* POST */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await upsertBank(userId, body);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* GET */
export async function GET(req) {
  try {
    await connectDB();

    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getBank(userId);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
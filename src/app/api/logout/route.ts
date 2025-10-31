import { NextResponse } from "next/server";

// Logout endpoint disabled. Token/cookie-based sessions were removed per request.
export async function POST() {
  return NextResponse.json({ message: "Not available" }, { status: 404 });
}

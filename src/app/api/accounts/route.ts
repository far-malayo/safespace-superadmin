// /app/api/accounts/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    // 🔒 Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // ✅ Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 403 }
      );
    }

    // ✅ Fetch users and admins (without passwords)
    const users = await User.find({}, { password: 0 }).lean();
    const admins = await Admin.find({}, { password: 0 }).lean();

    return NextResponse.json({ users, admins });
  } catch (error) {
    console.error("Accounts fetch error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

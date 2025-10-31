import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { currentPassword, newEmail, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { message: "Current password required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Assuming single superadmin account - pick the first
    const admin = await Admin.findOne();
    if (!admin)
      return NextResponse.json(
        { message: "Superadmin not found" },
        { status: 404 }
      );

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return NextResponse.json(
        { message: "Invalid current password" },
        { status: 401 }
      );

    let updated = false;
    if (newEmail) {
      admin.email = newEmail;
      updated = true;
    }
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
      updated = true;
    }

    if (updated) await admin.save();

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("Superadmin update error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

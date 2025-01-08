import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sanityClient from "@/lib/sanityClient";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Check if administrator exists
    const existingAdmin = await sanityClient.fetch(
      `*[_type == "administrator" && email == $email][0]`,
      { email }
    );

    if (existingAdmin) {
      return new NextResponse("Email already in use", { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create administrator in Sanity
    const administrator = await sanityClient.create({
      _type: "administrator",
      email,
      name,
      password: hashedPassword,
    });

    return NextResponse.json({
      user: {
        id: administrator._id,
        name: administrator.name,
        email: administrator.email,
      }
    });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

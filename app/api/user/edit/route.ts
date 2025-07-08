import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { dbConnection } from "@/config/db";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "@/lib/authOptions";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const username = formData.get("username") as string | null;
    const bio = formData.get("bio") as string | null;
    const headLine = formData.get("headLine") as string | null;
    const openToWorkRaw = formData.get("openToWork") as string | null;
    const experienceLevel = formData.get("experienceLevel") as
      | "junior"
      | "mid"
      | "senior"
      | "lead"
      | null;
    const githubUrl = formData.get("githubUrl") as string | null;
    const websiteUrl = formData.get("websiteUrl") as string | null;
    const techStackRaw = formData.get("techStack")
    const file = formData.get("image") as File | null;

    console.log(techStackRaw);
    
    await dbConnection();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (headLine) user.headLine = headLine;
    if (openToWorkRaw !== null)
      user.openToWork = openToWorkRaw === "true" || openToWorkRaw === "1";
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (githubUrl) user.githubUrl = githubUrl;
    if (websiteUrl) user.websiteUrl = websiteUrl;

    if (techStackRaw) {
      try {
        const parsedTechStack = JSON.parse(techStackRaw as string);
    
        if (!Array.isArray(parsedTechStack)) {
          throw new Error("Invalid format");
        }
    
        user.techStack = parsedTechStack;
      } catch {
        return NextResponse.json(
          { error: "Invalid techStack format, must be a JSON array" },
          { status: 400 }
        );
      }
    }

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const tempFilePath = join('/tmp', `${randomUUID()}.jpg`);
      await writeFile(tempFilePath, buffer);

      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
          folder: 'user_profiles',
      });

      user.avatarUrl = uploadResult.secure_url;
    }

    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        status: 500,
        error: "Failed to update your profile",
      },
      { status: 500 }
    );
  }
}

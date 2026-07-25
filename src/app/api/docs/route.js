import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import UserDocs from "@/models/UserDocs";
import { uploadToR2 } from "@/utils/uploadToR2";
import { deleteFromR2 } from "@/utils/deleteFromR2";

export async function POST(req) {
    try {
        await connectDB();
        const formData = await req.formData();
        const file = formData.get("file");
        const userId = formData.get("userId");
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const upload = await uploadToR2({
            file: buffer,
            folder: "userDocs",
            fileName: `${Date.now()}-${file.name}`,
            contentType: file.type,
        });

        const doc = await UserDocs.create({
            userId,
            docUrl: upload.url,
            docField: upload.key,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
        });

        return NextResponse.json(doc);
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Upload failed" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("user");

    const docs = await UserDocs.find({ userId }).sort({
        createdAt: -1,
    });
    return NextResponse.json(docs);
}

export async function DELETE(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    const doc = await UserDocs.findById(id);

    if (!doc) {
        return NextResponse.json(
            { message: "Not found" },
            { status: 404 }
        );
    }

    await deleteFromR2(doc.docField);

    await UserDocs.findByIdAndDelete(id);

    return NextResponse.json({
        success: true,
    });
}
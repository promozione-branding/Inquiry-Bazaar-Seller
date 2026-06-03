import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Webpage from "@/models/UserWebpage";
import Business from "@/models/UserBusiness";
import { uploadToR2 } from "@/utils/uploadToR2";

const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

export async function POST(req) {
    try {
        await connectDB();

        const formData = await req.formData();

        const userId = formData.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "UserId required" }, { status: 400 });
        }

        // ✅ Parse JSON fields
        const hero = JSON.parse(formData.get("hero"));
        const about = JSON.parse(formData.get("about"));
        const work = JSON.parse(formData.get("work"));
        const cta = JSON.parse(formData.get("cta"));
        const faqSection = JSON.parse(formData.get("faqSection"));

        // ✅ Files
        const heroFile = formData.get("heroImage");
        const aboutFile = formData.get("aboutImage");
        const faqFile = formData.get("faqImage");

        // 🔥 Upload helper
        const uploadImage = async (file, folder) => {
            if (!file || file.size === 0) return null;

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${file.name}`;

            const res = await uploadToR2({
                file: buffer,
                folder,
                fileName,
                contentType: file.type,
            });

            return res.url;
        };

        // ✅ Upload images
        const heroImageUrl = await uploadImage(heroFile, "webpage/hero");
        const aboutImageUrl = await uploadImage(aboutFile, "webpage/about");
        const faqImageUrl = await uploadImage(faqFile, "webpage/faq");

        if (heroImageUrl) hero.image = heroImageUrl;
        if (aboutImageUrl) about.image = aboutImageUrl;
        if (faqImageUrl) faqSection.image = faqImageUrl;

        // ✅ Get business for slug
        const business = await Business.findOne({ userId });

        if (!business || !business.companyName) {
            return NextResponse.json(
                { message: "Business not found" },
                { status: 400 }
            );
        }

        const baseSlug = generateSlug(business.companyName);

        let slug = baseSlug;
        let count = 1;

        while (await Webpage.findOne({ slug })) {
            slug = `${baseSlug}-${count++}`;
        }

        // ✅ Final payload
        const payload = {
            userId,
            slug,
            hero,
            about,
            work,
            cta,
            faqSection,
        };

        // ✅ Check existing
        let webpage = await Webpage.findOne({ userId });

        if (webpage) {
            payload.slug = webpage.slug; // keep slug

            webpage = await Webpage.findOneAndUpdate(
                { userId },
                payload,
                { new: true }
            );

            return NextResponse.json({
                message: "Updated successfully",
                data: webpage,
            });
        }

        const newWebpage = await Webpage.create(payload);

        return NextResponse.json({
            message: "Created successfully",
            data: newWebpage,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
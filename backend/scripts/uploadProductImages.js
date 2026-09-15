require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const Product = require("../models/Product");

const connectDB = require("../config/db");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const imageFolder = path.join(
    __dirname,
    "../../product-images"
);

const normalize = (text) => {
    return text
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const uploadImages = async () => {
    try {
        await connectDB();

        const files = fs.readdirSync(imageFolder);

        const imageFiles = files.filter((file) => {
            return [
                ".jpg",
                ".jpeg",
                ".png",
                ".webp"
            ].includes(
                path.extname(file).toLowerCase()
            );
        });

        console.log(
            `Found ${imageFiles.length} images.`
        );

        const products = await Product.find();

        let uploaded = 0;
        let notFound = 0;

        for (const file of imageFiles) {
            const fileName = path.parse(file).name;

            const normalizedFileName =
                normalize(fileName);

            const product = products.find(
                (item) =>
                    normalize(item.name) ===
                    normalizedFileName
            );

            if (!product) {
                console.log(
                    `❌ No product found for: ${file}`
                );

                notFound++;
                continue;
            }

            console.log(
                `Uploading: ${file} → ${product.name}`
            );

            const filePath = path.join(
                imageFolder,
                file
            );

            const result =
                await cloudinary.uploader.upload(
                    filePath,
                    {
                        folder:
                            "resellbazar/products"
                    }
                );

            product.images = [
                result.secure_url
            ];

            await product.save();

            uploaded++;

            console.log(
                `✅ Done: ${product.name}`
            );
        }

        console.log("\n==============================");
        console.log("Image upload completed");
        console.log("==============================");
        console.log(`Uploaded: ${uploaded}`);
        console.log(`Not matched: ${notFound}`);
        console.log(
            `Total images: ${imageFiles.length}`
        );

        await mongoose.connection.close();
    } catch (error) {
        console.error(
            "❌ Image upload failed:",
            error.message
        );

        await mongoose.connection.close();
        process.exit(1);
    }
};

uploadImages();
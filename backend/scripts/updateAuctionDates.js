require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Auction = require("../models/Auction");

const updateAuctionDates = async () => {
    try {
        await connectDB();

        const auctions = await Auction.find()
            .sort({ createdAt: 1 });

        if (auctions.length === 0) {
            console.log("No auctions found.");
            process.exit(0);
        }

        const now = new Date();

        /*
            Auction 1 → LIVE
            Starts 1 hour ago
            Ends 2 days from now
        */
        if (auctions[0]) {
            const startTime = new Date(
                now.getTime() - 60 * 60 * 1000
            );

            const endTime = new Date(
                now.getTime() + 2 * 24 * 60 * 60 * 1000
            );

            auctions[0].startTime = startTime;
            auctions[0].endTime = endTime;
            auctions[0].status = "active";

            await auctions[0].save();

            console.log(
                `LIVE: ${auctions[0].product}`
            );
        }

        /*
            Auction 2 → UPCOMING
            Starts 1 day from now
            Ends 3 days from now
        */
        if (auctions[1]) {
            const startTime = new Date(
                now.getTime() + 1 * 24 * 60 * 60 * 1000
            );

            const endTime = new Date(
                now.getTime() + 3 * 24 * 60 * 60 * 1000
            );

            auctions[1].startTime = startTime;
            auctions[1].endTime = endTime;
            auctions[1].status = "upcoming";

            await auctions[1].save();

            console.log(
                `UPCOMING: ${auctions[1].product}`
            );
        }

        /*
            Remaining auctions → ENDED
            Ends 1 day ago
        */
        for (let i = 2; i < auctions.length; i++) {
            const startTime = new Date(
                now.getTime() - 3 * 24 * 60 * 60 * 1000
            );

            const endTime = new Date(
                now.getTime() - 1 * 24 * 60 * 60 * 1000
            );

            auctions[i].startTime = startTime;
            auctions[i].endTime = endTime;
            auctions[i].status = "ended";

            await auctions[i].save();

            console.log(
                `ENDED: ${auctions[i].product}`
            );
        }

        console.log("");
        console.log("==============================");
        console.log("Auction dates updated");
        console.log("==============================");
        console.log(`Total auctions: ${auctions.length}`);
        console.log("Live: 1");
        console.log("Upcoming: 1");
        console.log(
            `Ended: ${Math.max(auctions.length - 2, 0)}`
        );

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error(
            "Failed to update auctions:",
            error.message
        );

        await mongoose.connection.close();

        process.exit(1);
    }
};

updateAuctionDates();
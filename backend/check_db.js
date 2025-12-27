import mongoose from "mongoose";
import dotenv from "dotenv";
import Solution from "./models/solutionModel.js";
import connectDB from "./config/db.js";

dotenv.config();

const checkData = async () => {
    try {
        await connectDB();
        const count = await Solution.countDocuments();
        console.log(`Solution Count: ${count}`);

        if (count > 0) {
            const sample = await Solution.findOne();
            console.log("Sample Solution:", JSON.stringify(sample, null, 2));
        } else {
            console.log("No solutions found in the database.");
        }
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkData();

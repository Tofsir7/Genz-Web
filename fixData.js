const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Student } = require('./Models/Students');

dotenv.config();

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const updates = [
            { old: "Data Analysis with Exel", new: "Data Analysis with Excel" },
            { old: "Social MEdia Marketing", new: "Social Media Marketing" }
        ];

        for (const u of updates) {
            const res = await Student.updateMany(
                { course: u.old },
                { $set: { course: u.new } }
            );
            console.log(`Updated "${u.old}" -> "${u.new}": ${res.modifiedCount} documents.`);
        }

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

fixData();

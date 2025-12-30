const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { Student } = require('./Models/Students');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const args = process.argv.slice(2);
        const email = args[0] || 'admin@genzit.com';
        const password = args[1] || 'admin1234';
        const fullName = args[2] || 'Super Admin';

        // Check if user exists
        let admin = await Student.findOne({ email });
        const hashedPassword = await bcrypt.hash(password, 10);

        if (admin) {
            console.log(`User ${email} exists. Updating to Admin role...`);
            admin.role = 'admin';
            admin.password = hashedPassword; // update password too
            await admin.save();
        } else {
            console.log(`Creating new Admin user: ${email}...`);
            admin = new Student({
                fullName,
                email,
                password: hashedPassword,
                dob: new Date(),
                gender: 'male',
                course: 'N/A', // Admins might not have a course
                role: 'admin'
            });
            await admin.save();
        }

        console.log('✅ Admin user configured successfully.');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();

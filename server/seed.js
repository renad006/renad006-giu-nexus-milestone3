const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const hashed = await bcrypt.hash('admin123', 10);

    const userCollection = mongoose.connection.collection('users');
    
    await userCollection.insertOne({
    name: 'Admin User',
    email: 'admin@giunexus.com',
    password: hashed,
    role: 'admin',
    status: 'approved',
    bio: '',
    skills: [],
    profilePicture: '',
    savedJobs: [],
    createdAt: new Date(),
    updatedAt: new Date()
    });

    console.log('Done! Admin created.');
    console.log('Email: admin@giunexus.com');
    console.log('Password: admin123');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
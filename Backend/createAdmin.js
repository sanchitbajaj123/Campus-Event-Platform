const mongoose = require('mongoose');
const { User } = require('./schema');

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/campus-events', { useNewUrlParser: true, useUnifiedTopology: true });
  const admin = new User({
    name: 'Admin User',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'ADMIN',
  });
  await admin.save();
  console.log('Admin user created:', admin);
  mongoose.disconnect();
}

createAdmin();

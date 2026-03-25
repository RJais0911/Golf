require('./src/config/env');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const connectDb = require('./src/config/db');
const User = require('./src/models/User.model');
const Charity = require('./src/models/Charity.model');

const SALT_ROUNDS = 12;

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding is only allowed in development');
  }

  await connectDb();
  await mongoose.connection.dropDatabase();

  const adminPassword = await bcrypt.hash('Admin@123', SALT_ROUNDS);
  const userPassword = await bcrypt.hash('User@123', SALT_ROUNDS);

  const charities = await Charity.insertMany([
    { name: 'Red Cross India', description: 'Emergency relief and humanitarian support.' },
    { name: 'CRY - Child Rights and You', description: 'Advocates for children and their rights.' },
    { name: 'Pratham Education Foundation', description: 'Education access and learning improvement.' }
  ]);

  await User.create({
    name: 'Admin',
    email: 'admin@platform.com',
    password: adminPassword,
    role: 'admin'
  });

  await User.insertMany([
    {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: userPassword,
      role: 'user',
      charityId: charities[0]._id
    },
    {
      name: 'Neha Kapoor',
      email: 'neha@example.com',
      password: userPassword,
      role: 'user',
      charityId: charities[1]._id
    }
  ]);

  console.log('Seed completed successfully');
  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error('Seed failed', error);
  await mongoose.connection.close();
  process.exit(1);
});

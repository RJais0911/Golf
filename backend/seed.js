require('./src/config/env');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const connectDb = require('./src/config/db');
const User = require('./src/models/User.model');
const Charity = require('./src/models/Charity.model');
const Subscription = require('./src/models/Subscription.model');
const Score = require('./src/models/Score.model');
const Draw = require('./src/models/Draw.model');
const Winner = require('./src/models/Winner.model');
const CharityContribution = require('./src/models/CharityContribution.model');
const {
  SUBSCRIPTION_FEE_INR,
  YEARLY_SUBSCRIPTION_FEE_INR,
  SUBSCRIPTION_DURATION_DAYS,
  YEARLY_SUBSCRIPTION_DURATION_DAYS
} = require('./src/config/constants');

const SALT_ROUNDS = 12;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function daysFromNow(days) {
  return new Date(Date.now() + days * DAY_IN_MS);
}

function createSubscriptionDates(startOffsetDays, durationDays) {
  const startDate = daysFromNow(startOffsetDays);
  const endDate = new Date(startDate.getTime() + durationDays * DAY_IN_MS);

  return { startDate, endDate };
}

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding is only allowed in development');
  }

  await connectDb();
  await mongoose.connection.dropDatabase();

  const defaultUserPassword = await bcrypt.hash('123456', SALT_ROUNDS);

  const charities = await Charity.insertMany([
    { name: 'Red Cross India', description: 'Emergency relief and humanitarian support.' },
    { name: 'CRY - Child Rights and You', description: 'Advocates for children and their rights.' },
    { name: 'Pratham Education Foundation', description: 'Education access and learning improvement.' }
  ]);

  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: defaultUserPassword,
    role: 'admin'
  });

  const seededUsers = await User.insertMany([
    {
      name: 'Demo User',
      email: 'user@test.com',
      password: defaultUserPassword,
      role: 'user',
      charityId: charities[0]._id,
      contributionPercentage: 15,
      subscriptionPlan: 'monthly',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: daysFromNow(20),
      subscriptionPaymentReference: 'mock_monthly_seed_user'
    },
    {
      name: 'Neha Kapoor',
      email: 'neha@example.com',
      password: defaultUserPassword,
      role: 'user',
      charityId: charities[1]._id,
      contributionPercentage: 20,
      subscriptionPlan: 'yearly',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: daysFromNow(325),
      subscriptionPaymentReference: 'mock_yearly_seed_neha'
    },
    {
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      password: defaultUserPassword,
      role: 'user',
      charityId: charities[2]._id,
      contributionPercentage: 25,
      subscriptionPlan: 'monthly',
      subscriptionStatus: 'cancelled',
      subscriptionExpiresAt: daysFromNow(-5),
      subscriptionPaymentReference: 'mock_monthly_seed_rahul'
    },
    {
      name: 'Aman Singh',
      email: 'aman@example.com',
      password: defaultUserPassword,
      role: 'user',
      charityId: charities[0]._id,
      contributionPercentage: 10,
      subscriptionPlan: null,
      subscriptionStatus: 'inactive',
      subscriptionExpiresAt: null,
      subscriptionPaymentReference: null
    }
  ]);

  const [demoUser, nehaUser, rahulUser, amanUser] = seededUsers;

  const monthlyDates = createSubscriptionDates(-10, SUBSCRIPTION_DURATION_DAYS);
  const yearlyDates = createSubscriptionDates(-40, YEARLY_SUBSCRIPTION_DURATION_DAYS);
  const cancelledDates = createSubscriptionDates(-35, SUBSCRIPTION_DURATION_DAYS);

  await Subscription.insertMany([
    {
      userId: demoUser._id,
      plan: 'monthly',
      amount: SUBSCRIPTION_FEE_INR,
      startDate: monthlyDates.startDate,
      endDate: monthlyDates.endDate,
      status: 'active',
      paymentReference: 'mock_monthly_seed_user',
      paymentStatus: 'paid'
    },
    {
      userId: nehaUser._id,
      plan: 'yearly',
      amount: YEARLY_SUBSCRIPTION_FEE_INR,
      startDate: yearlyDates.startDate,
      endDate: yearlyDates.endDate,
      status: 'active',
      paymentReference: 'mock_yearly_seed_neha',
      paymentStatus: 'paid'
    },
    {
      userId: rahulUser._id,
      plan: 'monthly',
      amount: SUBSCRIPTION_FEE_INR,
      startDate: cancelledDates.startDate,
      endDate: cancelledDates.endDate,
      status: 'cancelled',
      paymentReference: 'mock_monthly_seed_rahul',
      paymentStatus: 'paid'
    }
  ]);

  await CharityContribution.insertMany([
    {
      userId: demoUser._id,
      charityId: charities[0]._id,
      amount: 150,
      source: 'subscription',
      subscriptionPlan: 'monthly',
      paymentReference: 'mock_monthly_seed_user'
    },
    {
      userId: nehaUser._id,
      charityId: charities[1]._id,
      amount: 2160,
      source: 'subscription',
      subscriptionPlan: 'yearly',
      paymentReference: 'mock_yearly_seed_neha'
    },
    {
      userId: rahulUser._id,
      charityId: charities[2]._id,
      amount: 250,
      source: 'subscription',
      subscriptionPlan: 'monthly',
      paymentReference: 'mock_monthly_seed_rahul'
    }
  ]);

  const draw = await Draw.create({
    numbers: [3, 8, 14, 22, 30],
    totalPool: 6400,
    rolloverAmount: 0,
    drawDate: daysFromNow(-3),
    status: 'completed',
    triggeredBy: adminUser._id,
    createdAt: daysFromNow(-3),
    completedAt: daysFromNow(-3)
  });

  await Score.insertMany([
    {
      userId: demoUser._id,
      value: 3,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: demoUser._id,
      value: 8,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: demoUser._id,
      value: 14,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: demoUser._id,
      value: 27,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: demoUser._id,
      value: 41,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: nehaUser._id,
      value: 3,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: nehaUser._id,
      value: 8,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: nehaUser._id,
      value: 14,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: nehaUser._id,
      value: 22,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: nehaUser._id,
      value: 35,
      usedInDrawId: draw._id,
      createdAt: daysFromNow(-6)
    },
    {
      userId: demoUser._id,
      value: 5,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: demoUser._id,
      value: 11,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: demoUser._id,
      value: 18,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: demoUser._id,
      value: 26,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: demoUser._id,
      value: 33,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: nehaUser._id,
      value: 7,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: nehaUser._id,
      value: 12,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: nehaUser._id,
      value: 19,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: nehaUser._id,
      value: 31,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    },
    {
      userId: nehaUser._id,
      value: 44,
      usedInDrawId: null,
      createdAt: daysFromNow(-1)
    }
  ]);

  await Winner.insertMany([
    {
      userId: demoUser._id,
      drawId: draw._id,
      matchCount: 3,
      payoutAmount: 1600,
      charityAmount: 240,
      status: 'approved',
      approvedAt: daysFromNow(-2.5),
      createdAt: daysFromNow(-3)
    },
    {
      userId: nehaUser._id,
      drawId: draw._id,
      matchCount: 4,
      payoutAmount: 2240,
      charityAmount: 448,
      status: 'paid',
      approvedAt: daysFromNow(-2.5),
      paidAt: daysFromNow(-2),
      createdAt: daysFromNow(-3)
    }
  ]);

  await CharityContribution.create({
    userId: nehaUser._id,
    charityId: charities[1]._id,
    amount: 448,
    source: 'winning',
    subscriptionPlan: null,
    paymentReference: null
  });

  console.log('Seed completed successfully');
  console.log('Admin: admin@test.com / 123456');
  console.log('User: user@test.com / 123456');
  console.log('User: neha@example.com / 123456');
  console.log('User: rahul@example.com / 123456');
  console.log('User: aman@example.com / 123456');
  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error('Seed failed', error);
  await mongoose.connection.close();
  process.exit(1);
});

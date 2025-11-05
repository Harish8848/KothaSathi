const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RoomSathi database...');

  // Clear existing data
  await prisma.searchHistory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  // --- Create Users ---
  const [owner1, owner2, owner3, user1, user2, user3] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Ram Thapa',
        email: 'ram@example.com',
        phone: '9800000001',
        password,
        isOwner: true,
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sita Shrestha',
        email: 'sita@example.com',
        phone: '9800000002',
        password,
        isOwner: true,
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Kamal Bista',
        email: 'kamal@example.com',
        phone: '9800000003',
        password,
        isOwner: true,
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Hari BK',
        email: 'hari@example.com',
        phone: '9800000004',
        password,
        isOwner: false,
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maya Gurung',
        email: 'maya@example.com',
        phone: '9800000005',
        password,
        isOwner: false,
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Deepak Bohara',
        email: 'deepak@example.com',
        phone: '9800000006',
        password,
        isOwner: false,
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
      },
    }),
  ]);

  // --- Create Listings ---
  const listingsData = [
    {
      title: '2BHK Apartment in Kathmandu',
      description: 'Modern furnished apartment with mountain view and parking.',
      location: 'Kathmandu, Nepal',
      type: 'Apartment',
      price: 25000,
      capacity: 4,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      available: true,
      furnished: true,
      utilitiesIncluded: true,
      minLease: 6,
      amenities: ['WiFi', 'Balcony', 'Parking'],
      ownerId: owner1.id,
    },
    {
      title: 'Single Room near Phewa Lake',
      description: 'Quiet lakeside room ideal for students or remote workers.',
      location: 'Pokhara, Nepal',
      type: 'Room',
      price: 10000,
      capacity: 1,
      image: 'https://images.unsplash.com/photo-1600047508504-8b93a0c9c1f4',
      available: true,
      furnished: true,
      utilitiesIncluded: false,
      minLease: 3,
      amenities: ['WiFi', 'Lake View'],
      ownerId: owner2.id,
    },
    {
      title: 'Family Flat in Dhangadhi',
      description: '3-room family flat with garden and kitchen space.',
      location: 'Dhangadhi, Kailali',
      type: 'Flat',
      price: 18000,
      capacity: 5,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      available: true,
      furnished: false,
      utilitiesIncluded: true,
      minLease: 12,
      amenities: ['Parking', 'Garden'],
      ownerId: owner1.id,
    },
    {
      title: 'Budget Room in Butwal',
      description: 'Affordable room near college and local market.',
      location: 'Butwal, Nepal',
      type: 'Room',
      price: 8000,
      capacity: 1,
      image: 'https://images.unsplash.com/photo-1600585154518-8a6f19fca4d3',
      available: true,
      furnished: true,
      utilitiesIncluded: false,
      minLease: 2,
      amenities: ['WiFi'],
      ownerId: owner3.id,
    },
    {
      title: 'Luxury Studio Apartment in Lalitpur',
      description: 'Fully furnished studio with AC, lift, and parking.',
      location: 'Lalitpur, Nepal',
      type: 'Apartment',
      price: 40000,
      capacity: 2,
      image: 'https://images.unsplash.com/photo-1617093727343-3755c56a1c8a',
      available: true,
      furnished: true,
      utilitiesIncluded: true,
      minLease: 6,
      amenities: ['WiFi', 'Lift', 'AC', 'Balcony'],
      ownerId: owner2.id,
    },
    {
      title: 'Spacious House in Biratnagar',
      description: 'Perfect for families, large compound and car parking.',
      location: 'Biratnagar, Nepal',
      type: 'House',
      price: 30000,
      capacity: 6,
      image: 'https://images.unsplash.com/photo-1560184897-90a9d1d92e9e',
      available: true,
      furnished: false,
      utilitiesIncluded: false,
      minLease: 12,
      amenities: ['Parking', 'Garden', 'Water Supply'],
      ownerId: owner3.id,
    },
  ];

  const listings = await prisma.listing.createMany({
    data: listingsData,
  });

  const allListings = await prisma.listing.findMany();

  // --- Create Favorites ---
  await prisma.favorite.createMany({
    data: [
      { userId: user1.id, listingId: allListings[0].id },
      { userId: user2.id, listingId: allListings[1].id },
      { userId: user3.id, listingId: allListings[4].id },
      { userId: user1.id, listingId: allListings[5].id },
    ],
  });

  // --- Create Reviews ---
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        userId: user1.id,
        listingId: allListings[0].id,
      },
      {
        rating: 4,
        userId: user2.id,
        listingId: allListings[1].id,
      },
      {
        rating: 5,
        userId: user3.id,
        listingId: allListings[4].id,
      },
      {
        rating: 3,
        userId: user1.id,
        listingId: allListings[3].id,
      },
    ],
  });

  // --- Create Search History ---
  await prisma.searchHistory.createMany({
    data: [
      { userId: user1.id, query: 'Apartment Kathmandu', filter: 'price<30000' },
      { userId: user2.id, query: 'Room Pokhara', filter: 'furnished=true' },
      { userId: user3.id, query: 'Flat Dhangadhi', filter: 'lease>6' },
    ],
  });

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
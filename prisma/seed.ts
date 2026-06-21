const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Delete all existing data to prevent duplicates on re-seed
  await prisma.review.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Destinations
  const dest1 = await prisma.destination.create({
    data: {
      name: "Bali",
      country: "Indonesia",
      weather: "29°C", // Will be overwritten by Open-Meteo in real-time but good default
      cost: 1500,
      season: "Summer",
      activities: JSON.stringify(["Surfing", "Temples", "Yoga", "Beaches"]),
      ratings: 4.8
    }
  });

  const dest2 = await prisma.destination.create({
    data: {
      name: "Kyoto",
      country: "Japan",
      weather: "15°C",
      cost: 3000,
      season: "Spring",
      activities: JSON.stringify(["Shrines", "Tea Ceremonies", "Bamboo Forest", "Sushi"]),
      ratings: 4.9
    }
  });

  const dest3 = await prisma.destination.create({
    data: {
      name: "Swiss Alps",
      country: "Switzerland",
      weather: "-2°C",
      cost: 4500,
      season: "Winter",
      activities: JSON.stringify(["Skiing", "Hiking", "Fondue", "Snowboarding"]),
      ratings: 4.9
    }
  });

  const dest4 = await prisma.destination.create({
    data: {
      name: "Santorini",
      country: "Greece",
      weather: "24°C",
      cost: 2500,
      season: "Summer",
      activities: JSON.stringify(["Sailing", "Wine Tasting", "Sunsets", "Beaches"]),
      ratings: 4.7
    }
  });

  // Create Hotels
  await prisma.hotel.create({
    data: {
      name: "Seabreeze Resort & Spa",
      location: "Bali, Indonesia",
      price: 12500,
      amenities: JSON.stringify(["Infinity Pool", "Private Beach", "Spa", "Free WiFi"]),
      ratings: 4.8
    }
  });

  await prisma.hotel.create({
    data: {
      name: "Kyoto Machiya Inn",
      location: "Kyoto, Japan",
      price: 18000,
      amenities: JSON.stringify(["Traditional Tatami", "Onsen", "Tea Room", "City Center"]),
      ratings: 4.9
    }
  });

  await prisma.hotel.create({
    data: {
      name: "Alpine Lodge Resort",
      location: "Swiss Alps, Switzerland",
      price: 35000,
      amenities: JSON.stringify(["Ski-in/Ski-out", "Heated Pool", "Fireplace", "Mountain View"]),
      ratings: 4.7
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const family = [
    "Mom",
    "Dad",
    "Avery",
    "Riley",
    "Blair",
    "Wyatt",
  ];

  for (const name of family) {
    await prisma.person.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("🌱 Family seeded");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
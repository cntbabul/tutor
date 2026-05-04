const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const titlesToDelete = ["Physics Crash Course Class 12", "Mathematics for Class 10 (CBSE/SEBA)"];
  
  const result = await prisma.listing.deleteMany({
    where: {
      title: {
        in: titlesToDelete
      }
    }
  });
  
  console.log(`Deleted ${result.count} mock listings.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

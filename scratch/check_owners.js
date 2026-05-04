const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const listings = await prisma.listing.findMany({
    include: {
      tutor: true
    }
  });
  listings.forEach(l => {
    console.log(`Listing: ${l.title} (ID: ${l.id}) | Tutor UserID: ${l.tutor?.userId}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

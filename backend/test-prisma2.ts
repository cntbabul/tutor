import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function main() {
  try {
    const connectionString = process.env.DATABASE_URL!;
    const adapter = new PrismaNeon({ connectionString });
    const prisma = new PrismaClient({ adapter });
    
    console.log("Connecting...");
    const res = await prisma.listing.findMany({ take: 1 });
    console.log("Success:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}
main();

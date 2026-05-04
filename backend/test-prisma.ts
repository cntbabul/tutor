import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { WebSocket } from "ws";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

async function main() {
  try {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    const prisma = new PrismaClient({ adapter });
    
    console.log("Connecting...");
    const res = await prisma.listing.findMany({ take: 1 });
    console.log("Success:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}
main();

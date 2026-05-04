import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
declare const prisma: PrismaClient<{
    adapter: PrismaNeon;
}, never, import("@prisma/client/runtime/client").DefaultArgs>;
export default prisma;
//# sourceMappingURL=db.d.ts.map
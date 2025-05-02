import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("Missing Supabase database URL environment variable");
}

// Check to determine when Supabase will kick off
const useDB = process.env.USE_DB === "true";
if (!useDB) {
  throw new Error("USE_DB has not been set in the .env file");
}

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: useDB
    ? {
        url: process.env.DATABASE_URL,
      }
    : undefined,
});

/**THE ONE BELOW IS FOR PRODUCTION*/

// import { config } from "dotenv";
// import { defineConfig } from "drizzle-kit";

// config({ path: ".env" });

// if (!process.env.DATABASE_URL) {
//   throw new Error("Missing Supabase database URL environment variable");
// }

// export default defineConfig({
//   schema: "./db/schema.ts",
//   out: "./supabase/migrations",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.DATABASE_URL,
//   },
// });

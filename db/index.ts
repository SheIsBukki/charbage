import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing neon database connection string");
}
const client = postgres(process.env.DATABASE_URL!);
// const sql = neon(connectionString);
export const db = drizzle(client);
// Disable prefetch as it is not supported for "Transaction" pool mode
// export const client = postgres(connectionString, { prepare: false });
// export const db = drizzle({ client: sql, casing: "snake_case" });
// export const db = drizzle(sql);

/**I WILL USE THIS FOR LOCAL and DELETE FOR PRODUCTION AT THE FINAL STAGE*/
// import { config } from "dotenv";
// import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// config({ path: ".env" });

// // Checks to ensure Supabase doesn't kick off when I don't want it to
// const useDB = process.env.USE_DB === "true";

// // let client, db;

// let client: postgres.Sql<{}>;
// let db: PostgresJsDatabase<Record<string, never>> & {
//   $client: postgres.Sql<{}>;
// };

// if (useDB) {
//   const connectionString = process.env.DATABASE_URL;

//   if (!connectionString) {
//     throw new Error("Missing supabase database connection string");
//   }

//   // Disable prefetch as it is not supported for "Transaction" pool mode
//   client = postgres(connectionString, { prepare: false });
//   db = drizzle({ client });
// }

// export { client, db };

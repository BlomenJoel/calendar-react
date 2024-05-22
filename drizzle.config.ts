import { defineConfig } from "drizzle-kit";
import './lib/envConfig';

console.log(process.env.POSTGRES_URL, "url")

export default defineConfig({
  schema: './lib/schemas/index.ts',
  out: './migrations',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
})

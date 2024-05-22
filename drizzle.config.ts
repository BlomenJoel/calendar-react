import { defineConfig } from "drizzle-kit";
import './lib/envConfig';

export default defineConfig({
  schema: './lib/schemas/index.ts',
  out: './migrations',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
})

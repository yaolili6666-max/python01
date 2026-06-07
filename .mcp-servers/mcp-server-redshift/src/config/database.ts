import dotenv from "dotenv";
dotenv.config();

export const config = {
  host: process.env.REDSHIFT_HOST!,
  port: parseInt(process.env.REDSHIFT_PORT || "5439"),
  database: process.env.REDSHIFT_DATABASE!,
  user: process.env.REDSHIFT_USER!,
  password: process.env.REDSHIFT_PASSWORD!,
  schemas: (process.env.REDSHIFT_SCHEMAS || "public").split(","),
};

export function validateConfig() {
  for (const v of ["REDSHIFT_HOST", "REDSHIFT_DATABASE", "REDSHIFT_USER", "REDSHIFT_PASSWORD"]) {
    if (!process.env[v]) throw new Error(`Missing env: ${v}`);
  }
}

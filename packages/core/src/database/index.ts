import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Resource } from "sst";
export * from "drizzle-orm";
import * as movieSchema from "../movie/movie.sql";
import * as theaterSchema from "../theater/theater.sql";
import * as daySalesSchema from "../sales/day-sales.sql";

export const schema = {
  ...movieSchema,
  ...theaterSchema,
  ...daySalesSchema,
};

type Schema = typeof schema;

const client = new Client({
  host: Resource.Database.host,
  username: Resource.Database.username,
  password: Resource.Database.password,
});

export const db = drizzle(client, {
  schema,
  logger:
    process.env.DRIZZLE_LOG === "true"
      ? {
          logQuery(query, params) {
            console.log("query", query);
            console.log("params", params);
          },
        }
      : undefined,
});

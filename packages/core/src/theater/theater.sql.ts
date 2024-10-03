import { relations } from "drizzle-orm";
import { varchar } from "drizzle-orm/mysql-core";
import { id, table, timestamps } from "../database/types";
import { daySalesTable } from "../sales/day-sales.sql";

export const theaterTable = table("theater", {
  ...id,
  name: varchar("name", { length: 255 }).notNull().unique(),
  ...timestamps,
});

export const theaterRelations = relations(theaterTable, ({ many }) => ({
  daySales: many(daySalesTable),
}));

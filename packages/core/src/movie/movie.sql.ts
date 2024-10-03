import { relations } from "drizzle-orm";
import { id, table, timestamps } from "../database/types";
import { daySalesTable } from "../sales/day-sales.sql";
import { text } from "drizzle-orm/mysql-core";

export const movieTable = table("movie", {
  ...id,
  title: text("title").notNull(),
  ...timestamps,
});

export const movieRelations = relations(movieTable, ({ many }) => ({
  daySales: many(daySalesTable),
}));

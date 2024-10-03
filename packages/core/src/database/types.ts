import { sql } from "drizzle-orm";
import {
  bigint,
  timestamp as drizzleTs,
  mysqlTableCreator,
} from "drizzle-orm/mysql-core";

/**
 * MySQL table creator with project prefix
 */
export const table = mysqlTableCreator((name) => `ata_${name}`);

/**
 * ID column for integer primary keys
 */
export const id = {
  get id() {
    return bigint("id", { mode: "number" }).primaryKey().autoincrement();
  },
};

/**
 * Timestamp column, formatted like `2024-02-29 12:00:00.000`
 */
export const timestamp = (name: string) =>
  drizzleTs(name, {
    fsp: 3,
    mode: "date",
  });

/**
 * Timestamp columns for created, updated, and deleted
 */
export const timestamps = {
  timeCreated: timestamp("time_created").notNull().defaultNow(),
  timeUpdated: timestamp("time_updated")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`),
  timeDeleted: timestamp("time_deleted"),
};

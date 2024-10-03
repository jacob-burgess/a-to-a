import { relations } from "drizzle-orm";
import { id, table, timestamps } from "../database/types";
import { movieTable } from "../movie/movie.sql";
import { theaterTable } from "../theater/theater.sql";
import { bigint, date, uniqueIndex } from "drizzle-orm/mysql-core";

export const daySalesTable = table(
  "day_sales",
  {
    ...id,
    theaterId: bigint("theaterId", { mode: "number" })
      .references(() => theaterTable.id)
      .notNull(),
    movieId: bigint("movieId", { mode: "number" })
      .references(() => movieTable.id)
      .notNull(),
    sales: bigint("sales", { mode: "number" }).notNull(),
    date: date("date").notNull(),
    ...timestamps,
  },
  (table) => ({
    uniqueMovieTheaterDay: uniqueIndex("unique_movie_theater_day").on(
      table.theaterId,
      table.movieId,
      table.date
    ),
  })
);

export const daySalesRelations = relations(daySalesTable, ({ one }) => ({
  theater: one(theaterTable, {
    fields: [daySalesTable.theaterId],
    references: [theaterTable.id],
  }),
  movie: one(movieTable, {
    fields: [daySalesTable.movieId],
    references: [movieTable.id],
  }),
}));

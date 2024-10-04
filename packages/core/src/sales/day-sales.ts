import { asc, eq, sql, sum } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { useTransaction } from "../database/transaction";
import { Movie } from "../movie/movie";
import { movieTable } from "../movie/movie.sql";
import { Theater } from "../theater/theater";
import { theaterTable } from "../theater/theater.sql";
import { fn } from "../utils/fn";
import { daySalesTable } from "./day-sales.sql";

export module DaySales {
  export const Info = z.object({
    id: z.number(),
    date: z.date(),
    sales: z.number(),
    movie: Movie.Info,
    theater: Theater.Info,
  });
  export type Info = z.infer<typeof Info>;

  export const byId = fn(Info.shape.id, async (id) =>
    useTransaction(async (tx) =>
      tx
        .select()
        .from(daySalesTable)
        .innerJoin(movieTable, eq(daySalesTable.movieId, movieTable.id))
        .innerJoin(theaterTable, eq(daySalesTable.theaterId, theaterTable.id))
        .where(eq(daySalesTable.id, id))
        .then((results) => results.map(serialize).at(0))
    )
  );

  export const byDate = fn(z.date(), async (date) =>
    useTransaction(
      async (tx) =>
        tx
          .select({
            theater: theaterTable.name,
            sales: sum(daySalesTable.sales).as("total_sales"),
          })
          .from(daySalesTable)
          .innerJoin(theaterTable, eq(daySalesTable.theaterId, theaterTable.id))
          .where(eq(daySalesTable.date, date))
          .groupBy(theaterTable.id)
          .orderBy(sql`total_sales desc`)
      // .orderBy(desc(daySalesTable.sales))
    )
  );

  export const listByDate = fn(z.object({}), async () =>
    useTransaction(async (tx) =>
      tx
        .select()
        .from(daySalesTable)
        .innerJoin(movieTable, eq(daySalesTable.movieId, movieTable.id))
        .innerJoin(theaterTable, eq(daySalesTable.theaterId, theaterTable.id))
        .orderBy(
          asc(daySalesTable.date),
          asc(theaterTable.name),
          asc(movieTable.title)
        )
        .then((results) => results.map(serialize))
    )
  );

  export const distinctDates = fn(z.object({}), async () =>
    useTransaction(async (tx) =>
      tx
        .selectDistinct({
          date: daySalesTable.date,
        })
        .from(daySalesTable)
        .orderBy(asc(daySalesTable.date))
        .then((results) => results.map((r) => r.date))
    )
  );

  export const create = fn(createInsertSchema(daySalesTable), async (input) =>
    createMany([input])
  );

  export const createMany = fn(
    z.array(createInsertSchema(daySalesTable)),
    async (input) =>
      useTransaction(async (tx) => tx.insert(daySalesTable).values(input))
  );

  export const clear = fn(z.object({}), async () =>
    useTransaction(async (tx) => tx.delete(daySalesTable))
  );

  type DaySalesJoined = {
    day_sales: typeof daySalesTable.$inferSelect;
    movie: typeof movieTable.$inferSelect;
    theater: typeof theaterTable.$inferSelect;
  };
  const serialize = (input: DaySalesJoined): Info => {
    return {
      id: input.day_sales.id,
      date: input.day_sales.date,
      sales: input.day_sales.sales,
      movie: {
        id: input.movie.id,
        title: input.movie.title,
      },
      theater: {
        id: input.theater.id,
        name: input.theater.name,
      },
    };
  };
}

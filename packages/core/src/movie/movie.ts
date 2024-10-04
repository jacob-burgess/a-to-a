import { z } from "zod";
import { fn } from "../utils/fn";
import { useTransaction } from "../database/transaction";
import { movieTable } from "./movie.sql";
import { eq, asc } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export module Movie {
  export const Info = z.object({
    id: z.number(),
    title: z.string(),
  });
  export type Info = z.infer<typeof Info>;

  export const byId = fn(Info.shape.id, async (id) =>
    useTransaction(async (tx) =>
      tx
        .select()
        .from(movieTable)
        .where(eq(movieTable.id, id))
        .then((rows) => rows.map(serialize).at(0))
    )
  );

  export const list = fn(z.object({}), async () =>
    useTransaction(async (tx) =>
      tx
        .select()
        .from(movieTable)
        .orderBy(asc(movieTable.title))
        .then((rows) => rows.map(serialize))
    )
  );

  export const create = fn(createInsertSchema(movieTable), async (input) =>
    createMany([input])
  );

  export const createMany = fn(
    z.array(createInsertSchema(movieTable)),
    async (input) =>
      useTransaction(async (tx) => tx.insert(movieTable).values(input))
  );

  export const clear = fn(z.object({}), async () =>
    useTransaction(async (tx) => tx.delete(movieTable))
  );

  const serialize = (input: typeof movieTable.$inferSelect): Info => {
    return {
      id: input.id,
      title: input.title,
    };
  };
}

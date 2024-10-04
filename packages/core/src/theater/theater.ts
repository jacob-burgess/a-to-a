import { asc, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { useTransaction } from "../database/transaction";
import { fn } from "../utils/fn";
import { theaterTable } from "./theater.sql";

export module Theater {
  export const Info = z.object({
    id: z.number(),
    name: z.string(),
  });
  export type Info = z.infer<typeof Info>;

  export const byId = fn(Info.shape.id, async (id) =>
    useTransaction(async (tx) =>
      tx
        .select()
        .from(theaterTable)
        .where(eq(theaterTable.id, id))
        .then((rows) => rows.map(serialize).at(0))
    )
  );

  export const list = fn(z.object({}), async () =>
    useTransaction(async (tx) =>
      tx
        .select()
        .from(theaterTable)
        .orderBy(asc(theaterTable.name))
        .then((rows) => rows.map(serialize))
    )
  );

  export const create = fn(createInsertSchema(theaterTable), async (input) =>
    createMany([input])
  );

  export const createMany = fn(
    z.array(createInsertSchema(theaterTable)),
    async (input) =>
      useTransaction(async (tx) => tx.insert(theaterTable).values(input))
  );

  export const clear = fn(z.object({}), async () =>
    useTransaction(async (tx) => tx.delete(theaterTable))
  );

  const serialize = (input: typeof theaterTable.$inferSelect): Info => {
    return {
      id: input.id,
      name: input.name,
    };
  };
}

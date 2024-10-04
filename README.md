# Theater sales example

## Built with

- [SST](https://sst.dev)
- [Drizzle](https://orm.drizzle.team)
- [Hono](https://hono.dev)
- [PlanetScale](https://planetscale.com)

## DB Schema

in the `.sql.ts` files in the `core` package.

- Movies have a title
- Theaters have a name
- Day-Sales relates a movie and theater to a day and has a sales count

Sales data is seeded randomly as described in the `core/src/seed.ts` file.

## App

live at https://lzzfcai4cgl7oztatomhsvilcq0zdkod.lambda-url.us-east-1.on.aws/

Simple Hono api that returns html for pages

- `/theaters` - list of theaters
- `/movies` - list of movies
- `/sales` - list of sales ordered by date, theater, movie
- `/sales/:date` - list of sales for a given day

## Deployment

- Planetscale database
- SST IaC
- Hono deployed to aws lamnbda

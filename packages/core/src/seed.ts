import { Movie } from "./movie/movie";
import { DaySales } from "./sales/day-sales";
import { Theater } from "./theater/theater";

const movies = [
  {
    id: 1,
    title: "The Matrix",
  },
  {
    id: 2,
    title: "Shrek",
  },
  {
    id: 3,
    title: "The Dark Knight",
  },
  {
    id: 4,
    title: "The Lord of the Rings",
  },
];

const theaters = [
  {
    id: 1,
    name: "Theater 1",
  },
  {
    id: 2,
    name: "Theater 2",
  },
];

const days = [
  new Date("2024-05-01"),
  new Date("2024-05-02"),
  new Date("2024-05-03"),
];

/**
 *
 * @returns random number between 100 and 1000
 */
export const randomNumber = () => {
  return Math.floor(Math.random() * 900) + 100;
};

const buildSales = () => {
  const sales = [];
  for (const theater of theaters) {
    for (const movie of movies) {
      for (const day of days) {
        sales.push({
          date: day,
          sales: randomNumber(),
          theaterId: theater.id,
          movieId: movie.id,
        });
      }
    }
  }
  return sales;
};

export const seed = async () => {
  console.log("Clearing existing tables");
  await DaySales.clear({});
  await Movie.clear({});
  await Theater.clear({});

  await Movie.createMany(movies);
  await Theater.createMany(theaters);
  await DaySales.createMany(buildSales());
};

seed()
  .then(() => {
    console.log("Seeded");
  })
  .catch((error) => {
    console.error(error);
  });

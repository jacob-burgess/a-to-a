import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { Movie } from "@a-to-a/core/movie/movie";
import { Theater } from "@a-to-a/core/theater/theater";
import { DaySales } from "@a-to-a/core/sales/day-sales";
import { html } from "hono/html";

const app = new Hono();

const nav = html`
  <div class="container">
    <a href="/theaters">Theaters</a>
    <a href="/movies">Movies</a>
    <a href="/sales">Sales</a>
  </div>
`;

const head = html`
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Theater Sales Rankings</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // height: 100vh;
      }
      .container {
        display: flex;
        gap: 1rem;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  </head>
`;

app.get("/", async (c) => {
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      ${head}
      <body>
        ${nav}
      </body>
    </html>
  `);
});

app.get("/sales", async (c) => {
  const sales = await DaySales.listByDate({});

  const dates = await DaySales.distinctDates({});

  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      ${head}
      <body>
        ${nav}
        <h1>Theater Sales Rankings</h1>
        ${dates.map(
          (date) => html`
            <a href="/sales/${date.toISOString()}"
              >${date.toLocaleDateString()}</a
            >
          `
        )}
        <table>
          <tr>
            <th>Date</th>
            <th>Theater</th>
            <th>Movie</th>
            <th>Sales</th>
          </tr>
          ${sales.map(
            (sale) => html`
              <tr>
                <td>${sale.date.toLocaleDateString()}</td>
                <td>${sale.theater.name}</td>
                <td>${sale.movie.title}</td>
                <td>${sale.sales}</td>
              </tr>
            `
          )}
        </table>
      </body>
    </html>
  `);
});

app.get("/sales/:date", async (c) => {
  const date = c.req.param("date");
  const sales = await DaySales.byDate(new Date(date));

  if (sales.length === 0) {
    return c.html(html`
      <!DOCTYPE html>
      <html lang="en">
        ${head}
        <body>
          ${nav}
          <h1>No sales for ${date}</h1>
        </body>
      </html>
    `);
  }

  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      ${head}
      <body>
        ${nav}
        <h1>Sales for ${date}</h1>
        <table>
          <tr>
            <th>Theater</th>
            <th>Total Sales</th>
          </tr>
          ${sales.map(
            (sale: any) => html`
              <tr>
                <td>${sale.theater}</td>
                <td>${sale.sales}</td>
              </tr>
            `
          )}
        </table>
      </body>
    </html>
  `);
});

app.get("/theaters", async (c) => {
  const theaters = await Theater.list({});
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      ${head}
      <body>
        ${nav}
        <h1>Theaters</h1>
        <table>
          <tr>
            <th>Name</th>
          </tr>
          ${theaters.map(
            (theater: any) => html`
              <tr>
                <td>${theater.name}</td>
              </tr>
            `
          )}
        </table>
      </body>
    </html>
  `);
});

app.get("/movies", async (c) => {
  const movies = await Movie.list({});
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      ${head}
      <body>
        ${nav}
        <h1>Movies</h1>
        <table>
          <tr>
            <th>Title</th>
          </tr>
          ${movies.map(
            (movie: any) => html`
              <tr>
                <td>${movie.title}</td>
              </tr>
            `
          )}
        </table>
      </body>
    </html>
  `);
});

export const handler = handle(app);

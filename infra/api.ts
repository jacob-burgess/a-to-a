import { database } from "./database";

export const api = new sst.aws.Function("Api", {
  handler: "./packages/functions/src/api.handler",
  url: true,
  link: [database],
});

export const outputs = {
  apiUrl: api.url,
};

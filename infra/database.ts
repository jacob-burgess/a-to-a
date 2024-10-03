import { Linkable } from "../.sst/platform/src/components";

const mysql = planetscale.getDatabaseOutput({
  name: "matchbox",
  organization: "boogie",
});

const branch = planetscale.getBranchOutput({
  name: "dev",
  organization: mysql.organization,
  database: mysql.name,
});

const password = new planetscale.Password("DatabasePassword", {
  organization: mysql.organization,
  database: mysql.name,
  branch: branch.name,
  role: "admin",
  name: `${$app.name}-${$app.stage}-credentials`,
});

export const database = new Linkable("Database", {
  properties: {
    username: password.username,
    password: password.plaintext,
    host: branch.mysqlAddress,
    database: password.database,
    port: 3306,
  },
});

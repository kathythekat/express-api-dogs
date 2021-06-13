const { Client } = require("pg");

//If there's a test DB
// const DB_URI =
//   process.env.NODE_ENV === "test"
//     ? "postgresql:///dogs_test"
//     : "postgresql:///dogs";

// let db = new Client({
//   connectionString: DB_URI,
// });

let db = new Client({
  connectionString: "postgresql:///dogs",
});

db.connect();

module.exports = db;

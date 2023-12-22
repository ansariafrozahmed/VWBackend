const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db.xogjqovzwtmmjsfhofpi.supabase.co",
  database: "postgres",
  password: "ansariafroz",
  port: 5432,
});

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "vintagewatch",
//   password: "ansariafroz",
//   port: 5432,
// });

pool.query("SELECT 1", (err, result) => {
  if (err) {
    console.error("Error executing query:", err);
  } else {
    console.log("Connected to the PostgreSQL server");
  }
});

module.exports = pool;

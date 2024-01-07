const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(cors());
app.listen(4000, () => console.log("SERVER RUNNING ON 4000"));

//SignUp Process API
app.post("/api/signup", async (req, res) => {
  const name = req.body["fullName"];
  const email = req.body["email"];
  const password = req.body["password"];
  //Hashing The Password
  const hashedPassword = await bcrypt.hash(password, 10);
  //Query
  const adduserquery = `INSERT INTO vwuser (name,email,password) VALUES ('${name}','${email}','${hashedPassword}');`;
  //Firing Query
  pool
    .query(adduserquery)
    .then((response) => {
      console.log("DATA ADDED");
      // console.log(response);
      res.status(200).send("Data added successfully");
    })
    .catch((error) => {
      console.log("DATA NOT ADDED");
      console.error(error);

      if (error.code === "ER_DUP_ENTRY") {
        res.status(400).send("Email already exists");
      } else {
        // Generic error response
        res.status(500).send("Internal Server Error");
      }
    });
  // console.log(req.body);
  // res.send("Response Received" + req.body);
});

app.post("/api/signin", async (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];

  // Query to retrieve user by email
  const getUserQuery = `SELECT * FROM vwuser WHERE email = '${email}';`;

  try {
    const userResult = await pool.query(getUserQuery);

    if (userResult.rows.length === 0) {
      res.status(401).send("Invalid email or password");
      return;
    }

    const storedHashedPassword = userResult.rows[0].password;

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!passwordMatch) {
      res.status(401).send("Invalid email or password");
      return;
    }
    // Return user data upon successful login
    const userData = {
      id: userResult.rows[0].id,
      name: userResult.rows[0].name,
      email: userResult.rows[0].email,
      role: userResult.rows[0].role,
    };

    res.status(200).json({ userData });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

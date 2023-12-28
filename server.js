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
        // Duplicate entry error (assuming email is a unique key)
        res.status(400).send("Email already exists");
      } else {
        // Generic error response
        res.status(500).send("Internal Server Error");
      }
    });
  // console.log(req.body);
  // res.send("Response Received" + req.body);
});

// Login Process API
app.post("/api/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const getUserQuery = "SELECT * FROM vwuser WHERE email = $1";
    const user = await pool.query(getUserQuery, [email]);

    if (user.rows.length > 0) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.rows[0].password
      );

      if (isPasswordValid) {
        // Password is valid, send user data (excluding the password) in the response
        const userData = {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
        };
        res.status(200).json(userData);
        res
          .status(200)
          .json({ status: "success", message: "Login successful" });
      } else {
        // Password is invalid
        res.status(401).send("Invalid Password");
      }
    } else {
      // User not found
      res.status(404).send("User Not Found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

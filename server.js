const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

app.use(express.json());
app.use(cors());

app.listen(4000, () => console.log("SERVER RUNNING ON 4000"));

app.post("/api/adduser", (req, res) => {
  const name = req.body["name"];
  const email = req.body["email"];
  const password = req.body["password"];

  // console.log(name);
  // console.log(email);
  // console.log(password);

  const adduserquery = `INSERT INTO vwuser (vw_name,vw_email,vw_password) VALUES ('${name}','${email}','${password}');`;

  pool
    .query(adduserquery)
    .then((response) => {
      console.log("DATA ADDED");
      console.log(response);
    })
    .catch((error) => {
      console.log("DATA NOT ADDED");
      console.log(error);
    });

  console.log(req.body);
  res.send("Response Received" + req.body);
});

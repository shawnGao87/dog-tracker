const express = require("express");
const dogs = require("./dogs");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use("/dogs", dogs);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(5000);

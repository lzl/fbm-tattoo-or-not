const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/", (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(8000);

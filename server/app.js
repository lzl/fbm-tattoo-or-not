const path = require("path");
const fs = require("fs-extra");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/photo", async (req, res) => {
  try {
    const paths = await fs.readdir("./assets/todo");
    const path = paths?.[0];
    if (path) {
      await fs.ensureFile(`./assets/todo/${path}`);
      await fs.move(`./assets/todo/${path}`, `./assets/doing/${path}`);
    }
    res.status(200).json({ ok: true, path });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use("/", (_, res) => {
  res.status(200).json({ ok: true });
});

app.listen(8000, () => console.log("server is up!"));

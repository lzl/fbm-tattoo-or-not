const path = require("path");
const fs = require("fs-extra");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.text());
app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/photo", async (_, res) => {
  try {
    const paths = await fs.readdir("./assets/todo");
    const total = paths?.length;
    const path = paths?.[0];
    if (total !== 0 && path && path !== "undefined") {
      await fs.ensureFile(`./assets/todo/${path}`);
      await fs.move(`./assets/todo/${path}`, `./assets/doing/${path}`);
      res.status(200).json({ ok: true, path, total });
    } else {
      res.status(200).json({ ok: false, message: "已全部标注 🎉" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/photo", async (req, res) => {
  try {
    const {
      body: { path, type },
    } = req;
    await fs.ensureFile(`./assets/doing/${path}`);
    await fs.ensureDir(`./assets/done/${type}`);
    await fs.move(`./assets/doing/${path}`, `./assets/done/${type}/${path}`);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/photo/cancel", async (req, res) => {
  try {
    const {
      body: { path },
    } = req;
    await fs.ensureFile(`./assets/doing/${path}`);
    await fs.move(`./assets/doing/${path}`, `./assets/todo/${path}`);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.use("/", (_, res) => {
  res.status(200).json({ ok: true });
});

app.listen(8000, () => console.log("server is up!"));

import express from "express";
import sql from "./db";
const app = express();
const router = express.Router();

app.use(express.json());

router.post("/example", async (req, res) => {
  const response = await sql("SELECT * FROM users WHERE id = ?", Number(req.body.id) || 9);
  const favorite = response[0];
  return res.json({ favorite });
});

app.use("/api", router);

app.listen(4000);

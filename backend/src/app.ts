import express from "express";
import sql from "./db";

const app = express();
const router = express.Router();

app.use(express.json());

router.post("/example", async (req, res) => {
  console.log("made it 4");
  const response = await sql(
    "SELECT * FROM users WHERE id = ?",
    Number(req.body.id) || 9
  );
  const favorite = response[0];
  return res.json({ favorite });
});

app.use(
  "/api",
  (req, res, next) => {
    console.log("made it 2");
    res.on("finish", () => {
      console.log("made it 3");
      const { method, url } = req;
      const { statusCode } = res;

      console.log(
        JSON.stringify({
          timestamp: Date.now(),
          method,
          url,
          statusCode,
        })
      );
    });
    next();
  },
  router
);

app.listen(4000, () => console.log("made it 1"));

import express, { NextFunction } from "express";
import sql from "./db";
import { getDefaultSettings } from "http2";

const app = express();
const router = express.Router();

app.use(express.json());

let consoleOutput = (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  let dateTime: Date = new Date();
  res.on("finish", () => {
    const { method, url } = req;
    const { statusCode } = res;

    console.log(
      JSON.stringify({
        dateTime,
        method,
        url,
        statusCode,
      })
    );
  });
  next();
};

router.post("/example", async (req, res) => {
  const response = await sql(
    "SELECT * FROM users WHERE id = ?",
    Number(req.body.id) || 9
  );
  const favorite = response[0];
  return res.json({ favorite });
});

app.use("/api", consoleOutput, router);

app.listen(4000);

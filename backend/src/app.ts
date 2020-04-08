import express, { NextFunction } from "express";
import sql from "./db";
import { getDefaultSettings } from "http2";

const app = express();
const router = express.Router();
require("./databaseRoutes")(router);

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

app.use("/api", consoleOutput, router);

app.listen(4000);

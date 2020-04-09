import express, { NextFunction } from "express";
import consoleOutput from "./middleware";

// This creates an express server and router
const app = express();
const router = express.Router();

// This applies the file that handles http requests to router
require("./databaseRoutes")(router);

app.use(express.json());

/*This applys root /api url, and a consoleOuput middleware to the router to display
Date/time (format not important)
HTTP method
Path requested
Status code of response
*/
app.use("/api", consoleOutput, router);

app.listen(4000);

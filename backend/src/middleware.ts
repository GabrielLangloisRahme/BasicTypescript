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
        url: "/api" + url,
        statusCode,
      })
    );
  });
  next();
};

export default consoleOutput;

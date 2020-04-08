import sql from "./db";

module.exports = (router: any) => {
  router.post("/example", async (req, res) => {
    const response = await sql(
      "SELECT * FROM users WHERE id = ?",
      Number(req.body.id) || 9
    );
    const favorite = response[0];
    return res.json({ favorite });
  });
};

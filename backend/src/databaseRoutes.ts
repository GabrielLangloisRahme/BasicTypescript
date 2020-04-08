import sql from "./db";
import express from "express";

module.exports = (router: any) => {
  router.post(
    "/example",
    async (req: express.Request, res: express.Response) => {
      const response = await sql(
        "SELECT * FROM users WHERE id = ?",
        Number(req.body.id) || 9
      );
      const favorite = response[0];
      return res.json({ favorite });
    }
  );

  router.get(
    "/workOrders",
    async (req: express.Request, res: express.Response) => {
      const response = await sql(
        "SELECT * FROM work_orders ORDER BY status DESC"
      );
      const workOrders = response;
      return res.json({ workOrders });
    }
  );

  router.post(
    "/workOrderAssignee",
    async (req: express.Request, res: express.Response) => {
      const response = await sql(
        `SELECT C.name as workOrderName,C.status as workOrderStatus, D.name as userName, D.email as userEmail FROM 
        (select * from work_orders A inner join work_order_assignees B on A.id=B.work_order_id where A.id=?) C inner join users D on  C.user_id=D.id`,
        Number(req.body.id)
      );
      const workOrderAssignee = response;
      return res.json({ workOrderAssignee });
    }
  );

  router.get(
    "/availableUsers",
    async (req: express.Request, res: express.Response) => {
      const response = await sql(` 
      SELECT name from users where name not IN ( 
        SELECT  D.name FROM 
        (select * from work_orders A inner join work_order_assignees B on A.id=B.work_order_id where A.status='OPEN') C inner join users D on  C.user_id=D.id)
        `);
      const users = response;
      return res.json({ users });
    }
  );
};

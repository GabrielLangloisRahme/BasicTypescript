import sql from "./db";
import express from "express";

module.exports = (router: any) => {
  //Relevant Front End url:  http://localhost:3137/workOrders

  //This get request takes all the data from the work_orders table ordered starting with OPEN status to CLOSED

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

  //Relevant Front End url:  http://localhost:3137/workOrderDetail/:id

  /* This selectively takes the Order Name, Order Status, Assignee Name,Assignee Email
from the database to the front end. There are cases where there were no assignees for
a work order, so logic added in a seperate sql statement to capture the work order data
with null Assignee Name, and Assignee Email when needed. A Status Toggle column was added
to facilitate transforming OPEN and CLOSED to a boolean in the front end.*/

  router.post(
    "/workOrderDetail",
    async (req: express.Request, res: express.Response) => {
      let response = await sql(
        `SELECT C.name as orderName,C.status as orderStatus, D.name as assignee, D.email as email,
        CASE WHEN C.status='OPEN' then 1 ELSE 0 End as statusToggle FROM 
        (select * from work_orders A inner join work_order_assignees B on A.id=B.work_order_id where A.id=${Number(
          req.body.id
        )}) C inner join users D on  C.user_id=D.id`
      );
      if (response.length === 0) {
        response = await sql(`SELECT name as orderName, status as orderStatus, null as assignee, null as email,
        CASE WHEN status='OPEN' then 1 ELSE 0 End as statusToggle 
        FROM work_orders where id=${req.body.id}`);
      }

      const workOrderDetail = response;
      return res.json({ workOrderDetail });
    }
  );

  //Relevant Front End url:  http://localhost:3137/workOrderDetail/:id

  /*This toggles the work order by updating work_orders table with a status given by the front end. The front end sent
the apposite of the status within the table for the corresponding work order id. After the table was updated, the work 
order details used at "/workOrderDetail" were used resent so that the front end can have updated work order details */

  router.post(
    "/toggleWorkOrder",
    async (req: express.Request, res: express.Response) => {
      await sql(`UPDATE work_orders SET status='${
        req.body.status
      }' where id=${Number(req.body.id)}
        `);

      let response = await sql(
        `SELECT C.name as orderName,C.status as orderStatus, D.name as assignee, D.email as email,
            CASE WHEN C.status='OPEN' then 1 ELSE 0 End as statusToggle FROM 
            (select * from work_orders A inner join work_order_assignees B on A.id=B.work_order_id where A.id=${Number(
              req.body.id
            )}) C inner join users D on  C.user_id=D.id`
      );

      if (response.length === 0) {
        response = await sql(`SELECT name as orderName, status as orderStatus, null as assignee, null as email,
            CASE WHEN status='OPEN' then 1 ELSE 0 End as statusToggle 
            FROM work_orders where id=${req.body.id}`);
      }

      const workOrderDetail = response;
      return res.json({ workOrderDetail });
    }
  );

  //Relevant Front End url:  http://localhost:3137/productivity, http://localhost:3137/workOrders/new

  /* This provides all available users not in a open work order to the front end. This is used for the productivity page
and also for the create a new work order page because it shows all users that are not in an open work order. */

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

  //Relevant Front End url:  http://localhost:3137/workOrders/new

  /*This takes the worker order name and users selected fron the new work order page and updates
all tables. Logic was used to make sure that the forms were filled. The id of the new work order,
and the id's of the users were taken after updating the work_order table to be able to update
the work_order_assignees table*/

  router.post(
    "/addWorkOrder",
    async (req: express.Request, res: express.Response) => {
      if (req.body.users && req.body.name) {
        let { users } = req.body;
        await sql(`INSERT INTO work_orders (name,status)
            VALUES ('${req.body.name}', 'OPEN')
              `);

        let workOrderId = await sql(`
              SELECT id
              from work_orders
              where name='${req.body.name}' `);

        workOrderId = workOrderId[0].id;

        for (let userIndex in users) {
          let userId = await sql(
            `SELECT id from users where name='${users[userIndex]}' `
          );

          userId = userId[0].id;
          await sql(`INSERT INTO work_order_assignees (work_order_id,user_id)
                    VALUES ('${workOrderId}','${userId}')`);
        }
        return res.json({ success: true });
      } else {
        return res.json({ success: false });
      }
    }
  );
};

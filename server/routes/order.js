import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the orders.
router.get("/", async (req, res) => {
  let collection = await db.collection("orders");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single order by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("orders");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new order.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      drink_name: req.body.drink_name,
      customer_name: req.body.customer_name,
      order_time: req.body.order_time,
      update_info: req.body.update_info,
    };
    let collection = await db.collection("orders");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding order");
  }
});

// This section will help you delete a order
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("orders");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting order");
  }
});

export default router;

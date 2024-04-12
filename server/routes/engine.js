
import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import axios from "axios";
const router = express.Router();
router.use(express.urlencoded({ extended: true })); //support encoded bodies


function findMatchingRule(order, rules) {
    let returnRule = null;
    rules.forEach(rule => {
        if (rule.drink_name == order.drink_name) {
            console.log("Found matching rule!", rule);
            returnRule = rule;
        }
    });
    return returnRule;
}

function findMatchingOrder(rule, orders) {
    let returnOrder = null;
    orders.forEach(order => {
        if (rule.drink_name == order.drink_name) {
            console.log("Found matching order!", order);
            returnOrder = order;
        }
    });
    return returnOrder;
}

/**
 * ORDER RECIEVED
 */
router.post("/orderRecieved", async (req, res) => {
    try {
        let recievedOrder = {
            drink_name: req.body.drink_name,
            customer_name: req.body.customer_name,
            order_time: req.body.order_time,
            update_info: req.body.update_info,
        };

        let rules_collection = db.collection("rules");
        let rules = await rules_collection.find({}).toArray();
        // Search if any rule matches the new Order, return null if no match.
        const foundRule = findMatchingRule(recievedOrder, rules);

        // Found a matching Rule.
        if (foundRule) {
            // Create new matched object.
            let new_matched = {
                rule_id: foundRule._id,
                order_id: req.body._id,
                matched_time: new Date()
            }
            // Insert new Matched Object into archive.
            let matched_collection = db.collection("matched");
            await matched_collection.insertOne(new_matched);

            // CPEE CALLBACK
            axios.put(
                // the URL
                foundRule.cpee_callback,
                {drink_name: recievedOrder.drink_name},
                {
                    headers: {
                        'CPEE-CALLBACK': false
                    }
                }
            )
                .then(() => {
                    console.log("Found matching Rule immediately, CPEE_CALLBACKED");
                })
                .catch((err) => {
                    console.log("Could not cpee call back.");
                    console.error(err);
                });

            // Delete Rule from the Rule Queue.
            const query = { _id: new ObjectId(foundRule._id) };
            let result = await rules_collection.deleteOne(query);

            res.send(result).status(200);
        }
        // Could not find any matching Rule.
        else {
            // Store the recieved Order into Oders Queue
            let orders_collection = db.collection("orders");
            let result = await orders_collection.insertOne(recievedOrder);

            res.send(result).status(200);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error in recieving order.");
    }
});

/**
 * APPLY RULE
 */
router.post("/applyRule", async (req, res) => {
    try {
        let recievedRule = {
            drink_name: req.body.drink_name,
            ingredients: req.body.ingredients,
            end_time: req.body.end_time,
            cpee_callback: req.headers['cpee-callback'],
        };


        // Get the Orders list from database for comparison.
        let orders_collection = db.collection("orders");
        let orders = await orders_collection.find({}).toArray();

        // Search if any Order matches the new Rule, return null if no match.
        const foundOrder = findMatchingOrder(recievedRule, orders);

        // Found a matching Order.
        if (foundOrder) {
            // Create new Matched Object.
            let new_matched = {
                rule_id: "No rule id yet.",
                order_id: foundOrder._id,
                matched_time: new Date()
            }
            // Insert new Matched Object into archive.
            let matched_collection = db.collection("matched");
            await matched_collection.insertOne(new_matched);

            // Delete Order from the Order Queue.
            const query = { _id: new ObjectId(foundOrder._id) };
            let result = await orders_collection.deleteOne(query);

            res.set('CPEE-CALLBACK', false);
            res.send(result).status(200);
        }
        // Could not find any matching Order.
        else {
            // Store the recieved Rule into Rules Queue
            let rules_collection = db.collection("rules");
            let result = await rules_collection.insertOne(recievedRule);

            res.set('CPEE-CALLBACK', true);
            res.send(result).status(200);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error in recieving the rule.");
    }
});

export default router;


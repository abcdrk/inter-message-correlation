import express from "express";
import cors from "cors";
import orders from "./routes/order.js";
import rules from "./routes/rule.js";
import matched from "./routes/matched.js";
import engine from "./routes/engine.js";
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 5858;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/order", orders);
app.use("/rule", rules);
app.use("/matched", matched);
app.use("/engine", engine);

// start the Express server
app.listen(PORT, "::", () => {
  console.log(`Server listening on port ${PORT}`);
});

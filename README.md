# Telegram Orders Correlator
![preview](https://github.com/abcdrk/inter-message-correlation/assets/19238061/981b7ad4-e673-4719-9c4d-56717d943ff8)

## Description
This system correlates orders from the CocktailRobotBPM Telegram Bot ([@bpm_cocktail_bot](https://t.me/bpm_cocktail_bot)) against specified rules. The implementation is supposed to work with the [Cloud Process Execution Engine (CPEE)](https://cpee.org/). There are couple of applications available in the system:

- **Telegram Bot:** Recieve orders as messages and send to the server.
- **Server:** An Express.js application which allows:
  - Create/Delete/List Rules,
  - Create/Delete/List Orders,
  - Create/Delete/List Matched Orders,
  - **Apply a Rule**,
  - **Process a recieved Order**.

Bonus:
- **Client:** A React.js application just to simplify database visualization.
  - Create/Delete/List Rules,
  - Create/Delete/List Orders,
  - Create/Delete/List Matched Orders.
 
## Prerequisites
- Node (18.17.1) (Current version in Lehre server)
- MongoDB Atlas Account (Make sure your IP address is whitelisted in your settings.)
- Express.js
- dotenv
- Telegraf (^4.16.3)

  
## How To Run
1. Create a MongoDB Atlas account and get your connection string (your Atlas URI).
2. Create a Telegram Bot following the [basic tutorial](https://core.telegram.org/bots/tutorial) and copy your token.
3. Clone `git@github.com:abcdrk/inter-message-correlation.git`
4. Create new file under `mern/server/.env` and copy your Atlas URI, Telegram Bot Token and the server port:
```
ATLAS_URI=mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net/
PORT=5858
TELEGRAM_TOKEN=<telegram_token>
```
5. Start server:
```
cd mern/server
npm install
npm start
```
6. Start Telegram Bot
```
cd mern/server
npm install
node bot.js
```

7. Start Web server
```
cd mern/client
npm install
npm run dev
```
## Key Files & Methods
#### `server/routes/engine.js`: 
Contains the very important 2 endpoints of the project: **applyRule** & **orderRecieved** and some additional usefull methods called inside them. 
- **applyRule:** Recieves the entered rule from the CPEE engine, checks wheter any matching order is currently available in the orders queue. If not, it stores the recieved rule and the cpee_callback url into the rules queue. If a matching order is available already, it pops (deletes) the order from the order queue, creates a new matched order object & store it into the database.
- **orderRecieved:** Recives the order entered from the Telegram bot, checks whether any mantching rule is currently available. If not, it stores the recieved order into the orders queue. If a matching rule is available already, it pops (deletes) the order from the order queue, creates a new matched order object & store it into the database, and notifies the cpee engine which is waiting for the async call by using the cpee_callback url.
#### `server/routes/bot.js`: 
Contains the necessary methods to have a functional Telegram Bot which fetches the desired drink name added after a `/order` message. For example: `/order Vodka`. The bot uses the `/engine/orderRecieved` endpoint of the server.

## Correlators


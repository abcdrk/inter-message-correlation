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
- MongoDB Atlas Account **(!!!!Make sure your IP address is whitelisted in your settings!!!!!)**
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
- **applyRule:** Recieves the entered rule from the CPEE engine, checks wheter any matching order is currently available in the orders queue. Matching is done by comparing the `drink_name`. If not, it stores the recieved rule and the cpee_callback url into the rules queue. If a matching order is available already, it pops (deletes) the order from the order queue, creates a new matched order object & store it into the database.
- **orderRecieved:** Recives the order entered from the Telegram bot, checks whether any mantching rule is currently available. Matching is done by comparing the `drink_name`. If not, it stores the recieved order into the orders queue. If a matching rule is available already, it pops (deletes) the order from the order queue, creates a new matched order object & store it into the database, and notifies the cpee engine which is waiting for the async call by using the cpee_callback url.
#### `server/routes/bot.js`: 
Contains the necessary methods to have a functional Telegram Bot which fetches the desired `drink_name` added after a `/order` message. For example: `/order Vodka` will store `Vodka` as the `drink_name`. The bot uses the `/engine/orderRecieved` endpoint of the server.
#### `CPEE Engine Structure`
Example engine: https://cpee.org/flow/?monitor=https://cpee.org/flow/engine/36973/
<img width="1512" alt="cpee-ss" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/df947a0d-8e04-4f66-b056-80a97d1ab7be">

## Correlator Services with Explained Cases
We have 4 possible cases with different services called & different outcomes occur. We can list these as:
- **Case 1:** New rule inserted with no matching order yet.
- **Case 2:** New rule inserted with matching order available in the orders queue.
- **Case 3:** New order recieved with no matching rule yet.
- **Case 4:** New order recieved with matching rule available in the rules queue.

#### Case 1: 
New rule inserted with no matching order yet.

<img width="500" alt="case-1" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/f37268f3-9d91-4bd9-b97e-c632cf54915d">

#### Case 2: 
New rule inserted with matching order available in the orders queue.

<img width="500" alt="case-2" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/c5c9a71c-b1f5-4364-8b90-1a494001fa51">

#### Case 3: 
New order recieved with no matching rule yet.

<img width="500" alt="case-3" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/d5e66dcc-bfb6-4a0c-b8c8-1e30714e193e">

#### Case 4:
New order recieved with matching rule available in the rules queue.

<img width="500" alt="case-4" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/afc21064-c5ab-4587-a6e6-01a3877a4332">

## Example
- Open https://cpee.org/flow/?monitor=https://cpee.org/flow/engine/36973/
- Enter Moscow Mule in the field `drink_name`.
  
  <img width="500" alt="Screenshot 2024-04-13 at 01 11 00" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/a5fa0fc2-5566-4b2e-94bf-7ca6d3eec4b9">
- Start the engine.
  
  <img width="500" alt="Screenshot 2024-04-13 at 01 14 04" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/e220d9bc-9d83-472e-9ded-9c7228d03c0a">
- The rule has no matching orders. It will be added to the rules queue.

  <img width="500" alt="Screenshot 2024-04-12 at 20 07 51" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/635cd219-ef75-4873-91c7-3394b361eee5">
- The engine will have a red color indicating it's waiting an asychronous callback.

  <img width="500" alt="Screenshot 2024-04-12 at 20 07 12" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/97f884e3-bdc3-4684-98f2-563790018455">
- Open CocktailRobotBPM Telegram Bot ([@bpm_cocktail_bot](https://t.me/bpm_cocktail_bot)). Order a Moscow Mule by typing `/order Moscow Mule`.

  <img width="500" alt="Screenshot 2024-04-12 at 20 09 56" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/869140fc-5a6d-46bf-82c6-e1f6a976609e">
- The matched Moscow Mule rule will be found, deleted from the queue and a new Matched Order object will be created in the database.

  <img width="500" alt="Screenshot 2024-04-12 at 20 09 56" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/a42a9d3e-e04a-4179-93ea-bca81b380dbb">
- The CPEE Engine will be notified with the `callback_url` and the engine will be normal again.

  <img width="1512" alt="cpee-ss" src="https://github.com/abcdrk/inter-message-correlation/assets/19238061/042b49b2-f37f-4b59-a862-6fc90799e0cb">

## Endpoints
- `POST` **/engine/applyRule**
  - Request Parameters:
    - `drink_name`: The rules and the orders are matched by this parameter.
    - `ingredients`: (optional) Ingredients of the drink is described.
    - `end_time`: (optional) The expire date of the drink.
  - Request Headers:
    - `cpee-callback`: The callback URL to which engine the notifications should be sent.
  - Response Status:
    - `Status: 200`: Rule recieved & processed successfuly.
    - `Status: 500`: Error in processing the rule.
  - Response Headers:
    - `CPEE-CALLBACK: true`: The rule has no matching order yet. Wait in standby.
    - `CPEE-CALLBACK: false`: An order & rule match has been found.

- `POST` **/engine/orderRecieved**
  - Parameters:
    - `drink_name`: The orders and the rules are matched by this parameter.
    - `customer_name`: The name of the message owner in Telegram.
    - `order_time`: The order date.
    - `update_info`: The callback info of the Telegram chat, if any notifications back wanted to be sent in the future.
  - Response Status:
    - `Status: 200`: Order recieved & processed successfuly.
    - `Status: 500`: Error in processing the order.
- `GET` **/rule**
- `GET` **/rule:id>**
- `POST` **/rule**
- `DELETE` **/rule:id**
- `GET` **/order**
- `GET` **/order:id>**
- `POST` **/order**
- `DELETE` **/order:id**
- `GET` **/matched**
- `GET` **/matched:id>**
- `POST` **/matched**
- `DELETE` **/matched:id**
  
## Bonus
- Postman config file: https://github.com/abcdrk/inter-message-correlation/blob/main/Cocktailbot.postman_collection.json
- There's also a React Web Application provided (https://github.com/abcdrk/inter-message-correlation/tree/main/client) for better visualization of rules queue, orders queue and the matched orders queue.

## Further Implementations
- A time comparaotr could be added.
- A telegram notification message when the process is completed.



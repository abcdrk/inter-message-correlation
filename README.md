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
- MongoDB Atlas Account
- Express.js
- dotenv
- Telegraf (^4.16.3)

  
## How To Run
Create the file `mern/server/.env` with your Atlas URI and the server port:
```
ATLAS_URI=mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net/
PORT=5858
```

Start server:
```
cd mern/server
npm install
npm start
```

Start Telegram Bot
```
cd mern/server
npm install
node bot.js
```

Start Web server
```
cd mern/client
npm install
npm run dev
```

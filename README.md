Backend
npm i
create .env file
Start redis server "redis-server"
npm run start


ENV File Content
MONGO_URL=mongodb+srv://dbuser:inGoditrust1@cluster0.pw7dx.mongodb.net/db-base?retryWrites=true&w=majority
PORT = 8800

Inside Client
npm i
Set Callback URL in AUTH0 to http://localhost:3000/
npm run start

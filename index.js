import express from "express";
import dotenv from 'dotenv';
import session from "express-session";
import connectMongoDBSession from 'connect-mongodb-session';
import errorHandler from "./utils/errorHanler.utils.js";
import { dbConnection } from "./database/dbConnection.js";
import userRouter from './src/modules/user.routes.js'
const MongoDBStore = connectMongoDBSession(session);

dotenv.config();
dbConnection()

const app = express()
const port = process.env.PORT || 3000



app.use(express.static('public', { extensions: ['js', 'css'] })); 
app.use(express.urlencoded({ extended: true }))

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'mySessions'
});

store.on('error', function(error) {
    console.log(error);
  });
app.use(session({
    secret: 'keyboard cat',
    store: store,
    resave: false,
    saveUninitialized: false,
}))

app.use(userRouter)


app.all('*', (req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.originalUrl}`)
    error.statusCode = 404
    next(error)
})

app.use(errorHandler)

app.listen(port, () => console.log(`listening on port ${port}...`))

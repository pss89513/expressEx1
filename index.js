import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import todoRoute from './routes/todos';

const env = process.env.NODE_ENV || 'dev';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mongoose.connection;
db.on('error', console.error);
db.once('openUri', function(){
    console.log("Connected to mongodb");
});
mongoose.Promise = Promise;

if(env === 'dev') {
    mongoose.connect('mongodb://localhost/todo_db', { useMongoClient: true });
} else if (env === 'test') {
    mongoose.connect('mongodb://localhost/todo_db_test', { useMongoClient: true });
}


app.get('/', (req, res) => {
    res.send('hello World');
});

app.use('/', todoRoute);

app.listen(3000);

export default app;
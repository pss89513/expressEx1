import express from 'express';
import Todo from '../models/todo';

const todoRoute = express.Router();

todoRoute.get('/todos', (req, res) => {

    // Todo.find(undefined, { _id: 1, todo: 1, isDone: 1 }, (err, todos) => {
    //     if (err) {
    //         return res.status(500).send({ err: 'db error' });
    //     }
    //     res.send(todos);
    // });    

    Todo.find({ __v: false })
        .then(todos => {
            return res.send(todos);
        })
        .catch(err => {
            res.status(500).send( {err: 'db err'} );
        });
});

todoRoute.get('/todo/:id', (req, res) => {
    Todo.findById(req.params.id, {__v: false} ,(err, todo) => {
        if(err) {
            return res.status(500).send({ err: 'db error' });
        }
        res.send(todo);
    });
});

export default todoRoute;
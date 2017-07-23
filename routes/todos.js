import express from 'express';
import Todo from '../models/todo';

const todoRoute = express.Router();

todoRoute.get('/todos', (req, res) => {

    Todo.find({ __v: false })
        .then(todos => {
            res.send(todos);
        })
        .catch(err => {
            res.status(500).send({ err: 'db err' });
        });
});

todoRoute.get('/todo/:id', (req, res) => {

    Todo.findById(req.params.id, { __v: false })
        .then(todo => {
            res.send(todo);
        })
        .catch(err => {
            res.status(500).send({ err: 'db error' });
        });

});

todoRoute.post('/add', (req, res) => {
    let todo = new Todo();
    todo.todo = req.body.todo;
    todo.save()
        .then(() => {
            res.status(200).send({ result: true });
        })
        .catch(err => {
            res.status(500).send({ result: false });
        });
});

todoRoute.put('/check/:id', (req, res) => {
    Todo.findById(req.params.id).exec()
        .then(todo => {
            if (todo) {
                todo.isDone = !todo.isDone;
                return todo.save();
            }
        })
        .then(todo => {
            if (!todo) {
                res.status(404).send({ result: false });
            }
            else {
                res.status(200).send({ result: true });
            }
        })
        .catch(err => {
            res.status(500).send({ result: false });
        });
});

todoRoute.delete('/remove/:id', (req, res) => {
    Todo.findByIdAndRemove(req.params.id)
        .then((todo) => {
            if (!todo) {
                res.status(404).send({ result: false });
            } else {
                res.status(200).send({ result: true });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ result: false });
        });
});

export default todoRoute;
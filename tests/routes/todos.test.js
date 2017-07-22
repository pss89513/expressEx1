import request from 'supertest';
import { expect } from 'chai';
import mongooose from 'mongoose';

import app from '../../index';
import Todo from '../../models/todo';
const todos = [
    {
        _id: new mongooose.Types.ObjectId(),
        todo: "밥 먹기"
    },
    {
        _id: new mongooose.Types.ObjectId(),
        todo: "휴가 계획 만들기"
    }
];
beforeEach((done) => {
    Todo.insertMany(todos)
        .then(() => done())
        .catch(err => done(err));
});

afterEach((done) => {
    Todo.remove()
        .then(() => done())
        .catch(err => done(err));
});

describe('GET /todos', () => {

    it('"todo list를 확인합시다.', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                console.log(res.body);
                expect(res.body.length).to.equal(2);
                done();
            });
    });

});

describe('GET /todos/:id', () => {

    it('id값을 통해 todo를 찾습니다.', (done) => {
        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .expect(200)
            .end((err, res) => {
                if(err)
                    done(err);
                console.log(res.body);
                expect(res.body.todo).equal(todos[0].todo);
                done();
            });
    });
});
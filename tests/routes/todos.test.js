import request from 'supertest';
import { expect } from 'chai';
import mongooose from 'mongoose';

import app from '../../index';
import Todo from '../../models/todo';
const todos = [
    {
        _id: new mongooose.Types.ObjectId(),
        todo: "밥 먹기",
        isDone: false
    },
    {
        _id: new mongooose.Types.ObjectId(),
        todo: "휴가 계획 만들기",
        isDone: false
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
                expect(res.body.todo).equal(todos[0].todo);
                done();
            });
    });
});

describe('POST /add', () => {

    it('새로운 todo를 입력하기', (done) => {
        const newTodo = "양파즙 먹기";
        request(app)
            .post('/add')
            .send({
                todo: newTodo
            })
            .expect(200)
            .end((err, res) => {
                if(err)
                    done(err);
                expect(res.body.result).equal(true);

                Todo.findOne({todo:newTodo})
                    .then(todo => {
                        expect(todo.todo).to.equals(newTodo);                        
                    })
                    .catch(err => {
                        done(err);
                    })

                done();
            });
    });
});

describe('PUT /check/:id', () => {
    it('todo 완료 체크 테스트', (done) => {
        request(app)
            .put(`/check/${todos[0]._id.toHexString()}`)
            .expect(200)
            .end((err, res) =>{
                expect(res.body.result).equal(true);
                Todo.findById(todos[0]._id.toHexString())
                    .then(todo => {
                        expect(todo.isDone).equal(!todos[0].isDone);
                    })
                    .catch(err => {
                        done(err);
                    })
                done();
            });
    });
    
    it('todo 완료 체크 시 없는 id를 조회할 경우 404 리턴', (done) => {
        const tmpId = new mongooose.Types.ObjectId();
        request(app)
            .put(`/check/${tmpId}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /remove/:id', () => {
    it('todo 삭제 테스트', (done) => {
        request(app)
            .delete(`/remove/${todos[0]._id.toHexString()}`)
            .expect(200)
            .end((err, res) => {
                Todo.findById(todos[0]._id.toHexString())
                    .then(todo => {
                        expect(todo).to.be.null;
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            });
    });
    
    it('todo 삭제 시 없는 id를 조회할 경우 404 리턴', (done) => {
        const tmpId = new mongooose.Types.ObjectId();
        request(app)
            .delete(`/remove/${tmpId}`)
            .expect(404)
            .end(done);
    })
});
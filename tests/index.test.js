import request from 'supertest';
import { expect } from 'chai';

import app from '../index';

describe('GET /', () => {
    it('"hello World"가 출력되도록 합시다.', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if(err) {
                    done(err);
                    return;
                }

                expect(res.text).to.equal('hello World');
                done();
            });
    });
});
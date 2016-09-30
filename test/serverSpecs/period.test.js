var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;
require('../../config/environment/development');

describe('Period Specs', function () {
    'use strict';

    describe('Period with admin', function () {

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'superAdmin',
                    pass : '111111',
                    dbId : 'vasyadb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should get Period for Dd', function (done) {

            aggent
                .get('period')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    done();
                });
        });

    });

    describe('Period with no authorise', function () {

        it('should fail get Period for Dd', function (done) {

            aggent
                .get('period')
                .expect(404, done);
        });

    });
});


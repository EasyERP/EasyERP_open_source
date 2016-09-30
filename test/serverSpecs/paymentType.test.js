var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('PaymentType Specs', function () {
    'use strict';

    describe('PaymentType with admin', function () {

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

        it('should get PaymentType for Dd', function (done) {

            aggent
                .get('paymentType')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

    });

    describe('PaymentType with no authorise', function () {

        it('should fail get PaymentType for Dd', function (done) {

            aggent
                .get('paymentType')
                .expect(404, done);
        });

    });
});


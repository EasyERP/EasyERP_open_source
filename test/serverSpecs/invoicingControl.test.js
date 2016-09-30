var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('InvoicingControl Specs', function () {
    'use strict';

    describe('InvoicingControl with admin', function () {

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

        it('should get InvoicingControl for Dd', function (done) {

            aggent
                .get('invoicingControl')
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

    describe('InvoicingControl with no authorise', function () {

        it('should fail get InvoicingControl for Dd', function (done) {

            aggent
                .get('invoicingControl')
                .expect(404, done);
        });

    });

});

require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var CONSTANTS = require('../../constants/constantsTest');
var aggent;

describe("Journal Specs", function () {
    'use strict';

    describe('Journal with admin', function () {
        var id;

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass : 'tm2016',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should create Journal", function (done) {
            var body = {
                "creditAccount": CONSTANTS.CREDITACCOUNT,
                "debitAccount" : CONSTANTS.DEBITACCOUNT,
                "name"         : "testJournal",
                "transaction"  : "Payment"
            };

            aggent
                .post('journal')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('_id');

                    id = body._id;

                    done();
                });
        });

        it("should get journal with options", function (done) {
            /*var query = {
                sort : {
                    account: -1
                }
            };*/

            aggent
                .get('journal/list')
                //.query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array);
                    expect(body.length)
                        .to.be.gte(1);

                    done();
                });
        });

        it("should get journal for Dd", function (done) {
            var query = {
                '_id' : id
            };

            aggent
                .get('journal/getForDd')
                .query(query)
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
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]')
                        .and.to.have.property('_id', id);

                    done();
                });
        });

        it("should delete journal", function (done) {
            aggent
                .delete('journal/' + id)
                .expect(200, done);
        });

    });

    describe('Journal with no authorise', function () {

        it("should fail get Journal for Dd", function (done) {

            aggent
                .get('journal/getForDd')
                .expect(500, done);
        });

    });

});


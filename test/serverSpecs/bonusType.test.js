var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;
var dbId = 'vasyadb';
var admin = {
    login: 'superAdmin',
    pass : '111111',
    dbId : dbId
};

var bannedUser = {
    login: 'ArturMyhalko',
    pass : 'thinkmobiles2015',
    dbId : dbId
};

require('../../config/environment/development');

describe('BonusType Specs', function () {
    'use strict';

    describe('BonusType with admin', function () {
        var id;

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send(admin)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create BonusType', function (done) {
            var body = {
                isPercent: true,
                value    : 10,
                name     : 'Test Bonus',
                bonusType: 'Sales'
            };

            aggent
                .post('bonusType')
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('success')
                        .and.to.have.property('_id');

                    id = body.success._id;

                    done();
                });
        });

        it('should patch BonusType', function (done) {
            var body = [{
                _id      : id,
                name     : 'Test Bonus Patched',
                value    : '11',
                isPercent: false,
                bonusType: 'PM'
            }];

            aggent
                .patch('bonusType')
                .send(body)
                .expect(200, done);
        });

        it('should fail patch BonusType', function (done) {
            var body = [{
                _id: '123cba'
            }];

            aggent
                .patch('bonusType')
                .send(body)
                .expect(500, done);

        });

        it('should get BonusType with options', function (done) {
            var query = {
                sort: {
                    value: -1
                },

                viewType: 'list'
            };

            aggent
                .get('bonusType/')
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
                        .to.have.property('total');
                    expect(body.data.length)
                        .to.be.lte(100);
                    if (body.data.length > 1) { // test sorting
                        expect(body.data[0].value)
                            .to.be.gte(body.data[1].value);
                    }

                    done();
                });
        });

        /* it('should get BonusType length', function (done) {
 
             aggent
                 .get('bonusType/list/totalCollectionLength')
                 .expect(200)
                 .end(function (err, res) {
                     var body = res.body;
 
                     if (err) {
                         return done(err);
                     }
 
                     expect(body)
                         .to.be.instanceOf(Object);
                     expect(body)
                         .to.have.property('count')
                         .and.to.be.gte(1);
 
                     done();
                 });
         });*/

        it('should get BonusType for DD', function (done) {

            aggent
                .get('bonusType/getForDD')
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
                        .and.to.have.deep.property('[0]');

                    done();
                });
        });

        it('should delete BonusType', function (done) {
            aggent
                .delete('bonusType/' + id)
                .expect(200, done);
        });

        it('should fail delete BonusType', function (done) {
            aggent
                .delete('bonusType/123cba')
                .expect(500, done);
        });

    });

    describe('BonusType with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send(bannedUser)
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create BonusType', function (done) {

            var body = {
                isPercent: true,
                value    : 10,
                name     : 'Test Bonus',
                bonusType: 'Sales'
            };

            aggent
                .post('bonusType')
                .send(body)
                .expect(403, done);
        });
    });

    describe('BonusType with no authorise', function () {

        it('should fail get BonusType for Dd', function (done) {

            aggent
                .get('bonusType/getForDD')
                .expect(404, done);
        });

    });

});


var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('Holidays Specs', function () {
    'use strict';

    describe('Holidays with admin', function () {
        var id;

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

        it('should create holiday', function (done) {
            var body = {
                comment: 'New Year',
                date   : 'Jan 1 2016 00:00:00 GMT+0200',
                year   : 2016,
                week   : 53
            };

            aggent
                .post('holiday')
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
                    expect(body.success)
                        .to.have.property('date');
                    expect(Date.parse(body.success.date))
                        .to.be.equal(Date.parse('Jan 1 2016 00:00:00 GMT+0200'));

                    id = body.success._id;

                    done();
                });
        });

        it('should fail create holiday', function (done) {
            var body = '';

            aggent
                .post('holiday')
                .send(body)
                .expect(500, done);
        });

        it('should patch Holidays', function (done) {
            var body = [{
                _id    : id,
                comment: 'New Year 2016',
                date   : '9 Jan, 2016',
                week   : 1,
                year   : 2016
            }];

            aggent
                .patch('holiday')
                .send(body)
                .expect(200, done);

        });

        it('should fail patch Holidays', function (done) {
            var body = [{
                _id: '123cba'
            }];

            aggent
                .patch('holiday')
                .send(body)
                .expect(500, done);
        });

        it('should patch holiday', function (done) {
            var body = {
                comment: 'New Year 2016 2',
                date   : '10 Jan, 2016',
                week   : 1,
                year   : 2016
            };

            aggent
                .patch('holiday/' + id)
                .send(body)
                .expect(200, done);

        });

        it('should fail patch holiday', function (done) {
            var body = {};

            aggent
                .patch('holiday/123cba')
                .send(body)
                .expect(500, done);

        });

        it('should get Holidays with options', function (done) {
            var query = {
                sort: {
                    date: -1
                },

                page    : 1,
                count   : 100,
                viewType: 'list'
            };

            aggent
                .get('holiday/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var result;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body)
                        .to.have.property('total');

                    /* result = body.success;

                     expect(result.length)
                     .to.be.lte(100);
                     if (result.length > 1) {  // test sorting
                     expect(result[0].date)
                     .to.be.gte(result[1].date);
                     }*/

                    done();
                });
        });

        it('should delete Holiday', function (done) {
            aggent
                .delete('holiday/' + id)
                .expect(200, done);
        });

        it('should fail delete Holiday', function (done) {
            aggent
                .delete('holiday/123cba')
                .expect(500, done);
        });
    });

    describe('Holidays with user without a license', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass : 'thinkmobiles2015',
                    dbId : 'vasyadb'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should fail create Holidays', function (done) {

            var body = {
                comment: 'New Year',
                date   : 'Jan 1 2016 00:00:00 GMT+0200',
                year   : 2016,
                week   : 53
            };

            aggent
                .post('holiday')
                .send(body)
                .expect(403, done);
        });
    });

    describe('Holidays with no authorise', function () {

        it('should fail get Holidays', function (done) {

            aggent
                .get('holiday/')
                .expect(404, done);
        });

    });

});


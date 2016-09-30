var request = require('supertest');
var expect = require('chai').expect;
var moment = require('../../public/js/libs/moment/moment');
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('Dashboard Vacation Specs', function () {
    'use strict';

    describe('With admin user', function () {

        var startTime;
        var endTime;

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

        it('should return HRdashboard', function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/hr')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var dateStart = moment().subtract(12, 'month').startOf('month');
                    var hiredEmployees;
                    var firedEmployees;
                    var dateStartHired;
                    var dateStartFired;
                    var i;
                    var j;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array)
                        .and.to.have.deep.property('0')
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('0')
                        .and.to.have.property('hiredEmployees');

                    expect(body)
                        .to.be.instanceOf(Array)
                        .and.to.have.deep.property('1')
                        .and.to.have.property('data')
                        .and.to.be.instanceOf(Array)
                        .and.to.have.deep.property('0')
                        .and.to.have.property('firedEmployees');

                    for (i = 0; i <= 12; i++) {

                        if (body[0].data[i].hiredEmployees.length) {
                            hiredEmployees = body[0].data[i].hiredEmployees;
                            break;
                        }
                    }
                    for (j = 0; j <= 12; j++) {
                        if (body[1].data[j].firedEmployees.length) {
                            firedEmployees = body[1].data[j].firedEmployees;
                            break;
                        }
                    }

                    if (hiredEmployees) {
                        expect(hiredEmployees[0])
                            .to.be.instanceOf(Object)
                            .and.to.have.property('hireDate')
                        expect(hiredEmployees[0])
                            .to.have.property('department')
                            .and.to.be.instanceOf(Object)
                            .and.to.have.property('name');
                    }
                    if (firedEmployees) {
                        expect(firedEmployees[0])
                            .to.be.instanceOf(Object)
                            .and.to.have.property('fireDate')
                        expect(firedEmployees[0])
                            .to.have.property('department')
                            .and.to.be.instanceOf(Object)
                            .and.to.have.property('name');
                    }


                    done();
                });
        });

        after(function (done) {
            aggent = request.agent(url);
            aggent
                .get('logout')
                .send()
                .expect(302, done);
        });

    });

    describe('With baned user', function () {

        var startTime;

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

        it('should fail return dashboard using startDate == now', function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/hr')
                .expect(403, done);
        });

        after(function (done) {
            aggent = request.agent(url);
            aggent
                .get('logout')
                .send()
                .expect(302, done);
        });

    });

});

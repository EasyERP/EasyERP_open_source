var request = require('supertest');
var expect = require('chai').expect;
var moment = require('../../public/js/libs/moment/moment');
var url = 'http://localhost:8089/';
var CONSTANTS = require('../../constants/mainConstants');
var aggent;


describe("Dashboard Vacation Specs", function () {
    'use strict';

    describe("With admin user", function () {

        var startTime;
        var endTime;

        before(function (done) {

            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass: 'tm2016',
                    dbId: 'production'
                })
                .expect(200, done);
        });

        it("should return HRdashboard", function (done) {

            startTime = new Date();

            aggent
                .get('dashboard/hr')
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    var body = res.body;
                    var dateStart = moment().subtract(11, 'month').startOf('month');
                    var hiredEmployees;
                    var firedEmployees;
                    var dateStartHired;
                    var dateStartFired;

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

                    for (var i = 0; i <= 11; i++) {
                        if (body[0].data[i].hiredEmployees.length) {
                            hiredEmployees = body[0].data[i].hiredEmployees;
                            dateStartHired = dateStart.add(i, 'month');
                            break;
                        }
                    }
                    for (var j = 0; j <= 11; j++) {
                        if (body[1].data[j].firedEmployees.length) {
                            firedEmployees = body[1].data[j].firedEmployees;
                            dateStartFired = dateStart.add(j, 'month');
                            break;
                        }
                    }

                    if (hiredEmployees) {
                        expect(hiredEmployees[0])
                            .to.be.instanceOf(Object)
                            .and.to.have.property('hireDate')
                            .and.to.be.gte(dateStartHired.month() + 1 + dateStartHired.year() * 100);
                        expect(hiredEmployees[0])
                            .to.have.property('department')
                            .and.to.be.instanceOf(Object)
                            .and.to.have.property('departmentName');
                    }
                    if (firedEmployees) {
                        expect(firedEmployees[0])
                            .to.be.instanceOf(Object)
                            .and.to.have.property('fireDate')
                            .and.to.be.lte(dateStartFired.month() + 1 + dateStartFired.year() * 100);
                        expect(firedEmployees[0])
                            .to.have.property('department')
                            .and.to.be.instanceOf(Object)
                            .and.to.have.property('departmentName');
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

    describe("With baned user", function () {

        var startTime;

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send({
                    login: 'ArturMyhalko',
                    pass: 'thinkmobiles2015',
                    dbId: 'production'
                })
                .expect(200, done);
        });

        it("should fail return dashboard using startDate == now", function (done) {

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
/**
 * Created by liliy on 29.01.2016.
 */
require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;

describe("Person Specs", function () {
    'use strict';
    var id;

    describe('Person with admin', function(){

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'admin',
                    pass : '1q2w3eQWE',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function(done){
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should create person", function (done) {
            var body = {
                "name"       : {
                    "first": "test",
                    "last" : "test"
                }
            };

            aggent
                .post('persons')
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
                        .to.have.property('success');
                    expect(body)
                        .to.have.property('id');

                    id = body.id;

                    done();
                });
        });

        it("should get by _id person", function (done) {
            aggent
                .get('persons/form')
                .query({id: '55b92ad521e4b7c40f00060f'})
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('_id');

                    done();
                });
        });

        it("should get persons for viewType", function (done) {
            aggent
                .get('persons/thumbnails')
                .query({contentType: 'Persons'})
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }
                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body.data)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it("should get persons first letters", function (done) {
            aggent
                .get('persons/getPersonAlphabet')
                .query({contentType: 'Persons'})
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }
                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body.data)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it("should get persons for miniView", function (done) {
            aggent
                .get('persons/getPersonsForMiniView')
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    expect(body.data)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it("should get count of persons for miniView", function (done) {
            aggent
                .get('persons/getPersonsForMiniView')
                .query({'onlyCount': true})
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('listLength');

                    done();
                });
        });

        it("should get totalCollectionLength of persons", function (done) {
            aggent
                .get('persons/totalCollectionLength')
                .query({contentType: 'Persons'})
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('showMore');
                    expect(body)
                        .to.have.property('count');

                    done();
                });
        });

        it("should updateOnlySelectedFields of persons", function (done) {
            aggent
                .patch('persons/55b92ad521e4b7c40f00060f')
                .send({'name.last': 'Persons'})
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('success');
                    expect(body)
                        .to.have.property('notes');

                    done();
                });
        });

        it("should update", function (done) {
            var body = {
                address: {country: "Singapore", zip: "", state: "", city: "", street: ""},
                attachments: [],
                color: "#4d5a75",
                company: null,
                companyInfo: {size: null, industry: null},
                contacts: [],
                createdBy: {date: "1970-01-01T00:00:00.000Z", user: null},
                dateBirth: "",
                department: null,
                editedBy: {date: "2016-01-29T14:45:54.455Z", user: "52203e707d4dba8813000003"},
                email: "",
                fullName: "Sharmila Persons ssss",
                groups: {group: [], users: [], owner: "560c099da5d4a2e20ba5068b"},
                history: [],
                id: "55b92ad521e4b7c40f00060f",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                internalNotes: "",
                isOwn: false,
                jobPosition: null,
                name: {last: "Persons ssss", first: "Sharmila"},
                notes: [],
                phones: {fax: "", mobile: "", phone: ""},
                relatedUser: null,
                salesPurchases: {receiveMessages: 0, language: "English", reference: "", active: false, implementedBy: null},
                skype: "aaaaa",
                social: {LI: "", FB: ""},
                timezone: "UTC",
                title: "",
                type: "Person",
                website: "",
                whoCanRW: "everyOne"
            };
            aggent
                .put('persons/55b92ad521e4b7c40f00060f')
                .send(body)
                .expect(200)
                .end(function(err, res){
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('_id');

                    done();
                });
        });


        it("should delete person", function (done) {
            aggent
                .delete('persons/' + id)
                .expect(200, done);
        });

        it("should not delete person", function (done) {
            aggent
                .delete('persons/' + 'kkk')
                .expect(500, done);
        });
    });

    describe('Person with user without a license', function(){

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'testUser',
                    pass : 'qwerty',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function(done){
            aggent
                .get('logout')
                .expect(302, done);
        });

        it("should fail create person", function (done) {
            var body = {
                "name"       : {
                    "first": "test",
                    "last" : "test"
                }
            };

            aggent
                .post('persons')
                .send(body)
                .expect(403, done);
        });
    });

});
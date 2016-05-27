require('../../config/development');

var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var host = process.env.HOST;
var aggent;
var dbId = 'dendb';
var admin = {
    login: 'admin',
    pass : 'tm2016',
    dbId : dbId
};
var bannedUser = {
    login: 'ArturMyhalko',
    pass : 'thinkmobiles2015',
    dbId : dbId
};

describe('Leads Specs', function () {
    'use strict';
    var id;

    describe('Leads with admin', function () {

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

        it('should create lead', function (done) {
            var body = {
                name: 'Subject'
            };

            aggent
                .post('leads')
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

                    id = body.id;

                    done();
                });
        });

        it('should fail create Lead', function (done) {
            var body = {};

            aggent
                .post('leads')
                .send(body)
                .expect(404, done);
        });

        it('should get Leads totalCollectionLength', function (done) {
            aggent
                .get('leads/totalCollectionLength')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('count');
                    expect(body)
                        .to.have.property('showMore');
                    done();
                });
        });

        it('should get Lead For Chart', function (done) {
            aggent
                .get('leads/getLeadsForChart')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data');
                    done();
                });
        });

        it('should get Leads for viewType list', function (done) {

            var query = {
                viewType     : 'list',
                contentType  : 'Leads',
                page         : 1,
                count        : 100,
                newCollection: false
            };

            aggent
                .get('leads/list')
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
                        .to.have.property('data');
                    expect(body.data)
                        .to.be.instanceOf(Array);

                    done();
                });
        });

        it('should get Lead for viewType form', function (done) {
            var query = {
                id: id
            };

            aggent
                .get('leads/form')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('_id');

                    done();
                });
        });

        //it('should get Lead for viewType kanban', function (done) {
        //
        //    var query = {
        //        workflowId: '528ce5e3f3f67bc40b000018'
        //    };
        //
        //    aggent
        //        .get('leads/kanban')
        //        .query(query)
        //        .expect(200)
        //        .end(function (err, res) {
        //            var body = res.body;
        //
        //            if (err) {
        //                return done(err);
        //            }
        //
        //            expect(body)
        //                .to.be.instanceOf(Object);
        //            expect(body)
        //                .to.have.property('data');
        //            expect(body)
        //                .to.have.property('workflowId');
        //            done();
        //        });
        //});

        it('should partially update Lead', function (done) {
            var body = {
                name: 'test'
            };
            aggent
                .patch('leads/' + id)
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
                        .to.have.property('success');
                    expect(body)
                        .to.have.property('result');

                    done();
                });
        });

        it('should Lead update', function (done) {
            var body = {
                _id: id
            };
            aggent
                .put('leads/' + id)
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
                        .to.have.property('success');
                    expect(body)
                        .to.have.property('result');

                    done();
                });
        });

        it('should remove Lead', function (done) {
            aggent
                .delete('leads/' + id)
                .expect(200, done);
        });

    });

    describe('Leads with user without a license', function () {

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

        it('should fail create Leads', function (done) {
            var body = {
                name: 'Subject'
            };

            aggent
                .post('leads')
                .send(body)
                .expect(403, done);
        });
    });
});

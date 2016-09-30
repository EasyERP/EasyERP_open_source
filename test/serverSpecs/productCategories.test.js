var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('ProductCategories Specs', function () {
    'use strict';

    describe('ProductCategories with admin', function () {
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

        it('should create productCategory', function (done) {
            var body = {
                fullName    : 'All/Test',
                name        : 'Test',
                nestingLevel: null,
                parent      : '564591f9624e48551dfe3b23',
                sequence    : 0
            };

            aggent
                .post('category')
                .send(body)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var parentId;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('_id');

                    id = body._id;
                    parentId = body.parent;

                    aggent
                        .get('category/' + parentId)
                        .expect(200)
                        .end(function (err, res) {
                            var body;

                            if (err) {
                                return done(err);
                            }

                            body = res.body;

                            expect(body.child)
                                .to.be.instanceOf(Array)
                                .to.include(id);

                            done();
                        });
                });
        });

        it('should fail create productCategory', function (done) {
            var body = '';

            aggent
                .post('category')
                .send(body)
                .expect(400, done);
        });

        it('should update productCategory', function (done) {
            var body = {
                fullName    : 'All/Testing',
                name        : 'Testing',
                nestingLevel: null,
                parent      : '564591f9624e48551dfe3b23',
                sequence    : 0
            };

            aggent
                .put('category/' + id)
                .send(body)
                .expect(200, done);
        });

        /*it('should update productCategory with checking to change of parent', function (done) {
         var body = {
         fullName    : 'All/Testing',
         name        : 'Testing',
         nestingLevel: null,
         parent      : '564591f9624e48551dfe3b23',
         sequence    : 0
         };

         aggent.get('category/' + id).expect(200).end(function (err, res) {
         var data;
         var nameFirst;

         if (err) {
         return done(err);
         }

         data = res.body;
         nameFirst = data.name;

         aggent
         .put('category/' + id)
         .send(body)
         .expect(200)
         .end(function (error, resp) {
         var body;
         var nameSecond;

         if (error) {
         return done(error);
         }

         body = resp.body;

         nameSecond = body.name;

         expect(nameFirst)
         .to.eql(nameSecond);

         done();
         });
         });
         /!*
         aggent
         .put('category/' + id)
         .send(body)
         .expect(200, done);
         *!/
         });*/

        it('should get productCategories Expenses', function (done) {

            aggent
                .get('category/getExpenses')
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

        it('should get productCategory by id', function (done) {

            aggent
                .get('category/')
                .query({id: id})
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);

                    done();
                });
        });

        it('should fail get productCategory by id', function (done) {

            aggent
                .get('category')
                .query({id: '123'})
                .expect(400, done);
        });

        it('should get productCategories for Dd', function (done) {

            aggent
                .get('category')
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
                        .to.be.instanceOf(Array)
                        .and.to.have.deep.property('[0]');

                    done();
                });
        });

        it('should delete productCategory', function (done) {
            aggent
                .delete('category/' + id)
                .expect(200)
                .end(function (err, res) {
                    var id;
                    var parentId;
                    var body;

                    if (err) {
                        return done(err);
                    }

                    body = res.body;
                    id = body._id;
                    parentId = body.parent;

                    aggent
                        .get('category/' + parentId)
                        .expect(200)
                        .end(function (err, res) {
                            var body;

                            if (err) {
                                return done(err);
                            }

                            body = res.body;

                            expect(body.child)
                                .to.be.instanceOf(Array)
                                .to.not.include(id);

                            done();
                        });
                });
        });

        it('should fail delete productCategory', function (done) {
            aggent
                .delete('category/123cba')
                .expect(500, done);
        });

    });

    describe('productCategories with user without a license', function () { // doesn't work
        this.timeout(10000);

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

        it('should fail create productCategory', function (done) {

            var body = {
                fullName    : 'All/Test',
                name        : 'Test',
                parent      : '57e3c880d1caf534320f415b',
                nestingLevel: 1,
                sequence    : 0
            };

            aggent
                .post('category')
                .send(body)
                .expect(403, done);

        });
    });

    describe('productCategories with no authorise', function () {

        it('should fail get productCategories for Dd', function (done) {

            aggent
                .get('category')
                .expect(404, done);
        });

    });

});


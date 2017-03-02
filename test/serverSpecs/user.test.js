var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;
var dbId = 'production';
var admin = {
    login: 'test',
    pass : '1234567890',
    dbId : dbId
};
var bannedUser = {
    login: 'ArturMyhalko',
    pass : 'thinkmobiles2015',
    dbId : dbId
};

describe('User Specs', function () {
    'use strict';
    this.timeout(10000);

    describe('Create User block', function () {
        var id;
        var idCur;

        before(function (done) {
            aggent = request.agent(url);
            aggent
                .post('users/login')
                .send(admin)
                .expect(200, done);
        });

        it('should create user', function (done) {
            var body = {
                login  : 'super.duper',
                pass   : 'superpass',
                email  : 'super.user@valid.com',
                profile: 123456789
            };

            aggent
                .post('users')
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
                        .to.have.property('id');

                    id = body.id;

                    done();
                });
        });

        it('should fail create user', function (done) {
            var body = {
                login  : 'super.duper',
                pass   : 'superpass',
                profile: 123456789
            };

            aggent
                .post('users')
                .send(body)
                .expect(404, done);
        });

        it('should return all users with provided profile', function (done) {
            aggent
                .get('users/profiles/1387275598000')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body).to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('count')
                        .and.to.be.at.least(0);
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);

                    done();
                });

        });

        it('should return all users for dropDown list', function (done) {
            aggent
                .get('users/forDd')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body).to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);
                    expect(body.data.length).to.be.above(0);

                    done();
                });

        });

        it('should return all users without password', function (done) {
            aggent
                .get('users')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var _user;

                    if (err) {
                        return done(err);
                    }

                    expect(body).to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);
                    expect(body.data.length).to.be.above(0);

                    _user = body.data[0];
                    expect(_user).to.be.instanceOf(Object);
                    expect(_user).to.have.property('login');
                    expect(_user).to.not.have.property('pass');

                    done();
                });

        });

        it('should return user by id without password', function (done) {
            aggent
                .get('users/55c1e1276708490b0b000035')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var _user;

                    if (err) {
                        return done(err);
                    }

                    expect(body).to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('user')
                        .and.to.be.instanceOf(Object);

                    _user = body.user;

                    expect(body).to.have.property('savedFilters');
                    expect(_user).to.not.have.property('pass');

                    done();
                });

        });

        it('should return current user by id without password', function (done) {
            aggent
                .get('users/current')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var _user;

                    if (err) {
                        return done(err);
                    }

                    expect(body).to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('user')
                        .and.to.be.instanceOf(Object);

                    _user = body.user;

                    expect(body).to.have.property('savedFilters');
                    expect(_user).to.not.have.property('pass');

                    done();
                });

        });

        it('should get totalCollectionLength of users', function (done) {
            aggent
                .get('users/totalCollectionLength')
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

                    done();
                });
        });

        it('should update password', function (done) {
            var body = {
                oldpass: 'superpass',
                pass   : 'superpass'
            };

            aggent
                .patch('users/' + id)
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

                    done();
                });
        });

        it('should don\'t update password', function (done) {
            var body = {
                oldpass: 'superpas',
                pass   : 'superpass'
            };

            aggent
                .patch('users/' + id)
                .send(body)
                .expect(400, done);
        });

        it('should update current + id', function (done) {
            var body = {};

            aggent
                .patch('users/current/' + id)
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

                    done();
                });
        });

        it('should create current user', function (done) {
            var body = {
                login  : 'super.current',
                pass   : 'superpass',
                email  : 'super.current@valid.com',
                profile: 1234
            };

            aggent
                .post('users')
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
                        .to.have.property('id');

                    idCur = body.id;

                    done();
                });
        });

        it('should remove user', function (done) {
            aggent
                .delete('users/' + id)
                .expect(200, done);
        });

        it('should remove current user', function (done) {
            aggent
                .delete('users/' + idCur)
                .expect(200, done);
        });
    });

    describe('User login methods', function () {
        before(function () {
            aggent = request.agent(url);
        });

        it('should login success', function (done) {
            var body = admin;

            aggent
                .post('users/login')
                .send(body)
                .expect(200, done);
        });

        it('should fail login, empty pass field', function (done) {
            var body = {
                login: 'admin',
                dbId : dbId
            };

            aggent
                .post('users/login')
                .send(body)
                .expect(400, done);
        });

        it('should fail login, wrong pass', function (done) {
            var body = {
                login: 'admin',
                pass : 'jdgfdfjkgbdjgbjhfdbgdfbg',
                dbId : dbId
            };

            aggent
                .post('users/login')
                .send(body)
                .expect(400, done);
        });
    });
});


var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/test');

describe('Employee Specs', function () {
    'use strict';
    var userId;
    var id;

    describe('Employee with admin', function () {

        before(function (done) {
            aggent = request.agent(url);

            aggent
                .post('users/login')
                .send({
                    login: 'test',
                    pass : '1234567890',
                    dbId : 'production'
                })
                .expect(200, done);
        });

        after(function (done) {
            aggent
                .get('logout')
                .expect(302, done);
        });

        it('should create employee', function (done) {
            var body = {
                name          : {
                    first: 'newtest',
                    last : 'newtest'
                },
                isEmployee    : true,
                department    : '55b92ace21e4b7c40f00000f',
                jobPosition   : '55b92acf21e4b7c40f00001d',
                dateBirth     : '28 Dec, 1990',
                hire          : [new Date()],
                employmentType: 'FOP',
                userName      : 'test',
                workEmail     : 'roman.buchuk@thinkmobiles.com',
                transfer      : [{
                    status     : 'hired',
                    isDeveloper: true,
                    department : '55b92ace21e4b7c40f00000f',
                    jobPosition: '55b92acf21e4b7c40f00001d',
                    manager    : '56938d2cd87c9004552b639e',
                    jobType    : 'fullTime',
                    info       : 'Hired',
                    salary     : 300,
                    date       : new Date()
                }]
            };

            aggent
                .post('employees')
                .send(body)
                .expect(201)
                .end(function (err, res) {
                    var body = res.body;
                    var result;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('result');
                    expect(body)
                        .to.have.property('id');

                    result = body.result;

                    expect(result)
                        .to.be.an('object');
                    expect(result)
                        .to.have.property('relatedUser')
                        .and.to.not.be.null;
                    expect(result)
                        .to.have.property('employmentType')
                        .and.to.be.equal('FOP');
                    expect(result)
                        .to.have.property('name')
                        .and.to.be.an('object')
                        .and.to.have.property('first')
                        .and.to.be.equal('newtest');

                    id = body.id;
                    userId = result.relatedUser;

                    done();
                });
        });

        it('should not create employee', function (done) {

            var bodyError = {
                department : '55b92ace21e4b7c40f00000f',
                jobPosition: '55b92acf21e4b7c40f00001d',
                dateBirth  : 'cccccc'
            };

            aggent
                .post('employees')
                .send(bodyError)
                .expect(404, done);
        });

        it('should getById employee', function (done) {
            var query = {
                viewType: 'form',
                id      : id
            };
            aggent
                .get('employees/')
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
                        .to.have.property('_id');

                    done();
                });
        });

        it('should get by viewType form employee', function (done) {
            var query = {
                viewType: 'form',
                id      : id
            };
            aggent
                .get('employees/')
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
                        .to.have.property('_id');

                    done();
                });
        });

        it('should get by viewType thumbnails employee', function (done) {
            var query = {
                viewType     : 'thumbnails',
                contentType  : 'Employees',
                count        : 100,
                page         : 1,
                newCollection: false
            };
            aggent
                .get('employees/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var employee;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);
                    expect(body)
                        .to.have.property('total');

                    employee = body.data[0];

                    expect(employee)
                        .to.exist;
                    expect(employee)
                        .to.have.property('department')
                        .and.to.have.property('_id');
                    expect(employee)
                        .to.have.property('department')
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(employee)
                        .to.have.property('jobPosition')
                        .and.to.have.property('_id');
                    expect(employee)
                        .to.have.property('jobPosition')
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(employee)
                        .to.have.property('name')
                        .and.to.have.property('last')
                        .and.to.be.a('string');
                    expect(employee)
                        .to.have.property('name')
                        .and.to.have.property('first')
                        .and.to.be.a('string');
                    expect(employee)
                        .to.have.property('isEmployee')
                        .and.to.be.true;

                    done();
                });
        });

        it('should get by viewType list employee', function (done) {
            var query = {
                viewType     : 'list',
                contentType  : 'Employees',
                count        : 100,
                page         : 1,
                newCollection: false
            };
            aggent
                .get('employees/')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;
                    var employee;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('data')
                        .and.to.be.instanceOf(Array);
                    expect(body)
                        .to.have.property('total');

                    employee = body.data[0];

                    expect(employee)
                        .to.exist;
                    expect(employee)
                        .to.have.property('department')
                        .and.to.have.property('_id');
                    expect(employee)
                        .to.have.property('department')
                        .and.to.have.property('name')
                        .and.to.be.a('string');
                    expect(employee)
                        .to.have.property('jobPosition')
                        .and.to.have.property('_id');
                    expect(employee)
                        .to.have.property('jobPosition')
                        .and.to.have.property('name')
                        .and.to.be.a('string');

                    if (employee.manager) {
                        expect(employee.manager)
                            .to.have.property('_id');
                        expect(employee.manager)
                            .to.have.property('name')
                            .and.to.have.property('first')
                            .and.to.be.a('string');
                    }

                    expect(employee)
                        .to.have.property('name')
                        .and.to.have.property('last')
                        .and.to.be.a('string');
                    expect(employee)
                        .to.have.property('name')
                        .and.to.have.property('first')
                        .and.to.be.a('string');
                    expect(employee)
                        .to.have.property('isEmployee')
                        .and.to.be.true;

                    done();
                });
        });

        it('should get employee for project details', function (done) {
            var ids = [
                '55b92ad221e4b7c40f000032',
                '55b92ad221e4b7c40f000033'
            ];
            aggent
                .get('employees/getForProjectDetails')
                .query({data: ids})
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

        it('should not get employee for project details', function (done) {
            var ids = 'dddd';
            aggent
                .get('employees/getForProjectDetails')
                .query({data: ids})
                .expect(500)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('error');

                    done();
                });
        });

        it('should get employees forDD', function (done) {
            aggent
                .get('employees/getForDD')
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

        it('should get Years', function (done) {

            aggent
                .get('employees/getYears')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object);
                    expect(body)
                        .to.have.property('min')
                        .and.to.be.a('string');

                    done();
                });
        });

        it('should get Employees count', function (done) {

            aggent
                .get('employees/getEmployeesCount')
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
                        .and.to.be.a('number');

                    done();
                });
        });

        it('should get nationality forDD', function (done) {
            aggent
                .get('employees/nationality')
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

        it('should get languages forDD', function (done) {
            aggent
                .get('employees/languages')
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

        it('should get sources forDD', function (done) {
            aggent
                .get('employees/sources')
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

        it('should get only employees forDD', function (done) {
            aggent
                .get('employees/getForDD')
                .query({isEmployee: true})
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

        it('should get employees for salesManager', function (done) {
            aggent
                .get('employees/bySales')
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

        it('should get employees grouped by department', function (done) {
            aggent
                .get('employees/byDepartment')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Array);
                    expect(body)
                        .to.be.not.empty;

                    done();
                });
        });

        /*  it('should get employees min hire date of employees', function (done) {
         aggent
         .get('employees/getMinHireDate')
         .expect(200)
         .end(function (err, res) {
         var body = res.body;

         if (err) {
         return done(err);
         }

         expect(body)
         .to.be.instanceOf(Object);
         expect(body)
         .to.have.property('min');

         done();
         });
         });*/

        it('should get employee for related user', function (done) {
            aggent
                .get('employees/getForDdByRelatedUser')
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

        it('should get employee as salesPerson for dropDown', function (done) {
            aggent
                .get('employees/getForDd')
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

        it('should get first letters of last name of employee', function (done) {
            aggent
                .get('employees/getEmployeesAlphabet')
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

        it('should get employee birthdays', function (done) {
            aggent
                .get('employees/birthdays')
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

        it('should update employee', function (done) {
            var body = {
                source: 'testSource'
            };
            aggent
                .patch('employees/' + id)
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
                        .to.have.property('n')
                        .and.equal(1);

                    done();
                });
        });

        it('should delete employee', function (done) {
            aggent
                .delete('employees/' + id)
                .expect(200, done);
        });

        it('should delete relatedUser', function (done) {
            aggent
                .delete('users/' + userId)
                .expect(200, done);
        });

        it('should not delete employee', function (done) {
            aggent
                .delete('employees/' + 'kkk')
                .expect(500, done);
        });
    });

    /* describe('Employee with user without a license', function () {
     before(function (done) {
     aggent = request.agent(url);

     aggent
     .post('users/login')
     .send({
     login: 'ArturMyhalko',
     pass : 'thinkmobiles2015',
     dbId : 'production'
     })
     .expect(200, done);
     });

     after(function (done) {
     aggent
     .get('logout')
     .expect(302, done);
     });

     it('should fail create Employee', function (done) {
     var body = {
     name       : {
     first: 'test',
     last : 'test'
     },
     department : '55b92ace21e4b7c40f00000f',
     jobPosition: '55b92acf21e4b7c40f00001d',
     dateBirth  : '28 Dec, 1990',
     hire       : [{
     department : '55b92ace21e4b7c40f00000f',
     jobPosition: '55b92acf21e4b7c40f00001d',
     manager    : '56938d2cd87c9004552b639e',
     jobType    : 'Full-time',
     info       : 'Hired',
     date       : new Date()
     }]
     };

     aggent
     .post('employees')
     .send(body)
     .expect(403, done);
     });
     });*/

});
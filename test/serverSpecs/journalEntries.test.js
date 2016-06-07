var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/development');

describe('journalEntries Specs', function () {
    'use strict';
    var id;

    describe('journalEntries with admin', function () {
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

        /* it('should get totalCount of InventoryReport', function (done) {
         var query = {
         filter: {
         startDate: {
         key  : 'startDate',
         value: '1 Feb, 2016'
         },
         endDate  : {
         key  : 'endDate',
         value: '2 Feb, 2016'
         }
         }
         };

         aggent
         .get('journalEntries/totalCollectionInventory')
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
         .to.have.property('count')
         .and.to.be.a('number');


         done();
         });
         });*/

        it('should get async data for closeMonth view', function (done) {
            var query = {
                date: '1 Aug, 2014'
            };

            aggent
                .get('journalEntries/getAsyncCloseMonth')
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
                        .to.have.property('journalEntries')
                        .and.to.be.a('array');

                    done();
                });
        });

        it('should get data for trialBalance view', function (done) {
            var query = {
                'startDate': '1 Feb, 2016',
                'endDate'  : '28 Feb, 2016'
            };

            aggent
                .get('journalEntries/getTrialBalance')
                .query(query)
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

        it('should get data for closeMonth view', function (done) {

            aggent
                .get('journalEntries/getCloseMonth')
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

        it('should get data for balanceSheet view', function (done) {
            var query = {
                'startDate': '1 Feb, 2016',
                'endDate'  : '28 Feb, 2016'
            };

            aggent
                .get('journalEntries/getProfitAndLoss')
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
                        .to.have.property('grossFit')
                        .and.to.be.a('array');
                    expect(body)
                        .to.have.property('expenses')
                        .and.to.be.a('array');
                    expect(body)
                        .to.have.property('dividends')
                        .and.to.be.a('number');

                    done();
                });
        });

        it('should get data for balanceSheet view', function (done) {
            var query = {
                'startDate': '1 Feb, 2016',
                'endDate'  : '28 Feb, 2016'
            };

            aggent
                .get('journalEntries/getBalanceSheet')
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
                        .to.have.property('assets')
                        .and.to.be.a('array');
                    expect(body)
                        .to.have.property('liabilities')
                        .and.to.be.a('array');
                    expect(body)
                        .to.have.property('equity')
                        .and.to.be.a('array');

                    done();
                });
        });

        it('should get data for cashFlow view', function (done) {
            var query = {
                'startDate': '1 Feb, 2016',
                'endDate'  : '28 Feb, 2016'
            };

            aggent
                .get('journalEntries/getCashFlow')
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
                        .to.have.property('operating')
                        .and.to.be.a('array');
                    expect(body)
                        .to.have.property('investing')
                        .and.to.be.a('array');
                    expect(body)
                        .to.have.property('financing')
                        .and.to.be.a('array');

                    done();
                });
        });

        it('should get data for report in Payroll view', function (done) {
            var query = {
                dataKey: '201512'
            };

            aggent
                .get('journalEntries/getPayrollForReport')
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
                        .and.to.be.a('array');

                    done();
                });
        });

        it('should get JE for Report', function (done) {
            var query = {
                _id: id
            };

            aggent
                .get('journalEntries/getForReport')
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
                        .and.to.be.a('object')
                        .and.to.have.property('wagesPayable')
                        .and.to.be.a('array');

                    done();
                });
        });

        it('should get data for Inventory Report view', function (done) {
            var query = {
                'startDate': '1 Feb, 2016',
                'endDate'  : '2 Feb, 2016'
            };

            aggent
                .get('journalEntries/getInventoryReport')
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
                        .to.be.have.property('total');
                    expect(body)
                        .to.be.have.property('data');

                    done();
                });
        });

        it('should get data to export to Xlsx', function (done) {

            aggent
                .get('journalEntries/exportToCsv/%7B%22startDate%22%3A%7B%22key%22%3A%22startDate%22%2C%22value%22%3A%222016-05-01T14%3A36%3A15.282Z%22%7D%2C%22endDate%22%3A%7B%22key%22%3A%22endDate%22%2C%22value%22%3A%222016-05-31T20%3A59%3A59.999Z%22%7D%7D')
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should get data to export to Csv', function (done) {

            aggent
                .get('journalEntries/exportToCsv/%7B%22startDate%22%3A%7B%22key%22%3A%22startDate%22%2C%22value%22%3A%222016-05-01T14%3A36%3A15.282Z%22%7D%2C%22endDate%22%3A%7B%22key%22%3A%22endDate%22%2C%22value%22%3A%222016-05-31T20%3A59%3A59.999Z%22%7D%7D')
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should get JE async for reports', function (done) {
            var query = {
                date: '1 Aug, 2014'
            };

            aggent
                .get('journalEntries/getAsyncData')
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
                        .to.have.property('journalEntries')
                        .and.to.be.a('array');

                    done();
                });
        });

        it('should async get JE for balanceSheet', function (done) {
            var query = {
                'startDate': '1 Feb, 2016',
                'endDate'  : '28 Feb, 2016'
            };

            aggent
                .get('journalEntries/getAsyncDataForGL')
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
                        .to.have.property('journalEntries')
                        .and.to.be.a('array');

                    done();
                });
        });

        /*   it('should get totalCount and total sum', function (done) {
         var query = {
         'startDate': '1 Feb, 2016',
         'endDate'  : '28 Feb, 2016'
         };

         aggent
         .get('journalEntries/totalCollectionLength')
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
         .to.have.property('count')
         .and.to.be.a('number');
         expect(body)
         .to.have.property('totalValue')
         .and.to.be.a('number');


         done();
         });
         });*/

        it('should get JE for list', function (done) {
            var query = {
                'startDate': '1 Feb, 2016',
                'endDate'  : '28 Feb, 2016',
                viewType   : 'list'
            };

            aggent
                .get('journalEntries/')
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
                        .to.be.have.property('total');
                    expect(body)
                        .to.be.have.property('data');
                    expect(body.data.length)
                        .to.be.gte(1);

                    done();
                });
        });

        it('should close month', function (done) {
            var query = {
                year : 2016,
                month: 4
            };

            aggent
                .post('journalEntries/closeMonth')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('success');

                    done();
                });
        });

        it('should reclose month', function (done) {
            var query = ['1 Aug, 2016', '1 Jun, 2016'];

            aggent
                .post('journalEntries/recloseMonth')
                .query(query)
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('success');

                    done();
                });
        });

        it('should reconcile all changed documents month', function (done) {

            aggent
                .post('journalEntries/reconcile')
                .expect(200)
                .end(function (err, res) {
                    var body = res.body;

                    if (err) {
                        return done(err);
                    }

                    expect(body)
                        .to.be.instanceOf(Object)
                        .and.to.have.property('success');

                    done();
                });
        });

        /*it('should create JE', function (done) {
         var body = {};
         body.date = '1 Jan, 2015';
         body.journal = CONSTANTS.INVOICE_JOURNAL;
         body.currency =  'USD';
         body.amount = 10000;
         body.sourceDocument = {};
         body.sourceDocument._id = '55b92ad621e4b7c40f00064a';
         body.sourceDocument.model = 'Invoice';


         });*/

    });

    describe('journalEntries with user without a license', function () {
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
    });
});
var request = require('supertest');
var expect = require('chai').expect;
var url = 'http://localhost:8089/';
var aggent;

require('../../config/environment/development');

describe('journalEntries Specs', function () {
    'use strict';

    var id;
    this.timeout(10000);

    describe('journalEntries with admin', function () {
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
                startDate: '1 Feb, 2016',
                endDate  : '28 Feb, 2016'
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
                startDate: '1 Feb, 2016',
                endDate  : '28 Feb, 2016'
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
                viewType                       : 'list',
                page                           : 1,
                count                          : 50,
                'filter[date][value][0]'       : 'Mon Aug 01 2016 17:24:51 GMT+0300 (EEST)',
                'filter[date][value][1]'       : 'Wed Aug 31 2016 23:59:59 GMT+0300 (EEST)',
                'filter[salesManager][value][]': '55b92ad221e4b7c40f00004f',
                contentType                    : 'inventoryReport'
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
                        .to.be.have.property('data')
                        .and.to.be.instanceOf(Array);
                    expect(body.data[0])
                        .to.exist;
                    expect(body.data[0])
                        .to.be.have.property('salesmanager')
                        .and.to.be.equal('Alex Sokhanych');

                    done();
                });
        });

        it('should get data to export to Xlsx', function (done) {

            aggent
                .get('journalEntries/exportToXlsx/?filter=%7B%22date%22%3A%7B%22value%22%3A%5B%222015-12-31T22%3A00%3A00.000Z%22%2C%222015-12-31T22%3A00%3A00.000Z%22%5D%7D%7D')
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
                .get('journalEntries/exportToCsv/?filter=%7B%22date%22%3A%7B%22value%22%3A%5B%222015-12-31T22%3A00%3A00.000Z%22%2C%222015-12-31T22%3A00%3A00.000Z%22%5D%7D%7D')
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
                    dbId : 'vasyadb'
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
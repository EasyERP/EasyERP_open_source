define([
    'models/CustomerModel',
    'chai'
], function (CustomerModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('CustomerModel', function () {
        var customer;
        var server;

        before(function () {
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
        });

        it('should be a Customer object', function () {
            customer = new CustomerModel();

            expect(customer).to.be.instanceOf(Object);
        });

        it('Try to get url (isCompany=false)', function(){
            expect(customer.url()).to.be.equals('/createCompany');
        });

        it('Try to get url (isCompany=true)', function(){
            customer.set('isCompany', true);

            expect(customer.url()).to.be.equals('/createAccount');
        });
    });
});

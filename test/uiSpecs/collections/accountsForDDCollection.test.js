define([
    'collections/Customers/AccountsDdCollection',
    'chai'
], function (AccountsDdCollection, chai) {
    'use strict';
    var expect = chai.expect;

    describe('AccountsDdCollection', function () {
        var mainSpy;
        var server;
        var accountsForDD;
        var initSpy;
        var fakeAccountsForDD = {
            data: [
                {
                    _id: "55b92ad221e4b7c40f000030",
                    name: {
                        last: "Svatuk",
                        first: "Alex"
                    },
                    fullName: "Alex Svatuk",
                    id: "55b92ad221e4b7c40f000030"
                },
                {
                    _id: "55b92ad221e4b7c40f000031",
                    name: {
                        last: "Gleba",
                        first: "Alex"
                    },
                    fullName: "Alex Gleba",
                    id: "55b92ad221e4b7c40f000031"
                },
                {
                    _id: "55b92ad221e4b7c40f00003e",
                    name: {
                        last: "Lapchuk",
                        first: "Alex"
                    },
                    fullName: "Alex Lapchuk",
                    id: "55b92ad221e4b7c40f00003e"
                }
            ]
        };
        var accountsForDDUrl = new RegExp('\/employees\/getForDd', 'i');

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
            initSpy = sinon.spy(AccountsDdCollection.prototype, 'initialize');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
            initSpy.restore();
        });

        it ('Try to create collection with error server response', function(){
            server.respondWith('GET', accountsForDDUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeAccountsForDD)]);
            accountsForDD = new AccountsDdCollection({});
            server.respond();

            expect(initSpy.called).to.be.true;
        });

        it ('Try to create collection', function(){
            server.respondWith('GET', accountsForDDUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeAccountsForDD)]);
            accountsForDD = new AccountsDdCollection({});
            server.respond();

            expect(accountsForDD.toJSON().length).to.be.equals(3);
            expect(initSpy.calledTwice).to.be.true;
        });
    });
});
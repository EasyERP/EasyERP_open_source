define([
    'collections/journalEntry/filterCollection',
    'chai'
], function (JournalEntryCollection, chai) {
    'use strict';
    var expect = chai.expect;

    describe('JournalEntryCollection', function () {
        var mainSpy;
        var server;
        var journalEntryCollection;

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        var fakeJournal = [
            {
            _id: "565f470c2ceb020214aa003a",
            credit: 0,
            debit: 9100,
            currency: {
                rate: 1,
                name: "USD"
            },
            journal: {
                _id: "565ef6ba270f53d02ee71d65",
                name: "Invoice Journal"
            },
            date: "2015-12-01T23:00:00.000Z"
        }, {
                _id: "565f470c2ceb020214aa003b",
                credit: 9100,
                debit: 0,
                currency: {
                    rate: 1,
                    name: "USD"
                },
                journal: {
                    _id: "565ef6ba270f53d02ee71d65",
                    name: "Invoice Journal"
                },
                date: "2015-12-01T23:00:00.000Z"
            }
        ];

        it ('Try to create collection', function(done){
            var journalUrl = new RegExp('/journal/journalEntry/list', 'i');

            server.respondWith('GET', journalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJournal)]);
            journalEntryCollection = new JournalEntryCollection({
                viewType: 'list',
                success: function(){
                    done();
                },
                error: function(collection, response){
                    done(response);
                }
            });
            server.respond();

            expect(journalEntryCollection.toJSON().length).to.be.equals(2);
        });

        it ('Try to create collection with error', function(done){
            var journalUrl = new RegExp('/journal/journalEntry/list', 'i');

            server.respondWith('GET', journalUrl, [401, {"Content-Type": "application/json"}, JSON.stringify(fakeJournal)]);
            journalEntryCollection = new JournalEntryCollection({
                viewType: 'list',
                success: function(){
                    done();
                },
                error: function(collection, response){
                    done(response);
                }
            });
            server.respond();

            expect(window.location.hash).to.be.equals('#login');
        });

        it ('Try to showMore collection', function(){
            var journalUrl = new RegExp('/journal/journalEntry/list', 'i');

            server.respondWith('GET', journalUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJournal)]);
            journalEntryCollection.showMore({
                page: 1,
                count: 2,
                viewType: 'list',
                contentType: 'JournalEntry'
            });
            server.respond();

            expect(journalEntryCollection.toJSON().length).to.be.equals(2);
        });

        it ('Try to showMore collection', function(){
            var spyResponse;
            var journalUrl = new RegExp('/journal/journalEntry/list', 'i');

            server.respondWith('GET', journalUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeJournal)]);
            journalEntryCollection.showMore();
            server.respond();

            spyResponse = mainSpy.args[0][0];
            expect(spyResponse).to.have.property('type', 'error');
            expect(spyResponse).to.have.property('message', 'Some Error.');
        });

    });
});

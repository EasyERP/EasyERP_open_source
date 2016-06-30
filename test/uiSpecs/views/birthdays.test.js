define([
    'modules',
    'text!fixtures/index.html',
    'collections/Birthdays/filterCollection',
    'views/main/MainView',
    'views/Birthdays/list/ListView',
    'views/Birthdays/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (modules, fixtures, BirthdaysCollection, MainView, ListView, TopBarView, $, chai, chaiJquery, sinonChai, Custom, async) {
    'use strict';
    var expect;
    var fakeBirthdays = {
        data: {
            weekly: [
                {
                    daysForBirth: 2,
                    name: {
                        first: "Vyacheslav",
                        last: "Kopinets"
                    },
                    workPhones: {
                        mobile: "+380988461758"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000016"
                    },
                    jobPosition: {
                        name: "Senior JS",
                        _id: "55b92acf21e4b7c40f00002b"
                    },
                    age: 25,
                    dateBirth: "2016-06-08T01:00:00.000Z",
                    _id: "55b92ad221e4b7c40f00004d"
                }
            ],
            nextweek: [
                {
                    daysForBirth: 11,
                    name: {
                        first: "Vitaliy",
                        last: "Shuba"
                    },
                    workPhones: {
                        mobile: "+380950366064"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000010"
                    },
                    jobPosition: {
                        name: "Head of Android",
                        _id: "564438aa70bbc2b740ce8a19"
                    },
                    age: 21,
                    dateBirth: "2016-06-16T21:00:00.000Z",
                    _id: "55b92ad221e4b7c40f00004e"
                }
            ],
            monthly: [
                {
                    daysForBirth: -5,
                    name: {
                        first: "Sergiy",
                        last: "Tilishevsky"
                    },
                    workPhones: {
                        mobile: "+380637664641"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000011"
                    },
                    jobPosition: {
                        name: "Junior QA",
                        _id: "55b92acf21e4b7c40f000018"
                    },
                    age: 33,
                    dateBirth: "2016-06-01T06:00:00.000Z",
                    _id: "55b92ad221e4b7c40f000064"
                }
            ]
        }
    };
    var birthdaysCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;


    describe('BirthDaysView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            windowConfirmStub = sinon.stub(window, 'confirm');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

            windowConfirmStub.restore();
        });

        describe('#initialize()', function () {
            var server;

            before(function () {
                $fixture = $(fixtures);
                $fixture.appendTo(document.body);
                $elFixture = $fixture.find('#wrapper');

                server = sinon.fakeServer.create();

            });

            after(function () {
                server.restore();
            });

            it('Should create main view', function () {
                var $expectedSubMenuEl;
                var $expectedMenuEl;

                server.respondWith('GET', '/modules/', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'Birthdays'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="52"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="52"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Birthdays');
            });
        });

        describe('TopBarView', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create TopBarView', function () {
                var birthdaysUrl = new RegExp('\/birthdays\/', 'i');
                var collectionJSON;

                server.respondWith('GET', birthdaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeBirthdays)]);
                birthdaysCollection = new BirthdaysCollection({
                    count      : 100,
                    viewType   : 'list',
                    contentType: 'Birthdays'
                });
                server.respond();

                collectionJSON = birthdaysCollection.toJSON()[0];

                expect(collectionJSON).to.have.property('weekly');
                expect(collectionJSON.weekly).to.have.lengthOf(1);
                expect(collectionJSON).to.have.property('nextweek');
                expect(collectionJSON.nextweek).to.have.lengthOf(1);
                expect(collectionJSON).to.have.property('monthly');
                expect(collectionJSON.monthly).to.have.lengthOf(1);

                topBarView = new TopBarView({
                    collection: birthdaysCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.equals('Birthdays');
            });

        });

        describe('BirthdayList view', function () {
            var server;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create Birthday listView', function () {
                    var $listHolder;
                    var birthdaysUrl = new RegExp('\/birthdays\/', 'i');

                    server.respondWith('GET', birthdaysUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeBirthdays)]);
                    listView = new ListView({
                        collection: birthdaysCollection,
                        startTime : new Date()
                    });
                    server.respond();

                    $listHolder = listView.$el;
                    expect($listHolder).to.exist;


                });
            });
        });
    });
});

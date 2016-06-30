/*
define([
    'modules',
    'text!fixtures/index.html',
    'views/main/MainView',
    'views/Hours/index',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, MainView, IndexView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var fakeRevenue = {
        hoursSold  : [{
            employees  : [
                {
                    name     : "Oleksiy Gerasimov",
                    total    : 1539,
                    hoursSold: {
                        201502: 160,
                        201503: 29,
                        201504: 160,
                        201505: 104,
                        201506: 128,
                        201507: 104,
                        201508: 104,
                        201509: 36,
                        201510: 52,
                        201511: 118,
                        201512: 96,
                        201601: 120,
                        201602: 184,
                        201603: 144
                    }
                }
            ],
            name       : 'iOS',
            totalForDep: 51151
        }],
        totalHours : [{
            employees  : [
                {
                    name      : "Roman Osadchuk",
                    total     : 1448,
                    hoursTotal: {
                        201501: 160,
                        201502: 160,
                        201503: 160,
                        201504: 168,
                        201505: 144,
                        201506: 144,
                        201507: 184,
                        201508: 152,
                        201509: 176
                    }
                }
            ],
            name       : 'iOS',
            totalForDep: 60816
        }],
        hoursUnsold: [
            {
                name       : "iOS",
                employees  : [
                    {
                        name      : "Roman Osadchuk",
                        hoursTotal: {
                            201501: 160,
                            201502: 160,
                            201503: 160,
                            201504: 168,
                            201505: 144,
                            201506: 144,
                            201507: 184,
                            201508: 152,
                            201509: 176
                        },
                        total     : 1448
                    }
                ],
                totalForDep: 38153
            }
        ]
    };
    var expect;
    var view;
    var indexView;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('Efficiency View', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            indexView.remove();
            view.remove();
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
                
                server.respondWith('GET', '/getModules', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);
                view = new MainView({el: $elFixture, contentType: 'Efficiency'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="76"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="76"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Efficiency');
            });
        });

        describe('Efficiency ListView', function () {
            var server;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to Efficiency ListView', function (done) {
                    var revenueUrl = new RegExp('\/revenue\/getFromCash', 'i');

                    this.timeout(5000);

                    server.respondWith('GET', revenueUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeRevenue)]);
                    indexView = new IndexView();
                    server.respond();

                    clock.tick(4000);

                    expect(indexView.$el.find('.chartContainer')).to.have.exist;
                    expect(indexView.$el.find('#totalTotalHours')).to.have.exist;
                    expect(indexView.$el.find('#totalHoursSold')).to.have.exist;
                    expect(indexView.$el.find('#totalHoursUnsold')).to.have.exist;

                    done();
                });

                it('Try to change week', function (done) {
                    var revenueUrl = new RegExp('\/revenue\/getFromCash', 'i');

                    this.timeout(6000);

                    server.respondWith('GET', revenueUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeRevenue)]);
                    indexView.updateWeek();
                    server.respond();

                    clock.tick(5500);

                    expect(indexView.$el.find('.chartContainer')).to.have.exist;
                    expect(indexView.$el.find('#totalTotalHours')).to.have.exist;
                    expect(indexView.$el.find('#totalHoursSold')).to.have.exist;
                    expect(indexView.$el.find('#totalHoursUnsold')).to.have.exist;

                    done();
                });

                it('Try to open department', function () {
                    var $needBtn = indexView.$el.find('.clickToShow')[0];

                    $needBtn.click();
                    expect($(indexView.$el.find('.subRow')[0])).to.have.css('display', 'table-row');

                    $needBtn.click();
                    expect($(indexView.$el.find('.subRow')[0])).to.have.css('display', 'none');
                });

            });
        });

    });


});
*/

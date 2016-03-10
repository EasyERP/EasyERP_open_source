define([
    'models/WorkflowsModel',
    'chai'
], function (WorkflowsModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('WorkflowsModel', function () {
        var mainSpy;
        var workflow;
        var server;

        before(function () {
            mainSpy = sinon.spy(App, 'render');
            server = sinon.fakeServer.create();
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        it('should be a Department object', function () {
            workflow = new WorkflowsModel({});

            expect(workflow).to.be.instanceOf(Object);
        });

        it('should contain main attributes', function () {
            workflow.set('name', 'Ready to teach');

            expect(workflow.get('name')).to.be.equals('Ready to teach');
        });

        it ('Get model urlRoot', function(){
            var urlRoot = workflow.urlRoot();

            expect(urlRoot).to.be.a('string');
            expect(urlRoot).to.be.equals('/workflows/');
        });

        it ('Try to set incorrect name', function(){
            var spyResponse;

            workflow.set({name: ',>dfdssdf'}, {validate: true});
            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');


        });

        it ('Try to set incorrect status', function(){
            var spyResponse;

            workflow.set({
                value: [{
                    name: '<sadsdxcdsdsad'
                }]
            }, {
                validate: true
            });

            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');

        });

        it ('Try to save model', function(){
            server.respondWith('POST', '/workflows/', [200, {"Content-Type": "application/json"}, JSON.stringify([{
                name  : 'My workflow'
            }])]);

            workflow.set({name: 'My workflow'}, {validate: true});

            workflow.save(null, {
                editMode   : false,
                success    : function () {
                    done();
                },
                error: function(model, xhr){
                    done(xhr);
                }
            });

            expect(workflow.get('name')).to.be.equals('My workflow');
        });

    });
});

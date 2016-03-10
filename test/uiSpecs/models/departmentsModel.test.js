define([
    'models/DepartmentsModel',
    'chai'
], function (DepartmentsModel, chai) {
    'use strict';
    var expect = chai.expect;

    describe('DepartmentModel', function () {
        var mainSpy;
        var department;
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
            department = new DepartmentsModel({});

            expect(department).to.be.instanceOf(Object);
        });

        it('should contain main attributes', function () {
            department.set('departmentName', 'web');
            department.set('parentDepartment', '');
            department.set('departmentManager', 'Roman');

            expect(department.get('departmentName')).to.be.equal('web');
            expect(department.get('parentDepartment')).to.be.equal('');
            expect(department.get('departmentManager')).to.be.equal('Roman');
        });

        it ('Get model urlRoot', function(){
            var urlRoot = department.urlRoot();

            expect(urlRoot).to.be.a('string');
            expect(urlRoot).to.be.equals('/Departments/');
        });

        it ('Check validation', function(){
            var spyResponse;

            department.set({departmentName: ',>dfdssdf'}, {validate: true});
            spyResponse = mainSpy.args[0][0];

            expect(spyResponse).to.have.property('type', 'error');
        });

        it ('Change departmentName value', function(done){
            server.respondWith('POST', '/Departments/', [200, {"Content-Type": "application/json"}, JSON.stringify([{
                departmentName  : 'WEB_JS'
            }])]);

            department.set({departmentName: 'WEB_JS'});
            department.save(null, {
                editMode   : false,
                success    : function () {
                    done();
                },
                error: function(model, xhr){
                    done(xhr);
                }
            });

            server.respond();

            expect(department.departmentName).to.be.equal('WEB_JS');
        });

    });
});

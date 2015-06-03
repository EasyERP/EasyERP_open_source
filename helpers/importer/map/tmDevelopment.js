/**
 * Created by Roman on 27.05.2015.
 */
module.exports = (function () {
    var employee = {
        collection: 'Employees',
        table: 'Employee',
        defaultValues: {
            isEmployee: true
        },
        aliases: {
            imageSrc: 'Avatar',
            'name.first': 'FirstName',
            'name.last': 'LastName',
            workEmail: 'Email',
            personalEmail: 'PersonalEmail',
            'workPhones.mobile': 'Phone',
            skype: 'Skype',
            isLead: 'IsLead',
            ID: 'ID',
            'social.LI': 'LinkedIn',
            'social.GP': 'GooglePlus',
            'social.FB': 'FaceBook',
            dateBirth: 'Birthday',
            department: 'Department.ID',
            jobPosition: 'JobPosition.ID'
        }
    };

var jobPosition = {
        collection: 'JobPosition',
        table: 'JobPositions',
        comparator: {
            'RecruitStatus': [{
                value: 'True',
                field: 'workflow',
                fieldValue: '528ce71ef3f67bc40b00001d'
            }, {
                value: 'False',
                field: 'workflow',
                fieldValue: '528ce700f3f67bc40b00001c'
            }]
        },
        aliases: {
            name: 'JobName',
            totalForecastedEmployees: 'Forecasted',
            numberOfEmployees: 'CurrentNumber',
            expectedRecruitment: 'ExpectedRecruit',
            department: 'Department',
            workflow: 'RecruitStatus'
        }
    };

    var department = {
        collection: 'Department',
        table: 'Department',
        aliases: {
            departmentName: 'Name',
            ID: 'ID'
        }
    };

    var hrTasks = [department, jobPosition, employee];

    return hrTasks;
})();
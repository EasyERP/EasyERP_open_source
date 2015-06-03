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
            department: 'Department',
            jobPosition: 'JobPosition'
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

    var project = {
        collection: 'Project',
        table: 'Project',
        comparator: {
            'ProjectStatus': [{
                value: 'Completed',
                field: 'workflow',
                fieldValue: '528ce82df3f67bc40b000025'
            }, {
                value: 'In Progress',
                field: 'workflow',
                fieldValue: '528ce7f2f3f67bc40b000023'
            }]
        },
        aliases: {
            ID: 'ID',
            projectName: 'ProjectName',
            customer: 'Company', /*TODO*/
            workflow: 'ProjectStatus',
            StartDate: 'StartDate',
            EndDate: 'EndDate',
            projectmanager: 'Assigned' /*TODO*/
        }

    };

    var customer = {
        collection: 'Customer',
        table: 'Company',
        aliases: {
            ID: 'ID',
            name: {
                first: 'Name'
            },
            address: {
                country: 'Country'
            }
            /*industry: companySize:*/ /*TODO*/
        }
    };

    var hrTasks = [department, jobPosition, employee, project, customer];

    return hrTasks;
})();
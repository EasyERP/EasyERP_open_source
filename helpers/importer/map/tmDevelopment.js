/**
 * Created by Roman on 27.05.2015.
 */
module.exports = (function () {
    var salary = {
        collection: 'Salary',
        table: 'Salary',
        aliases: {
            ID: 'ID',
            employee: 'Employee',
            year: 'Year',
            month: 'Month',
            baseSalary: 'BaseSalary',
            hourlyWithExpense: 'HourlyWithExpense',
            'calc.salary': 'CalcSalary',
            'calc.onCash': 'CalcOnCash',
            'calc.onCard': 'CalcOnCard',
            'calc.onBonus': 'CalcOnBonus',
            'paid.onCash': 'PaidOnCash',
            'paid.onCard': 'PaidOnCard',
            'paid.onBonus': 'PaidOnBonus',
            'diff.onCash': 'OnCashDiff',
            'diff.onCard': 'OnCardDiff',
            'diff.onBonus': 'OnBonusDiff'
        }
    };
    var employee = {
        collection: 'Employees',
        table: 'Employee',
        comparator: {
            'Avatar': [{
                value: 'Null',
                field: 'imageSrc',
                fieldValue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC'
            }, {
                value: 'undefined',
                field: 'imageSrc',
                fieldValue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC'
            }]
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
            isEmployee: 'isHired',
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
            ID: 'ID',
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
                value: '1',
                field: 'workflow',
                fieldValue: 'New'
            }, {
                value: '2',
                field: 'workflow',
                fieldValue: 'Pending'
            }, {
                value: '3',
                field: 'workflow',
                fieldValue: 'In Progress'
            }, {
                value: '4',
                field: 'workflow',
                fieldValue: 'Done'
            }, {
                value: '5',
                field: 'workflow',
                fieldValue: 'Cancelled'
            }, {
                value: '6',
                field: 'workflow',
                fieldValue: 'In Progress'
            }]
        },
        aliases: {
            ID: 'ID',
            projectName: 'ProjectName',
            customer: 'Company',
            workflow: 'ProjectStatus',
            StartDate: 'StartDate',
            EndDate: 'EndDate',
            projectmanager: 'Assigned'
        }

    };
    var customer = {
        collection: 'Customers',
        table: 'Company',
        comparator: {
            'CompanySize': [{
                value: '1',
                field: 'size',
                fieldValue: '1-50'
            }, {
                value: '2',
                field: 'size',
                fieldValue: '50-200'
            }, {
                value: '3',
                field: 'size',
                fieldValue: '200-500'
            }, {
                value: '4',
                field: 'size',
                fieldValue: '>500'
            }],
            'IsCompany': [{
                value: 'True',
                field: 'type',
                fieldValue: 'Company'
            }, {
                value: 'False',
                field: 'type',
                fieldValue: 'Person'
            }]

        },
        aliases: {
            ID: 'ID',
            'name.first': 'Name',
            'address.country': 'Country',
            'companyInfo.size': 'CompanySize',
            'companyInfo.industry': 'Industry',
            type: 'IsCompany'
        }
    };

    var wTrack = {
        collection: 'wTrack',
        table: 'wTrack',
        aliases: {
            ID: 'ID',
            project: 'Project',
            employee: 'Employee',
            department: 'Department',
            year: 'Year',
            month: 'Month',
            week: 'Week',
            worked: 'Worked',
            rate: 'Rate',
            revenue: 'Revenue',
            cost: 'Cost',
            amount: 'Amount',
            isPaid: 'isPaid',
            1: 'Mo',
            2: 'Tu',
            3: 'We',
            4: 'Th',
            5: 'Fr',
            6: 'Sa',
            7: 'Su'
        }
    };

    var user = {
        collection: 'Users',
        table: 'Users',
        aliases: {
            ID: 'ID',
            login: 'Login',
            pass: 'Password',
            RelatedEmployee: 'Employee' /*TODO*/
        }
    };

    return [department, jobPosition, employee, project, customer, wTrack, salary];
})();
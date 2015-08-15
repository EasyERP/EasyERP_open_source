/**
 * Created by Roman on 23.04.2015.
 */
define([], function () {
    var filters = {
        wTrack: {
            'Assigned': {
                view: 'projectManager',
                backend: 'project.projectmanager._id'
            },
            'Employee': {
                view: 'employee',
                backend: 'employee._id'
            },
            'Customer': {
                view: 'customer',
                backend: 'project.customer._id'
            },
            'Project Name': {
                view: 'projectName',
                backend: 'project._id'
            },
            'Department': {
                view: 'department',
                backend: 'department._id'
            },
            'Month': {
                view: 'month',
                backend: 'month'
            },
            'Year': {
                view: 'year',
                backend: 'year'
            },
            'Week': {
                view: 'week',
                backend: 'week'
            },
            'Status': {
                view: 'isPaid',
                backend: 'isPaid'
            }
        },
        Persons: {
            'Full Name': {
                view: 'name',
                backend: '_id'
            },
            'Country': {
                view: 'country',
                backend: 'address.country'
            },
            'Services': {
                view: 'services',
                backend: 'services'
            }
        },
        Companies: {
            'Name': {
                view: 'name',
                backend: '_id'
            },
            'Country': {
                view: 'country',
                backend: 'address.country'
            },
            'Services': {
                view: 'services',
                backend: 'services'
            }
        },
        Employees: {
            'Full Name':{
                view: 'name',
                backend: '_id'
            },
            'Department': {
                view: 'department',
                backend: 'department._id'
            },
            'Manager': {
                view: 'manager',
                backend: 'manager._id'
            },
            'Job Position': {
                view: 'jobPosition',
                backend: 'jobPosition._id'
            }
        },
        Applications: {
            'Full Name':{
                view: 'name',
                backend: '_id'
            },
            'Department': {
                view: 'department',
                backend: 'department._id'
            },
            /*'Manager': {
                view: 'manager',
                backend: 'manager._id'
            },*/
            'Job Position': {
                view: 'jobPosition',
                backend: 'jobPosition._id'
            }
        },
        JobPositions: {
            'Name': {
                view: 'name',
                backend: 'name'
            },
            'Status': {
                view: 'workflow',
                backend: 'workflow'
            },
            'Department': {
                view: 'department',
                backend: 'department'
            }
        },
        salesInvoice: {
            'Customer': {
                view: 'customer',
                backend: 'customer'
            },
            'Assigned': {
                view: 'salesPerson',
                backend: 'salesPerson'
            },
            'Status': {
                view: 'workflow',
                backend: 'workflow'
            }
        },
        Projects: {
            'Project Name': {
                view: 'name',
                backend: '_id'
            },
            'Contact': {
                view: 'customer',
                backend: 'customer._id'
            },
            'Status': {
                view: 'workflow',
                backend: 'workflow._id'
            },
            'Project Manager': {
                view: 'projectmanager',
                backend: 'projectmanager._id'
            }
        },
        Tasks: {
            'Project': {
                view: 'project',
                backend: 'project'
            },
            'Status': {
                view: 'workflow',
                backend: 'workflow'
            },
            'Assigned To': {
                view: 'assignedTo',
                backend: 'assignedTo'
            },
            'Type': {
                view: 'type',
                backend: 'type'
            },
        }

    };

    return {
        PERSONS: 'Persons',
        COMPANIES: 'Companies',
        LEADS: 'Leads',
        OPPORTUNITIES: 'Opportunities',
        PROJECTS: 'Projects',
        TASKS: 'Tasks',
        EMPLOYEES: 'Employees',
        APPLICATIONS: 'Applications',
        JOBPOSITIONS: 'JobPositions',
        BIRTHDAYS: 'Birthdays',
        DEPARTMENTS: 'Departments',
        USERS: 'Users',
        PROFILES: 'Profiles',
        ORDER: 'Order',
        INVOICE: 'Invoice',
        QUOTATION: 'Quotation',
        DASHBOARD: 'Dashboard',
        DEGREES: 'Degrees',
        SOURCEOFAPPLICANTS: 'SourceOfApplicants',
        LEADSWORKFLOW: 'LeadsWorkflow',
        MYPROFILE: 'myProfile',
        PRODUCT: 'Product',
        SUPPLIERPAYMENTS: 'supplierPayments',
        CUSTOMERPAYMENTS: 'customerPayments',
        SALESQUOTATION: 'salesQuotation',
        SALESORDER: 'salesOrder',
        SALESINVOICE: 'salesInvoice',
        SALESPRODUCT: 'salesProduct',
        WTRACK: 'wTrack',
        SALARY: 'Salary',
        REVENUE: 'Revenue',
        MONTHHOURS: 'monthHours',
        BONUSTYPE: 'bonusType',
        HOLIDAY: 'Holiday',
        VACATION: 'Vacation',
        ATTENDANCE: 'Attendance',
        DASHBOARD_VACATION: 'DashboardVacation',
        DASHBOARD_HR: 'HrDashboard',

        RESPONSES: {
            BAD_RESPONSE: 'Please try again',
            CREATE_QUOTATION: 'Please check at most one supplier or create one',
            CONFIRM_ORDER: 'Please add at most one product to quotation'
        },

        WTRACK_DB_NAME: 'weTrack',
        FILTERS: filters,
        FILTERVALUESCOUNT: 7
    }
});
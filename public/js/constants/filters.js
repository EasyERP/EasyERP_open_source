'use strict';

(function () {
    var root;

    var FILTERS = {
        wTrack: {
            employee: {
                displayName: 'Employee',
                backend    : 'employee._id'
            },

            customer: {
                displayName: 'Customer',
                backend    : 'customer._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            month: {
                displayName: 'Month',
                backend    : 'month',
                type       : 'integer'
            },

            year: {
                displayName: 'Year',
                backend    : 'year',
                type       : 'integer'
            },

            week: {
                displayName: 'Week',
                backend    : 'week',
                type       : 'integer'
            },

            _type: {
                displayName: 'Type',
                backend    : '_type',
                type       : 'string'
            },

            jobs: {
                backend: 'jobs'
            },

            array: ['employee', 'customer', 'project', 'department', 'month', 'year', 'week', '_type']
        },

        Persons: {
            name: {
                displayName: 'Full Name',
                backend    : '_id'
            },

            country: {
                displayName: 'Country',
                backend    : 'address.country'
            },

            services: {
                displayName: 'Services',
                backend    : 'services',
                type       : 'boolean'
            },

            array: ['name', 'country', 'services']
        },

        DashVacation: {
            name: {
                displayName: 'Employee',
                backend    : 'employee'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            projecttype: {
                displayName: 'Project Type',
                backend    : 'project.projecttype',
                type       : 'string'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager.employeeId'
            },

            array: ['name', 'department', 'projecttype', 'salesManager']
        },

        Companies: {
            name: {
                displayName: 'Name',
                backend    : '_id'
            },

            country: {
                displayName: 'Country',
                backend    : 'address.country'
            },

            services: {
                displayName: 'Services',
                backend    : 'services'
            },

            array: ['name', 'country', 'services']
        },

        Employees: {
            name: {
                backend    : '_id',
                displayName: 'Full Name'
            },

            department: {
                backend    : 'department._id',
                displayName: 'Department'
            },

            manager: {
                backend    : 'manager._id',
                displayName: 'Manager'
            },

            jobPosition: {
                backend    : 'jobPosition._id',
                displayName: 'Job Position'
            },

            array: ['name', 'department', 'manager', 'jobPosition']
        },

        Applications: {
            name: {
                displayName: 'Full Name',
                backend    : '_id'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            jobPosition: {
                displayName: 'Job Position',
                backend    : 'jobPosition._id'
            },

            array: ['name', 'department', 'jobPosition']
        },

        /* JobPositions: {
         name: {
         displayName: 'Name',
         backend    : 'name'
         },

         workflow: {
         displayName: 'Status',
         backend    : 'workflow'
         },

         department: {
         displayName: 'Department',
         backend    : 'department'
         }
         }, */

        salesInvoices: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesPerson: {
                displayName: 'Assigned',
                backend    : 'salesPerson._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['supplier', 'salesPerson', 'project', 'workflow']
        },

        ExpensesInvoice: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['supplier', 'workflow']
        },

        WriteOff: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },
            journal: {
                displayName: 'Journal',
                backend    : 'journal._id'
            },
            array  : ['project', 'journal']
        },

        DividendInvoice: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        salesProforma: {
            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesPerson: {
                displayName: 'Assigned',
                backend    : 'salesPerson._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['supplier', 'salesPerson', 'project', 'workflow']
        },

        Projects: {
            name: {
                displayName: 'Project Name',
                backend    : '_id'
            },

            customer: {
                displayName: 'Contact',
                backend    : 'customer._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            projectManager: {
                displayName: 'Project Manager',
                backend    : 'projectManager._id'
            },

            summary: {
                backend: '_id'
            },

            type: {
                backend: 'projecttype',
                type   : 'string'
            },

            assignedTo: {
                backend: 'assignedTo._id'
            },

            array: ['name', 'customer', 'workflow', 'salesManager', 'projectManager']
        },

        Leads: {
            contactName: {
                displayName: 'Contact Name',
                backend    : 'contactName',
                type       : 'string'
            },

            source: {
                displayName: 'Source',
                backend    : 'source',
                type       : 'string'
            },

            workflow: {
                displayName: 'Stage',
                backend    : 'workflow._id'
            },

            salesPerson: {
                displayName: 'Sales Person',
                backend    : 'salesPerson._id'
            },

            createdBy: {
                displayName: 'Created By',
                backend    : 'createdBy.user._id'
            }
        },

        Opportunities: {
            customer: {
                displayName: 'Customer',
                backend    : 'customer'
            },

            workflow: {
                displayName: 'Stage',
                backend    : 'workflow'
            },

            salesPerson: {
                displayName: 'Sales Person',
                backend    : 'salesPerson'
            },

            array: ['customer', 'salesPerson', 'workflow']
        },

        Tasks: {
            project: {
                displayName: 'Project',
                backend    : 'project'
            },

            summary: {
                displayName: 'Task Summary',
                backend    : 'summary'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            },

            assignedTo: {
                displayName: 'Assigned To',
                backend    : 'assignedTo'
            },

            type: {
                displayName: 'Type',
                backend    : 'type',
                type       : 'string'
            }
        },

        customerPayments: {
            assigned: {
                displayName: 'Assigned',
                backend    : 'assigned._id'
            },

            supplier: {
                displayName: 'Company',
                backend    : 'supplier._id'
            },

            paymentMethod: {
                displayName: 'Payment way',
                backend    : 'paymentMethod._id'
            },

            name: {
                displayName: 'Name',
                backend    : '_id'
            }
        },

        supplierPayments: {
            supplier: {
                displayName: 'Employee',
                backend    : 'supplier._id'
            },

            paymentRef: {
                displayName: 'Bonus Type',
                backend    : 'paymentRef',
                type       : 'string'
            },

            year: {
                displayName: 'Year',
                backend    : 'year',
                type       : 'integer'
            },

            month: {
                displayName: 'Month',
                backend    : 'month',
                type       : 'integer'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow',
                type       : 'string'
            }
        },

        ExpensesPayments: {
            supplier: {
                displayName: 'Employee',
                backend    : 'supplier._id'
            },

            year: {
                displayName: 'Year',
                backend    : 'year'
            },

            month: {
                displayName: 'Month',
                backend    : 'month'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            }
        },

        /*DividendPayments: {
         year: {
         displayName: 'Year',
         backend    : 'year'
         },

         month: {
         displayName: 'Month',
         backend    : 'month'
         },

         workflow: {
         displayName: 'Status',
         backend    : 'workflow'
         }
         },*/

        Products: {
            name: {
                displayName: 'Product Name',
                backend    : '_id'
            },

            /*productType: {
                displayName: 'Product Type',
                backend    : 'info.productType',
                type       : 'string'
            },*/

            canBeSold: {
                displayName: 'Can be Sold',
                backend    : 'canBeSold',
                type       : 'boolean'
            },

            canBeExpensed: {
                displayName: 'Can be Expensed',
                backend    : 'canBeExpensed',
                type       : 'boolean'
            },

            canBePurchased: {
                displayName: 'Can be Purchased',
                backend    : 'canBePurchased',
                type       : 'boolean'
            },

            productCategory: {
                displayName: 'Category',
                backend    : 'accounting.category._id'
            },

            array: ['name', 'canBeSold', 'canBeExpensed', 'canBePurchased']
        },

        salesProduct: {
            name: {
                displayName: 'Product Name',
                backend    : '_id'
            },

            productType: {
                displayName: 'Product Type',
                backend    : 'info.productType'
            },

            canBeSold: {
                displayName: 'Can be Sold',
                backend    : 'canBeSold'
            },

            canBeExpensed: {
                displayName: 'Can be Expensed',
                backend    : 'canBeExpensed'
            },

            canBePurchased: {
                displayName: 'Can be Purchased',
                backend    : 'canBePurchased'
            }
        },

        Quotations: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        Invoices: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        salesQuotations: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['project', 'supplier', 'salesManager', 'workflow']
        },

        salesOrders: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['project', 'supplier', 'salesManager', 'workflow']
        },

        Orders: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            }
        },

        PayrollExpenses: {
            employee: {
                displayName: 'Employee',
                backend    : 'employee._id'
            },

            type: {
                displayName: 'Payment Type',
                backend    : 'type._id'
            },

            dataKey: {
                displayName: 'Data Key',
                backend    : 'dataKey',
                type       : 'string'
            }
        },

        jobsDashboard: {
            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            type: {
                displayName: 'Type',
                backend    : 'type',
                type       : 'string'
            },

            paymentsCount: {
                displayName: 'Payment Count',
                backend    : 'payment.count',
                type       : 'integer'
            }
        },

        salaryReport: {
            employee: {
                displayName: 'Employee',
                backend    : '_id'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            onlyEmployees: {
                displayName: 'Only Employees',
                backend    : 'onlyEmployees',
                type       : 'boolean'
            },

            array: ['employee', 'department', 'onlyEmployees']
        },

        journalEntry: {
            journalName: {
                displayName: 'Journal',
                backend    : 'journal.name',
                type       : 'string'
            },

            sourceDocument: {
                displayName: 'Subject',
                backend    : 'sourceDocument.subject._id'
            },

            creditAccount: {
                displayName: 'Credit Account',
                backend    : 'journal.creditAccount._id'
            },

            salesManager: {
                backend: 'salesmanager._id'
            },

            project: {
                backend: 'project._id'
            },

            type: {
                backend: 'project.projecttype',
                type   : 'string'
            },

            date: {
                backend: 'date',
                type   : 'date'
            },

            array: ['journalName', 'sourceDocument', 'creditAccount']
        },

        inventoryReport: {
            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesmanager._id'
            },

            type: {
                displayName: 'Project Type',
                backend    : 'project.projecttype',
                type       : 'string'
            },

            date: {
                backend: 'date',
                type   : 'date'
            },

            array: ['project', 'salesManager', 'type']
        }
    };

    if (typeof window === 'object' && this === window) {
        root = window;
    } else if (typeof global === 'object' && this === global) {
        root = global;
    } else {
        root = this;
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = FILTERS;
        }
    } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return FILTERS;
        });
    } else {
        root.FILTERS = FILTERS;
    }
}());
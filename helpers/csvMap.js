module.exports = (function () {
    'use strict';
    var moment = require('../public/js/libs/moment/moment');
    var dateFormat = 'MMMM Do YYYY';

    var journalEntry = {
        collection: 'journalentries',
        schema    : 'journalEntry',
        aliases   : {
            timestamp            : 'Number',
            date                 : 'Accounting date',
            'journal.name'       : 'Journal',
            'sourceDocument.name': 'Source Document',
            'account.name'       : 'Account',
            debit                : 'Debit',
            credit               : 'Credit'
        },
        formatters: {
            'Accounting date': function (date) {
                return moment(date).utc().format(dateFormat);
            }
        }
    };

    var jobs = {
        collection: 'jobs',
        schema    : 'jobs',
        aliases   : {
            salesManager: 'salesManager',
            project     : 'project',
            name        : 'name',
            workflow    : 'workflow',
            type        : 'type',
            cost        : 'cost',
            costQA      : 'costQA',
            costDesign  : 'costDesign',
            costIOS     : 'costIOS',
            costAndroid : 'costAndroid',
            costUnity   : 'costUnity',
            costDotNet  : 'costDotNet',
            costWeb     : 'costWeb',
            costROR     : 'costROR',
            costDev     : 'costDev',
            hoursQA     : 'hoursQA',
            hoursDesign : 'hoursDesign',
            hoursIOS    : 'hoursIOS',
            hoursAndroid: 'hoursAndroid',
            hoursUnity  : 'hoursUnity',
            hoursDotNet : 'hoursDotNet',
            hoursWeb    : 'hoursWeb',
            hoursROR    : 'hoursROR',
            hoursDev    : 'hoursDev',
            margin      : 'margin',
            devMargin   : 'devMargin',
            avDevRate   : 'avDevRate',
            profit      : 'profit',
            quotation   : 'quotation',
            invoice     : 'invoice',
            payment     : 'payment',
            count       : 'count'
        }
    };

    var department = {
        collection: 'Department',
        schema    : 'Department',
        aliases   : {
            name             : 'Department Name',
            parentDepartment : 'Parent Department',
            departmentManager: 'Department Manager',
            users            : 'Users',
            'createdBy.user' : 'Created User',
            'createdBy.date' : 'Created Date',
            'editedBy.user'  : 'Edited User',
            'editedBy.date'  : 'Edited Date',
            nestingLevel     : 'Nesting Level',
            sequence         : 'Sequence'
        },

        arrayKeys: {
            users: true
        },

        formatters: {
            'Created Date': function (date) {
                return moment(date).format(dateFormat);
            },

            'Edited Date': function (date) {
                return moment(date).format(dateFormat);
            }
        }

    };

    var employees = {
        collection: 'Employees',
        schema    : 'Employee',
        aliases   : {
            isEmployee           : 'Is Employee',
            'name.first'         : 'First Name',
            'name.last'          : 'Last Name',
            'workAddress.street' : 'Work Address Street',
            'workAddress.city'   : 'Work Address City',
            'workAddress.state'  : 'Work Address State',
            'workAddress.zip'    : 'Work Address Zip',
            'workAddress.country': 'Work Address Country',
            workEmail            : 'Work Email',
            personalEmail        : 'Personal Email',
            'workPhones.mobile'  : 'Work Phone Mobile',
            'workPhones.phone'   : 'Work Phone',
            skype                : 'Skype',
            'department.name'    : 'Department Name',
            'jobPosition.name'   : 'Job Position Name',
            'manager.name'       : 'Manager Name',
            nationality          : 'Nationality',
            identNo              : 'Ident No',
            passportNo           : 'Passport No',
            bankAccountNo        : 'Bank Account No',
            'homeAddress.street' : 'Home Address Street',
            'homeAddress.city'   : 'Home Address City',
            'homeAddress.state'  : 'Home Address State',
            'homeAddress.zip'    : 'Home Address Zip',
            'homeAddress.country': 'Home Address Country',
            dateBirth            : 'Date Birth',
            age                  : 'Age',
            daysForBirth         : 'Days For Birth',
            source               : 'Source',
            otherInfo            : 'Other Info',
            expectedSalary       : 'Expected Payroll',
            proposedSalary       : 'Proposed Payroll',
            'createdBy.user'     : 'Created User',
            'createdBy.date'     : 'Created Date',
            'editedBy.user'      : 'Edited By User',
            'editedBy.date'      : 'Edited By Date',
            marital              : 'Marital',
            gender               : 'Gender',
            jobType              : 'JobType',
            'social.FB'          : 'Facebook',
            'social.LI'          : 'Linkedin',
            'social.GP'          : 'Google+',
            transfers            : 'transfers'
        },

        arrayKeys: {
            'groups.users': true,
            'groups.group': true,
            hire          : true,
            fire          : true,
            attachments   : true,
            transfers     : true
        },

        formatters: {
            'Date Birth': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Created Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Creation Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Edited By Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Contract End Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Is Lead': function (number) {
                switch (number) {
                    case 0:
                        return 'Low';
                    case 1:
                        return 'Medium';
                    case 2:
                        return 'High';
                    // skip default;
                }
            },

            /* Hire: function (array) {
             var result = [];
             array.forEach(function (item) {
             result.push(moment(item).utc().format(dateFormat));
             });
             return result;
             },

             Fire: function (array) {
             var result = [];
             array.forEach(function (item) {
             result.push(moment(item).utc().format(dateFormat));
             });
             return result;
             },*/

            transfers: function (array) {
                var result = [];
                array.forEach(function (item) {
                    result.push(moment(item.date).format(dateFormat));
                });
                return result;
            }

        }
    };

    var users = {
        collection: 'Users',
        schema    : 'User',
        aliases   : {
            imageSrc                                    : 'ImageSrc',
            login                                       : 'Login',
            email                                       : 'Email',
            pass                                        : 'Pass',
            'credentials.refresh_token'                 : 'Credentials Refresh Token',
            'credentials.access_token'                  : 'Credentials Access Token',
            profile                                     : 'Profile',
            lastAccess                                  : 'LastAccess',
            'kanbanSettings.opportunities.countPerPage' : 'Opportunities Count Per Page',
            'kanbanSettings.opportunities.foldWorkflows': 'Opportunities Fold Workflows',
            'kanbanSettings.applications.countPerPage'  : 'Applications Count Per Page',
            'kanbanSettings.applications.foldWorkflows' : 'Applications Fold Workflows',
            'kanbanSettings.tasks.countPerPage'         : 'Tasks Count Per Page',
            'kanbanSettings.tasks.foldWorkflows'        : 'Tasks Fold Workflows',
            savedFilters                                : 'Saved Filters',
            relatedEmployee                             : 'Related Employee'
        }
    };

    var savedFilters = {
        collection: 'savedFilters',
        schema    : 'savedFilters',
        aliases   : {
            contentView: 'ContentView',
            filter     : 'Filter'
        }
    };

    var profile = {
        collection: 'Profile',
        schema    : 'Profile',
        aliases   : {
            profileName                     : 'Profile Name',
            profileDescription              : 'Profile Description',
            'profileAccess.module'          : 'Profile Access Module',
            'profileAccess.access.read'     : 'Profile Access Access Read',
            'profileAccess.access.editWrite': 'Profile Access Access Edit Write',
            'profileAccess.access.del'      : 'Profile Access Access Del'
        }
    };

    var module = {
        collection: 'modules',
        schema    : 'module',
        aliases   : {
            mname    : 'Name',
            href     : 'Href',
            ancestors: 'ancestors',
            users    : 'Users',
            parrent  : 'Parrent',
            link     : 'Link',
            visible  : 'Visible'
        }
    };

    var workflow = {
        collection: 'workflows',
        schema    : 'workflow',
        aliases   : {
            wName   : 'wName',
            status  : 'Status',
            name    : 'Name',
            color   : 'Color',
            sequence: 'Sequence'
        }
    };

    var jobPosition = {
        collection: 'JobPosition',
        schema    : 'JobPosition',
        aliases   : {
            name                    : 'Name',
            expectedRecruitment     : 'Expected Recruitment',
            'interviewForm.name'    : 'Interview Form Name',
            department              : 'Department',
            description             : 'Description',
            requirements            : 'Requirements',
            workflow                : 'Workflow',
            whoCanRW                : 'Who Can RW',
            'groups.owner'          : 'Groups Owner',
            'groups.users'          : 'Groups Users',
            'groups.group'          : 'Groups Group',
            numberOfEmployees       : 'Number Of Employees',
            totalForecastedEmployees: 'Total Forecasted Employees',
            'createdBy.user'        : 'Created By User',
            'createdBy.date'        : 'Created By Date',
            'editedBy.user'         : 'Edited By User',
            'editedBy.date'         : 'Edited By Date'
        },

        arrayKeys: {
            'groups.users': true,
            'groups.group': true
        },

        formatters: {
            'Created Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Edited Date': function (date) {
                return moment(date).utc().format(dateFormat);
            }
        }
    };

    var wTrack = {
        collection: 'wTrack',
        schema    : 'wTrack',
        aliases   : {
            1                      : 'Mon',
            2                      : 'Tue',
            3                      : 'Wed',
            4                      : 'Thu',
            5                      : 'Fri',
            6                      : 'Sat',
            7                      : 'Sun',
            'project.projectName'  : 'Project Name',
            // 'project.projectmanager.name': 'Project Manager Name',
            'project.customer.Name': 'Customer Name',
            'employee.name'        : 'Employee Name',
            'department.name'      : 'Department Name',
            year                   : 'Year',
            month                  : 'Month',
            week                   : 'Week',
            worked                 : 'Worked',
            'editedBy.date'        : 'Edited By Date',
            'editedBy.user'        : 'Edited By User',
            'createdBy.date'       : 'Created By Date',
            'createdBy.user'       : 'CreatedBy By User'
        },

        arrayKeys: {
            'groups.users': true,
            'groups.group': true
        },

        formatters: {
            'Created Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Edited Date': function (date) {
                return moment(date).utc().format(dateFormat);
            }
        }
    };

    var invoice = {
        collection: 'Invoice',
        schema    : 'Invoice',
        aliases   : {
            forSales             : 'ForSales',
            'supplier.name'      : 'Supplier Name',
            sourceDocument       : 'Source Document',
            supplierInvoiceNumber: 'Supplier Invoice Number',
            paymentReference     : 'Payment Reference',
            invoiceDate          : 'Invoice Date',
            dueDate              : 'Due Date',
            paymentDate          : 'Payment Date',
            account              : 'Account',
            journal              : 'Journal',
            'salesPerson.name'   : 'Salesperson Name',
            paymentTerms         : 'Payment Term',
            paymentInfo          : 'Payment Info',
            payments             : 'Payment',
            products             : 'Products',
            'workflow.name'      : 'Workflow Name',
            'workflow.status'    : 'Workflow Status',
            whoCanRW             : 'Who Can RW',
            'groups.owner'       : 'Groups Owner',
            'groups.users'       : 'Groups Users',
            'groups.group'       : 'Groups Group',
            creationDate         : 'Creation Date',
            'createdBy.user'     : 'Created By User',
            'createdBy.date'     : 'Created By Date',
            'editedBy.user'      : 'Edited By User',
            'editedBy.date'      : 'Edited By Date'
        },

        arrayKeys: {
            'groups.users': true,
            'groups.group': true
        },

        formatters: {
            'Invoice Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Created Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Edited Date': function (date) {
                return moment(date).utc().format(dateFormat);
            }
        }

    };

    var customers = {
        collection: 'Customers',
        schema    : 'Customers',
        aliases   : {
            type                       : 'Type',
            isOwn                      : 'Is Owner',
            'name.first'               : 'First Name',
            'name.last'                : 'Last Name',
            dateBirth                  : 'Date of Birthday',
            // imageSrc                        : 'Photo',
            email                      : 'Email',
            company                    : 'Company',
            timezone                   : 'Timezone',
            'address.street'           : 'Address Street',
            'address.city'             : 'Address City',
            'address.state'            : 'Address State',
            'address.zip'              : 'Address Zip',
            'address.country'          : 'Address Country',
            website                    : 'Website',
            jobPosition                : 'Job Position',
            skype                      : 'Skype',
            'phones.phone'             : 'Phone',
            'phones.mobile'            : 'Mobile',
            'phones.fax'               : 'Fax',
            // internalNotes                   : 'Internal Notes',
            title                      : 'Title',
            'salesPurchases.isCustomer': 'Sales Purchases Is Customer',
            'salesPurchases.isSupplier': 'Sales Purchases Is Supplier',
            //relatedUser                     : 'Related User',
            // color                           : 'Color',
            'social.FB'                : 'Facebook',
            'social.LI'                : 'Linkedin',
            /* whoCanRW                        : 'Who Can RW',
             'groups.owner'                  : 'Groups Owner',
             'groups.users'                  : 'Groups Users',
             'groups.group'                  : 'Groups Group',
             notes                           : 'Notes',
             attachments                     : 'Attachments',
             history                         : 'History',*/
            'createdBy.user'           : 'Created By User',
            'createdBy.date'           : 'Created By Date',
            'editedBy.user'            : 'Edited By User',
            'editedBy.date'            : 'Edited By Date'
            /* 'companyInfo.size'              : 'Company Size',
             'companyInfo.industry'          : 'Company Industry'*/
        },

        formatters: {
            'Date of Birthday': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Created Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Edited Date': function (date) {
                return moment(date).utc().format(dateFormat);
            }
        }
    };

    var project = {
        collections: 'Project',
        schema     : 'Project',
        aliases    : {
            projectShortDesc     : 'Project Short Desc',
            projectName          : 'Project Name',
            customername         : 'Customer Name',
            'projectmanager.name': 'Project Manager Name',
            'salesmanager.name'  : 'Sales Manager Name',
            description          : 'Description',
            StartDate            : 'Start Date',
            EndDate              : 'End Date',
            TargetEndDate        : 'Target End Date',
            'workflow.name'      : 'Workflow Name',
            projecttype          : 'Project Type',
            'createdBy.user'     : 'Created By User',
            'createdBy.date'     : 'Created By Date',
            'editedBy.user'      : 'Edited By User',
            'editedBy.date'      : 'Edited By Date'
        },
        arrayKeys  : {
            'groups.users': true,
            'groups.group': true
        },
        formatters : {
            'Target End Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },
            'Start Date'     : function (date) {
                return moment(date).utc().format(dateFormat);
            },
            'End Date'       : function (date) {
                return moment(date).utc().format(dateFormat);
            },
            'Created By Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },
            'Edited By Date' : function (date) {
                return moment(date).utc().format(dateFormat);
            }
        }
    };

    var industry = {
        collection: 'Industry',
        schema    : 'Industry',
        aliases   : {
            name: 'Name'
        }
    };

    var task = {
        collections: 'Tasks',
        schema     : 'Tasks',
        aliases    : {
            summary         : 'Summary',
            taskCount       : 'Task Count',
            project         : 'Project',
            assignedTo      : 'Assigned To',
            tags            : 'Tags',
            description     : 'Description',
            priority        : 'Priority',
            sequence        : 'Sequence',
            customer        : 'Customer',
            StartDate       : 'Start Date',
            EndDate         : 'EndDate',
            duration        : 'Duration',
            workflow        : 'Workflow',
            type            : 'Type',
            estimated       : 'Estimated',
            logged          : 'Logged',
            remaining       : 'Remaining',
            progress        : 'Progress',
            'createdBy.user': 'Created By User',
            'createdBy.date': 'Created By Date',
            notes           : 'Notes',
            attachments     : 'Attachments',
            'editedBy.user' : 'Edited By User',
            'editedBy.date' : 'Edited By Date'
        },

        formatters: {
            'Start Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Created Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Edited Date': function (date) {
                return moment(date).utc().format(dateFormat);
            }
        }
    };

    var product = {
        collections: 'Products',
        schema     : 'Products',
        aliases    : {
            wTrack                    : 'wTrack',
            canBeSold                 : 'Can Be Sold',
            canBeExpensed             : 'Can Be Expensed',
            eventSubscription         : 'Event Subscription',
            canBePurchased            : 'Can Be Purchased',
            imageSrc                  : 'Photo',
            name                      : 'Name',
            'info.productType'        : 'Info Product Type',
            'info.salePrice'          : 'Info Sale Price',
            'info.isActive'           : 'Info Is Active',
            'info.barcode'            : 'Info Barcode',
            'info.description'        : 'Info Description',
            'accounting.category.name': 'Accounting Category Name',
            workflow                  : 'Workflow',
            whoCanRW                  : 'Who Can RW',
            'groups.owner'            : 'Groups Owner',
            'groups.users'            : 'Groups Users',
            'groups.group'            : 'Groups Group',
            creationDate              : 'Creation Date',
            'createdBy.user'          : 'Created By User',
            'createdBy.date'          : 'Created By Date',
            'editedBy.user'           : 'Edited By User',
            'editedBy.date'           : 'Edited By Date'
        },

        arrayKeys: {
            'groups.users': true,
            'groups.group': true
        },

        formatters: {
            'Created Date': function (date) {
                return moment(date).utc().format(dateFormat);
            },

            'Edited Date': function (date) {
                return moment(date).utc().format(dateFormat);
            }
        }
    };

    return {
        Department  : department,
        Users       : users,
        savedFilters: savedFilters,
        Profile     : profile,
        modules     : module,
        workflows   : workflow,
        JobPosition : jobPosition,
        Employees   : employees,
        wTrack      : wTrack,
        Invoice     : invoice,
        Customers   : customers,
        Project     : project,
        Industry    : industry,
        Tasks       : task,
        Products    : product,
        journalEntry: journalEntry,
        jobs        : jobs
    };

})();

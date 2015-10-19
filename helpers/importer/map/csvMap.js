module.exports = (function () {

    var department = {
        collection  : 'Department',
        schema      : 'Department',
        aliases     : {
            ID               : 'ID',
            departmentName   : 'Department Name',
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
        arrayKeys   : {
            users: true
        },
        objectIdList: {
            parentDepartment : 'Department',
            departmentManager: 'Employees',
            users            : 'Users',
            'createdBy.user' : 'Users',
            'editedBy.user'  : 'Users'
        }

    };

    var employees = {
        collection  : 'Employees',
        schema      : 'Employee',
        aliases     : {
            isEmployee           : 'Is Employee',
            imageSrc             : 'Photo',
            subject              : 'Subject',
            'name.first'         : 'First Name',
            'name.last'          : 'Last Name',
            tags                 : 'Tags',
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
            officeLocation       : 'Office Location',
            relatedUser          : 'Related User',
            visibility           : 'Visibility',
            'department.name'    : 'Department Name',
            'department._id'     : 'Department Id',
            'jobPosition._id'    : 'Job Position Id',
            'jobPosition.name'   : 'Job Position Name',
            'manager.name'       : 'Manager Name',
            'manager._id'        : 'Manager Id',
            coach                : 'Coach',
            nationality          : 'Nationality',
            identNo              : 'Ident No',
            passportNo           : 'Passport No',
            bankAccountNo        : 'Bank Account No',
            otherId              : 'Other Id',
            'homeAddress.street' : 'Home Address Street',
            'homeAddress.city'   : 'Home Address City',
            'homeAddress.state'  : 'Home Address State',
            'homeAddress.zip'    : 'Home Address Zip',
            'homeAddress.country': 'Home Address Country',
            dateBirth            : 'Date Birth',
            age                  : 'Age',
            daysForBirth         : 'Days For Birth',
            nextAction           : 'Next Action',
            source               : 'Source',
            referredBy           : 'Referred By',
            active               : 'Active',
            workflow             : 'Workflow',
            whoCanRW             : 'Who Can RW',
            'groups.owner'       : 'Groups Owner',
            'groups.users'       : 'Groups Users',
            'groups.group'       : 'Groups Group',
            otherInfo            : 'Other Info',
            expectedSalary       : 'Expected Salary',
            proposedSalary       : 'Proposed Salary',
            color                : 'Color',
            creationDate         : 'Creation Date',
            'createdBy.user'     : 'Created User',
            'createdBy.date'     : 'Created Date',
            'editedBy.user'      : 'Edited By User',
            'editedBy.date'      : 'Edited By Date',
            attachments          : 'Attachments',
            'contractEnd.reason' : 'Contract End Reason',
            'contractEnd.date'   : 'Contract End Date',
            marital              : 'Marital',
            gender               : 'Gender',
            jobType              : 'JobType',
            sequence             : 'Sequence',
            isLead               : 'IsLead',
            ID                   : 'ID',
            'social.FB'          : 'Facebook',
            'social.LI'          : 'Linkedin',
            'social.GP'          : 'Google+',
            hire                 : 'Hire',
            fire                 : 'Fire',
            lastFire             : 'LastFire',
            transferred          : 'Transferred'
        },
        arrayKeys   : {
            'groups.users': true,
            'groups.group': true,
            hire          : true,
            fire          : true,
            attachments   : true
        },
        objectIdList: {
            relatedUser      : 'Users',
            'department._id' : 'Department',
            'jobPosition._id': 'JobPosition',
            'manager._id'    : 'Employees',
            coach            : 'Employees',
            workflow         : 'workflows',
            'groups.owner'   : 'Users',
            'groups.users'   : 'Users',
            'groups.group'   : 'Department',
            'createdBy.user' : 'User',
            'editedBy.user'  : 'User'
        }
    };

    var users = {
        collection: 'Users',
        schema    : 'User',
        aliases   : {
            ID                                          : 'Id',
            imageSrc                                    : 'Photo',
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
            RelatedEmployee                             : 'Related Employee'
        }
    };

    var savedFilters = {
        collection: 'savedFilters',
        schema    : 'savedFilters',
        aliases   : {
            ID         : 'Id',
            contentView: 'ContentView',
            filter     : 'Filter'
        }
    };

    var profile = {
        collection: 'Profile',
        schema    : 'Profile',
        aliases   : {
            ID                              : 'Id',
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
            ID       : 'Id',
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
            ID      : 'ID',
            wId     : 'wId',
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
            'interviewForm.id'      : 'Interview Form Id',
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
            'editedBy.date'         : 'Edited By Date',
            ID                      : 'ID'
        },
        arrayKeys : {
            'groups.users': true,
            'groups.group': true
        }
    };

    var wTrack = {
        collection  : 'wTrack',
        schema      : 'wTrack',
        aliases     : {
            1                            : 'Mon',
            2                            : 'Tue',
            3                            : 'Wed',
            4                            : 'Thu',
            5                            : 'Fri',
            6                            : 'Sat',
            7                            : 'Sun',
            ID                           : 'ID',
            project                      : 'Project',
            dateByWeek                   : 'Date By Week',
            dateByMonth                  : 'Date By Month',
            'project._id'                : 'Project Id',
            'project.projectName'        : 'Project Name',
            'project.projectmanager._id' : 'Project Manager Id',
            'project.projectmanager.name': 'Project Manager Name',
            'project.workflow._id'       : 'Workflow Id',
            'project.workflow.name'      : 'Workflow Name',
            'project.workflow.status'    : 'Workflow Status',
            'project.customer._id'       : 'Customer Id',
            'project.customer.Name'      : 'Customer Name',
            'employee._id'               : 'Employees',
            'employee.name'              : 'Employees Name',
            'department._id'             : 'Department Id',
            'department.departmentName'  : 'Department Name',
            year                         : 'Year',
            month                        : 'Month',
            week                         : 'Week',
            worked                       : 'Worked',
            rate                         : 'Rate',
            revenue                      : 'Revenue',
            cost                         : 'Cost',
            amount                       : 'Amount',
            isPaid                       : 'isPaid',
            invoice                      : 'Invoice Id',
            'info.productType'           : 'Info Product Type',
            'info.salePrice'             : 'Info Sale Price',
            whoCanRW                     : 'Who Can RW',
            'groups.owner'               : 'Groups Owner',
            'groups.users'               : 'Groups Users',
            'groups.group'               : 'Groups Group',
            'editedBy.user'              : 'Edited By User',
            'editedBy.date'              : 'Edited By Date',
            'createdBy.user'             : 'Created By User',
            'createdBy.date'             : 'Created By Date'
        },
        arrayKeys   : {
            'groups.users': true,
            'groups.group': true
        },
        objectIdList: {
            'project._id'               : 'Project',
            'project.projectmanager._id': 'Project',
            'project.workflow._id'      : 'workflows',
            'project.customer._id'      : 'Customers',
            'employee._id'              : 'Employees',
            'department._id'            : 'Department',
            invoice                     : 'Invoice',
            'info.productType'          : 'productTypes',
            'groups.owner'              : 'Users',
            'groups.users'              : 'Users',
            'groups.group'              : 'Department',
            'createdBy.user'            : 'User',
            'editedBy.user'             : 'User'
        }
    };


    var invoice = {
        collection  : 'Invoice',
        schema      : 'Invoice',
        aliases     : {
            ID                   : 'Id',
            forSales             : 'ForSales',
            'supplier._id'       : 'Supplier ID',
            'supplier.name'      : 'Supplier Name',
            sourceDocument       : 'Source Document',
            supplierInvoiceNumber: 'Supplier Invoice Number',
            paymentReference     : 'Payment Reference',
            invoiceDate          : 'Invoice Date',
            dueDate              : 'Due Date',
            paymentDate          : 'Payment Date',
            account              : 'Account',
            journal              : 'Journal',
            'salesPerson._id'    : 'Sales Person ID',
            'salesPerson.name'   : 'Sales Person Name',
            paymentTerms         : 'Payment Term',
            paymentInfo          : 'Payment Info',
            payments             : 'Payment',
            products             : 'Products',
            'workflow._id'       : 'Workflow Id',
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
        arrayKeys   : {
            'groups.users': true,
            'groups.group': true
        },
        objectIdList: {
            'supplier._id'   : 'Customers',
            'salesPerson._id': 'Employees',
            paymentTerms     : 'PaymentTerm',
            payments         : 'Payment',
            'workflow._id'   : 'workflows',
            'groups.owner'   : 'Users',
            'groups.users'   : 'Users',
            'groups.group'   : 'Department',
            'createdBy.user' : 'User',
            'editedBy.user'  : 'User'
        }


    };

    var customers = {
        collection  : 'Customers',
        schema      : 'Customers',
        aliases     : {
            type                            : 'Type',
            isOwn                           : 'Is Owner',
            'name.first'                    : 'First Name',
            'name.last'                     : 'Last Name',
            dateBirth                       : 'Date Birthday',
            imageSrc                        : 'Photo',
            email                           : 'Email',
            company                         : 'Company',
            department                      : 'Department',
            timezone                        : 'Timezone',
            'address.street'                : 'Address Street',
            'address.city'                  : 'Address City',
            'address.state'                 : 'Address State',
            'address.zip'                   : 'Address Zip',
            'address.country'               : 'Address Country',
            website                         : 'Website',
            jobPosition                     : 'Job Position',
            skype                           : 'Skype',
            'phones.phone'                  : 'Phone',
            'phones.mobile'                 : 'Mobile',
            'phones.fax'                    : 'Fax',
            contacts                        : 'Contacts',
            internalNotes                   : 'Internal Notes',
            title                           : 'Title',
            'salesPurchases.isCustomer'     : 'Sales Purchases Is Customer',
            'salesPurchases.isSupplier'     : 'Sales Purchases Is Supplier',
            'salesPurchases.salesPerson'    : 'Sales Purchases Sales Person',
            'salesPurchases.salesTeam'      : 'Sales Purchases Sales Team',
            'salesPurchases.implementedBy'  : 'Sales Purchases Implemented By',
            'salesPurchases.active'         : 'Sales Purchases Active',
            'salesPurchases.reference'      : 'Sales Purchases Reference',
            'salesPurchases.language'       : 'Sales Purchases Language',
            'salesPurchases.receiveMessages': 'Sales Purchases Receive Messages',
            relatedUser                     : 'Related User',
            color                           : 'Color',
            'social.FB'                     : 'Facebook',
            'social.LI'                     : 'Linkedin',
            whoCanRW                        : 'Who Can RW',
            'groups.owner'                  : 'Groups Owner',
            'groups.users'                  : 'Groups Users',
            'groups.group'                  : 'Groups Group',
            notes                           : 'Notes',
            attachments                     : 'Attachments',
            history                         : 'History',
            'createdBy.user'                : 'Created By User',
            'createdBy.date'                : 'Created By Date',
            'editedBy.user'                 : 'Edited By User',
            'editedBy.date'                 : 'Edited By Date',
            'companyInfo.size'              : 'Company Size',
            'companyInfo.industry'          : 'Company Industry',
            ID                              : 'Id'
        },
        arrayKeys   : {
            'groups.users': true,
            'groups.group': true
        },
        objectIdList: {
            wTrack                   : 'wTrack',
            'info.productType'       : 'productType',
            'accounting.category._id': 'ProductCategory',
            workflow                 : 'workflows',
            'groups.owner'           : 'Users',
            'groups.users'           : 'Users',
            'groups.group'           : 'Department',
            'createdBy.user'         : 'User',
            'editedBy.user'          : 'User'
        }

    };

    var project = {
        collections : 'Project',
        schema      : 'Project',
        aliases     : {
            projectShortDesc     : 'Project Short Desc',
            projectName          : 'Project Name',
            task                 : 'Task',
            'customer._id'       : 'Customers Id',
            'customername'       : 'Customer Name',
            'projectmanager._id' : 'Project Manager Id',
            'projectmanager.name': 'Project Manager Name',
            description          : 'Description',
            whoCanRW             : 'Who Can RW',
            'groups.owner'       : 'Groups Owner',
            'groups.users'       : 'Groups Users',
            'groups.group'       : 'Groups Group',
            StartDate            : 'Start Date',
            EndDate              : 'End Date',
            TargetEndDate        : 'Target End Date',
            sequence             : 'Sequence',
            parent               : 'Parent',
            'workflow._id'       : 'Workflow Id',
            'workflow.name'      : 'Workflow Name',
            estimated            : 'Estimated',
            logged               : 'Logged',
            remaining            : 'Remaining',
            progress             : 'Progress',
            'createdBy.user'     : 'Created By User',
            'createdBy.date'     : 'Created By Date',
            projecttype          : 'Project Type',
            notes                : 'Notes',
            attachments          : 'Attachments',
            'editedBy.user'      : 'Edited By User',
            'editedBy.date'      : 'Edited By Date',
            health               : 'Health',
            ID                   : 'Id',
            'bonus.employeeId'   : 'Bonus Employee Id',
            'bonus.bonusId'      : 'Bonus Id',
            'bonus.startDate'    : 'Bonus Start Date',
            'bonus.startWeek'    : 'Bonus Start Week',
            'bonus.startYear'    : 'Bonus Start Year',
            'bonus.endDate'      : 'Bonus End Date',
            'bonus.endWeek'      : 'Bonus End Week',
            'bonus.endYear'      : 'Bonus End Year'

        },
        arrayKeys   : {
            'groups.users': true,
            'groups.group': true,
            'bonus'       : true,
            task          : true
        },
        objectIdList: {
            task                : 'Task',
            'customer._id'      : 'Customers',
            'projectmanager._id': 'Employees',
            'groups.owner'      : 'Users',
            'groups.users'      : 'Users',
            'groups.group'      : 'Department',
            'workflow._id'      : 'workflows',
            'bonus.employeeId'  : 'Employees',
            'bonus.bonusId'     : 'bonusType',
            'createdBy.user'    : 'User',
            'editedBy.user'     : 'User'

        }
    };

    var industry = {
        collection: 'Industry',
        schema    : 'Industry',
        aliases   : {
            name: 'Name',
            ID  : 'Id'
        }
    };

    var task = {
        collections : 'Tasks',
        schema      : 'Tasks',
        aliases     : {
            ID              : 'Id',
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
        arrayKeys   : {
            'groups.users': true,
            'groups.group': true,
            tags          : true
        },
        objectIdList: {
            project         : 'Project',
            assignedTo      : 'Employees',
            workflow        : 'workflows',
            'createdBy.user': 'User',
            'editedBy.user' : 'User',
            customer        : 'Customers'

        }
    };

    var product = {
        collections : 'Products',
        schema      : 'Products',
        aliases     : {
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
            'accounting.category._id' : 'Accounting Category Id',
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
            'editedBy.date'           : 'Edited By Date',
            ID                        : 'Id'
        },
        arrayKeys   : {
            'groups.users': true,
            'groups.group': true
        },
        objectIdList: {
            wTrack                   : 'wTrack',
            'info.productType'       : 'productType',
            'accounting.category._id': 'ProductCategory',
            workflow                 : 'workflows',
            'groups.owner'           : 'Users',
            'groups.users'           : 'Users',
            'groups.group'           : 'Department',
            'createdBy.user'         : 'User',
            'editedBy.user'          : 'User'
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
        Product     : product,
        Companies   : customers,
        Persons     : customers
    }

})();

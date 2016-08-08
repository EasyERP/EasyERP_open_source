'use strict';

(function () {
    var root;

    var importMapping = [
        {
            value: 'type',
            parent: 'customers'
        },
        {
            value:  'isOwn',
            parent: 'customers'
        },
        {
            value: 'name.first',
            parent: 'customers'
        },
        {
            value:  'name.last',
            parent: 'customers'
        },
        {
            value: 'dateBirth',
            parent: 'customers'
        },
        {
            value:  'imageSrc',
            parent: 'customers'
        },
        {
            value: 'email',
            parent: 'customers'
        },
        {
            value:  'company',
            parent: 'customers'
        },
        {
            value: 'department',
            parent: 'customers'
        },
        {
            value:  'timezone',
            parent: 'customers'
        },
        {
            value: 'address.street',
            parent: 'customers'
        },
        {
            value:  'address.city',
            parent: 'customers'
        },
        {
            value: 'address.state',
            parent: 'customers'
        },
        {
            value:  'address.zip',
            parent: 'customers'
        },
        {
            value: 'address.country',
            parent: 'customers'
        },
        {
            value:  'website',
            parent: 'customers'
        },
        {
            value: 'jobPosition',
            parent: 'customers'
        },
        {
            value:  'skype',
            parent: 'customers'
        },
        {
            value: 'phones.phone',
            parent: 'customers'
        },
        {
            value:  'phones.mobile',
            parent: 'customers'
        },
        {
            value: 'phones.fax',
            parent: 'customers'
        },
        {
            value:  'contacts',
            parent: 'customers'
        },
        {
            value: 'internalNotes',
            parent: 'customers'
        },
        {
            value: 'title',
            parent: 'customers'
        },
        {
            value: 'salesPurchases.isCustomer',
            parent: 'customers'
        },
        {
            value:  'salesPurchases.isSupplier',
            parent: 'customers'
        },
        {
            value: 'salesPurchases.salesPerson',
            parent: 'customers'
        },
        {
            value: 'salesPurchases.salesTeam',
            parent: 'customers'
        },
        {
            value: 'salesPurchases.implementedBy',
            parent: 'customers'
        },
        {
            value:  'salesPurchases.active',
            parent: 'customers'
        },
        {
            value: 'salesPurchases.reference',
            parent: 'customers'
        },
        {
            value: 'salesPurchases.language',
            parent: 'customers'
        },
        {
            value: 'salesPurchases.receiveMessages',
            parent: 'customers'
        },
        {
            value:  'relatedUser',
            parent: 'customers'
        },
        {
            value: 'color',
            parent: 'customers'
        },
        {
            value: 'social.FB',
            parent: 'customers'
        },
        {
            value: 'social.LI',
            parent: 'customers'
        },
        {
            value:  'whoCanRW',
            parent: 'customers'
        },
        {
            value: 'groups.owner',
            parent: 'customers'
        },
        {
            value: 'groups.users',
            parent: 'customers'
        },
        {
            value: 'groups.group',
            parent: 'customers'
        },
        {
            value:  'notes',
            parent: 'customers'
        },
        {
            value: 'attachments',
            parent: 'customers'
        },
        {
            value: 'history',
            parent: 'customers'
        },
        {
            value: 'createdBy.user',
            parent: 'customers'
        },
        {
            value:  'createdBy.date',
            parent: 'customers'
        },
        {
            value: 'editedBy.user',
            parent: 'customers'
        },
        {
            value: 'editedBy.date',
            parent: 'customers'
        },
        {
            value:  'companyInfo.size',
            parent: 'customers'
        },
        {
            value: 'companyInfo.industry',
            parent: 'customers'
        },
        {
            value: 'ID',
            parent: 'customers'
        },
        {
            value: 'isEmployee',
            parent: 'employees'
        },
        {
            value: 'imageSrc',
            parent: 'employees'
        },
        {
            value: 'subject',
            parent: 'employees'
        },
        {
            value: 'name.first',
            parent: 'employees'
        },
        {
            value: 'name.last',
            parent: 'employees'
        },
        {
            value: 'tags',
            parent: 'employees'
        },
        {
            value: 'workAddress.street',
            parent: 'employees'
        },
        {
            value: 'workAddress.city',
            parent: 'employees'
        },
        {
            value: 'workAddress.state',
            parent: 'employees'
        },
        {
            value: 'workAddress.zip',
            parent: 'employees'
        },
        {
            value: 'workAddress.country',
            parent: 'employees'
        },
        {
            value: 'workEmail',
            parent: 'employees'
        },
        {
            value: 'personalEmail',
            parent: 'employees'
        },
        {
            value: 'workPhones.mobile',
            parent: 'employees'
        },
        {
            value: 'workPhones.phone',
            parent: 'employees'
        },
        {
            value: 'skype',
            parent: 'employees'
        },
        {
            value: 'officeLocation',
            parent: 'employees'
        },
        {
            value: 'relatedUser',
            parent: 'employees'
        },
        {
            value: 'visibility',
            parent: 'employees'
        },
        {
            value: 'department.name',
            parent: 'employees'
        },
        {
            value: 'department._id',
            parent: 'employees'
        },
        {
            value: 'jobPosition._id',
            parent: 'employees'
        },
        {
            value: 'jobPosition.name',
            parent: 'employees'
        },
        {
            value: 'manager.name',
            parent: 'employees'
        },
        {
            value: 'manager._id',
            parent: 'employees'
        },
        {
            value: 'coach',
            parent: 'employees'
        },
        {
            value: 'nationality',
            parent: 'employees'
        },
        {
            value: 'identNo',
            parent: 'employees'
        },
        {
            value: 'passportNo',
            parent: 'employees'
        },
        {
            value: 'bankAccountNo',
            parent: 'employees'
        },
        {
            value: 'otherId',
            parent: 'employees'
        },
        {
            value: 'homeAddress.street',
            parent: 'employees'
        },
        {
            value:  'homeAddress.city',
            parent: 'employees'
        },
        {
            value: 'homeAddress.state',
            parent: 'employees'
        },
        {
            value: 'homeAddress.zip',
            parent: 'employees'
        },
        {
            value: 'homeAddress.country',
            parent: 'employees'
        },
        {
            value:  'dateBirth',
            parent: 'employees'
        },
        {
            value: 'age',
            parent: 'employees'
        },
        {
            value: 'daysForBirth',
            parent: 'employees'
        },
        {
            value: 'nextAction',
            parent: 'employees'
        },
        {
            value:  'source',
            parent: 'employees'
        },
        {
            value: 'referredBy',
            parent: 'employees'
        },
        {
            value: 'workflow',
            parent: 'employees'
        },
        {
            value: 'whoCanRW',
            parent: 'employees'
        },
        {
            value:  'groups.owner',
            parent: 'employees'
        },
        {
            value: 'groups.users',
            parent: 'employees'
        },
        {
            value: 'groups.group',
            parent: 'employees'
        },
        {
            value: 'otherInfo',
            parent: 'employees'
        },
        {
            value:  'expectedSalary',
            parent: 'employees'
        },
        {
            value: 'proposedSalary',
            parent: 'employees'
        },
        {
            value: 'color',
            parent: 'employees'
        },
        {
            value: 'creationDate',
            parent: 'employees'
        },
        {
            value:  'createdBy.user',
            parent: 'employees'
        },
        {
            value: 'createdBy.date',
            parent: 'employees'
        },
        {
            value: 'editedBy.user',
            parent: 'employees'
        },
        {
            value: 'creationDate',
            parent: 'employees'
        },
        {
            value:  'attachments',
            parent: 'employees'
        },
        {
            value: 'marital',
            parent: 'employees'
        },
        {
            value: 'gender',
            parent: 'employees'
        },
        {
            value: 'jobType',
            parent: 'employees'
        },
        {
            value:  'sequence',
            parent: 'employees'
        },
        {
            value: 'isLead',
            parent: 'employees'
        },
        {
            value: 'ID',
            parent: 'employees'
        },
        {
            value: 'social.FB',
            parent: 'employees'
        },
        {
            value:  'social.LI',
            parent: 'employees'
        },
        {
            value: 'social.GP',
            parent: 'employees'
        },
        {
            value: 'hire',
            parent: 'employees'
        },
        {
            value: 'fire',
            parent: 'employees'
        },
        {
            value: 'lastFire',
            parent: 'employees'
        },
        {
            value: 'transferred',
            parent: 'employees'
        }
    ];

    if (typeof window === 'object' && this === window) {
        root = window;
    } else if (typeof global === 'object' && this === global) {
        root = global;
    } else {
        root = this;
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = importMapping;
        }
    } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return importMapping;
        });
    } else {
        root.importMapping = importMapping;
    }
})();
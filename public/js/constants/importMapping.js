'use strict';

(function () {
    var root;

    var importMapping = {
        Customers: [
            'type',
            'isOwn',
            'name.first',
            'name.last',
            'dateBirth',
            'imageSrc',
            'email',
            'company',
            'department',
            'timezone',
            'address.street',
            'address.city',
            'address.state',
            'address.zip',
            'address.country',
            'website',
            'jobPosition',
            'skype',
            'phones.phone',
            'phones.mobile',
            'phones.fax',
            'contacts',
            'internalNotes',
            'title',
            'salesPurchases.isCustomer',
            'salesPurchases.isSupplier',
            'salesPurchases.salesPerson',
            'salesPurchases.salesTeam',
            'salesPurchases.implementedBy',
            'salesPurchases.active',
            'salesPurchases.reference',
            'salesPurchases.language',
            'salesPurchases.receiveMessages',
            'relatedUser',
            'color',
            'social.FB',
            'social.LI',
            'whoCanRW',
            'groups.owner',
            'groups.users',
            'groups.group',
            'notes',
            'attachments',
            'history',
            'createdBy.user',
            'createdBy.date',
            'editedBy.user',
            'editedBy.date',
            'companyInfo.size',
            'companyInfo.industry',
            'ID'
        ],
        Employees: ['isEmployee',
            'imageSrc',
            'subject',
            'name.first',
            'name.last',
            'tags',
            'workAddress.street',
            'workAddress.city',
            'workAddress.state',
            'workAddress.zip',
            'workAddress.country',
            'workEmail',
            'personalEmail',
            'workPhones.mobile',
            'workPhones.phone',
            'skype',
            'officeLocation',
            'relatedUser',
            'visibility',
            'department.name',
            'department._id',
            'jobPosition._id',
            'jobPosition.name',
            'manager.name',
            'manager._id',
            'coach',
            'nationality',
            'identNo',
            'passportNo',
            'bankAccountNo',
            'otherId',
            'homeAddress.street',
            'homeAddress.city',
            'homeAddress.state',
            'homeAddress.zip',
            'homeAddress.country',
            'homeAddress.city',
            'homeAddress.state',
            'homeAddress.zip',
            'homeAddress.country',
            'age',
            'daysForBirth',
            'nextAction',
            'source',
            'referredBy',
            'workflow',
            'whoCanRW',
            'groups.owner',
            'groups.users',
            'groups.group',
            'otherInfo',
            'expectedSalary',
            'proposedSalary',
            'color',
            'creationDate',
            'createdBy.user',
            'createdBy.date',
            'editedBy.user',
            'editedBy.date',
            'attachments',
            'marital',
            'gender',
            'jobType',
            'sequence',
            'isLead',
            'ID',
            'social.FB',
            'social.LI',
            'social.GP',
            'hire',
            'fire',
            'lastFire',
            'transferred'
        ]
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
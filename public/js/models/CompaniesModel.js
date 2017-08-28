define([
    'Backbone',
    'Underscore',
    'moment',
    'Validation',
    'constants'
], function (Backbone, _, moment, Validation, CONSTANTS) {
    'use strict';

    var CompanyModel = Backbone.Model.extend({
        idAttribute: '_id',
        initialize : function () {
            this.on('invalid', function (model, errors) {
                var msg;

                if (errors.length > 0) {
                    msg = errors.join('\n');

                    App.render({
                        type   : 'error',
                        message: msg
                    });
                }
            });
        },

        parse: function (response) {
            if (!response.data) {
                if (response.createdBy) {
                    response.createdBy.date = moment(response.createdBy.date).format('DD MMM, YYYY, H:mm:ss');
                }
                if (response.editedBy) {
                    response.editedBy.date = moment(response.editedBy.date).format('DD MMM, YYYY, H:mm:ss');
                }
                if (response.notes) {
                    _.map(response.notes, function (note) {
                        note.date = moment(note.date).format('DD MMM, YYYY, H:mm:ss');
                        return note;
                    });
                }

                if (response.social && response.social.LI) {
                    response.social.LI = response.social.LI.replace('[]', 'linkedin');
                }

                if (response.notes) {
                    _.map(response.notes, function (note) {
                        note.date = moment(new Date(note.date));

                        // note.date = moment(note.date).format('DD MMM, YYYY, H:mm:ss');

                        if (note.history && (note.history.changedField === 'Date of Birth' || note.history.changedField === 'Creation Date')) {
                            note.history.changedValue = note.history.changedValue ? moment(new Date(note.history.changedValue)).format('DD MMM, YYYY') : '';
                            note.history.newValue = note.history.newValue ? moment(new Date(note.history.newValue)).format('DD MMM, YYYY') : '';
                            note.history.prevValue = note.history.prevValue ? moment(new Date(note.history.prevValue)).format('DD MMM, YYYY') : '';
                        }
                        if (note.history && note.history.changedField === 'LinkedIn') {
                            note.history.changedValue = note.history.changedValue ? note.history.changedValue.replace('[]', 'linkedin') : '';
                            note.history.newValue = note.history.newValue ? note.history.newValue.replace('[]', 'linkedin') : '';
                            note.history.prevValue = note.history.prevValue ? note.history.prevValue.replace('[]', 'linkedin') : '';
                        }

                        return note;
                    });

                   /* response.notes.forEach(function (note, index) {
                        if (!note.name && note.history && (note.history.changedField === 'Creation Date')) {
                            response.notes.splice(index, 1);
                            response.notes.unshift(note);
                            return;
                        }
                    });

                    response.notes.forEach(function (note, index) {
                        if (note.task && (note.task.workflow.status !== 'Done') && (note.task.workflow.status !== 'Cancelled')) {
                            response.notes.splice(index, 1);
                            response.notes.push(note);
                            return;
                        }
                    });*/
                }

                if (response.attachments) {
                    _.map(response.attachments, function (attachment) {
                        attachment.uploadDate = moment(attachment.uploadDate).format('DD MMM, YYYY, H:mm:ss');
                        return attachment;
                    });
                }

                return response;
            }
        },

        validate: function (attrs) {
            var errors = [];
            Validation.checkGroupsNameField(errors, true, attrs['name.first'] || attrs.name.first, 'Company');
            Validation.checkPhoneField(errors, false, attrs['phones.phone'] || attrs.phones.phone, 'Phone');
            Validation.checkPhoneField(errors, false, attrs['phones.mobile'] || attrs.phones.mobile, 'Mobile');
            Validation.checkCountryCityStateField(errors, false, attrs['address.country'] || attrs.address.country, 'Country');
            Validation.checkCountryCityStateField(errors, false, attrs['address.state'] || attrs.address.state, 'State');
            Validation.checkCountryCityStateField(errors, false, attrs['address.city'] || attrs.address.city, 'City');
            Validation.checkZipField(errors, false, attrs['address.zip'] || attrs.address.zip, 'Zip');
            Validation.checkEmailField(errors, false, attrs.email, 'Email');

            if (errors.length > 0) {
                return errors;
            }

        },

        defaults: {
            imageSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC',
            isOwn   : false,
            type    : 'Company',
            email   : '',
            name    : {
                first: '',
                last : ''
            },

            address: {
                street : '',
                city   : '',
                state  : '',
                zip    : '',
                country: ''
            },

            shippingAddress: {
                street : '',
                city   : '',
                state  : '',
                zip    : '',
                country: ''
            },

            website : '',
            contacts: [],
            phones  : {
                phone : null,
                mobile: null,
                fax   : null
            },

            internalNotes : '',
            salesPurchases: {
                isCustomer : false,
                isSupplier : false,
                salesPerson: null,
                salesTeam  : null,
                active     : true,
                reference  : '',
                language   : 'English',
                date       : null
            },

            social: {
                fb: '',
                li: ''
            },

            history    : [],
            attachments: [],
            notes      : []
        },

        urlRoot: function () {
            return CONSTANTS.URLS.COMPANIES;
        }
    });
    return CompanyModel;
});
